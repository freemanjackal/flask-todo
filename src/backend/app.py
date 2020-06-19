from flask import jsonify, request as req, render_template
from flask_restful import abort, Api, Resource
import model
from __init__ import app, JWT_SECRET_KEY
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from auth import SignupApi, LoginApi
from flask_cors import CORS, cross_origin
import datetime
from flask_restful_swagger import swagger


# api = Api(app)

api = swagger.docs(Api(app), apiVersion='1')
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/api/v1/*": {"origins": "*"}})

bcrypt = Bcrypt(app)
jwt = JWTManager(app)


@app.route('/')
def home():
    try:
        return render_template('index.html')
    except Exception:
        return "No build found of the frontend project. Check installation steps."


@app.route('/test')
def test():
    return "Working test."


class Todo(Resource):
    @swagger.operation(notes="Delete a todo item by ID",)
    @jwt_required
    def delete(self, task_id):
        user_id = get_jwt_identity()
        result = model.delete_task(user_id, task_id)
        if not result:
            abort(404, message="Todo task {} doesn't exist or you dont have permission for that operation"
                  .format(task_id))
        return '', 204

    @swagger.operation(notes="update a todo item by ID",
                       )
    @jwt_required
    @cross_origin()
    def put(self, task_id):
        # args = req.form
        """
        Just priority and date can be changed
        """
        args = req.get_json(force=True)

        priority = args.get('priority') if args.get('priority') else None
        date = args.get('date') if args.get('date') else None
        if date:
            date = date[:10]
            date = datetime.datetime.strptime(date, '%Y-%m-%d')
        user_id = get_jwt_identity()

        task = model.update_task(priority, date, task_id, user_id)
        if not task:
            abort(404, message="Cannot update task {}".format(task_id))
        return jsonify(task), 201


class TodoList(Resource):
    @swagger.operation(
        notes='Get all taks from user',
        responseClass=model.Tasks.__name__,
        nickname='get',
        consumes='application/json',
        responseMessages=[
            {
              "code": 200,
              "message": "Created. The URL of the created blueprint should be in the Location header"
            },
            {
              "code": 405,
              "message": "Invalid input"
            }
          ]
        )
    @jwt_required
    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    def get(self):
        """
        Get list of todo tasks
        """
        user_id = get_jwt_identity()
        tasks = model.get_tasks(user_id)
        return jsonify(tasks_to_json(tasks))

    @swagger.operation(
        notes='Create a TODO tak',
        responseClass=model.Tasks.__name__,
        nickname='post',
        parameters=[
            {
              "name": "body",
              "description": "The json object with task to be created.",
              "required": True,
              "allowMultiple": False,
              "dataType": "json",
              "paramType": "body"
            }
          ],
        responseMessages=[
            {
              "code": 201,
              "message": "Task created successfully."
            },
            {
              "code": 405,
              "message": "Invalid inputs."
            }
          ]
        )
    @jwt_required
    def post(self):
        try:
            """
            Create a new Task
            """
            args = req.get_json(force=True)
            task_name = args.get('task_name')
            priority = int(args.get('priority'))
            date = args.get('date')
            date = date[:10]
            date_time_obj = datetime.datetime.strptime(date, '%Y-%m-%d')
            user_id = get_jwt_identity()
            model.insert_task(task_name, priority, date_time_obj, user_id)
            tasks = model.get_tasks(user_id)
        except Exception:
            abort(405, message="Cannot add task")

        return tasks_to_json(tasks), 201


def tasks_to_json(tasks):
    result = [tt.as_dict() for tt in tasks]
    return result


"""
## Setup the Api resource routing here
## TODO: Create a different module for routing.
"""
api.add_resource(TodoList, '/api/v1/todos')
api.add_resource(Todo, '/api/v1/todos/<task_id>')
api.add_resource(SignupApi, '/api/v1/auth/signup')
api.add_resource(LoginApi, '/api/v1/auth/login')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
