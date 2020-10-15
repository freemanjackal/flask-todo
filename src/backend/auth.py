from flask import request, g
from flask_jwt_extended import create_access_token
from model import User, get_user, db
from flask_restful import Resource
import datetime
from flask_cors import CORS, cross_origin


class SignupApi(Resource):
    @cross_origin(origin="*", headers=["Content-Type", "Authorization"])
    def post(self):
        body = request.get_json(force=True)
        user = User(**body)
        user.hash_password()
        db.session.add(user)
        db.session.commit()
        id = user.id
        return {"id": str(id)}, 200


class LoginApi(Resource):
    def post(self):
        try:
            body = request.get_json(force=True)
            user = get_user(body.get("username"))
            authorized = user.check_password(body.get("password"))
            if not authorized:
                return {"error": "username or password invalid"}, 401

            expires = datetime.timedelta(days=7)
            access_token = create_access_token(identity=str(user.id), expires_delta=expires)
            
            return {"token": access_token}, 200
        except:
            return "not found", 404
