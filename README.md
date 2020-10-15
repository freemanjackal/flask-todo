# Flask Todo app
## Description
The project is a simple TODO app where a user can create an account, and after login, it can create tasks with a name, priority and date. Tasks can be edited and deleted. Just the fields priority and date are editable. Tasks are sorted by their priority and date. The front-end is developed in React and the backend in Flask. There were developed some tests using Pytest. It is possible to create and deploy a docker image for the backend.
## Backend Flask
### Installation steps
- Create a virtual environment(recommended)
-  > pip install -r requirements.txt
- You will need a mysql database named "todo" (you may use a postgreSql database but need to make a few changes and install the respective python package for postgres connection). 
  - Change in model.py *app.config["SQLALCHEMY_DATABASE_URI"]* with your own connection info.(The best approach is to have this configured in an env variable)
  - run `python model.py`, it will create the database tables needed by the project.
  - Configure a server to expose the api, you could use the builtin flask server for testing porpuses, after activating the virtual environemnt. 
    - > python app.py
    
    #### Dockerized backend
    - The python backend and a mysql database are dockerized
    - Install docker and docker-composer
    - Run  `docker-compose build` ... after that `docker-compose up -d` ... this will run a flask development server, install mysql and create database *"todo"* ... just need to follow the front-end installation steps and everything would be ready to test. create a user, login... 
    
    This will launch flask development server running by default at port 5000
### Local checks
- flake8 is used to check the code linting

## Front-end React
### Installation steps
- > npm install
- > yarn build
 - Optionally you can serve the front-end instead of building it
    - > yarn start 
    
     (it will start a development server)
- it is configured to connect to backend server at `localhost:5000`, to change this modify the url in `config.js` to point to your server

### Front-end linting and local code formating
- It is configured with husky and prettier so that in every commit linting is checked.
## CI
- There is configured a github workflow to check python linting with flake8
## Api
- To develop the api was used flask-restful.
  - To test the api(for instance in postman) you need a Bearer token added in the authorization header.
  You get one when the user log in(it is returned in the response).
- To document the api it was used flask-restful-swagger(it is incomplete, just a simple test)
- The api docs can be checked on *`http://server/api/spec.html`*, where **server** is where project was deployed.

## TODO:
- Add automatic code check for the front-end.
- Change api docs flask-restful-swagger for a more complete and powerful swagger(open api) compliant package.
- Include token authorization in docs to test api endpoints.
- Generate postman collection to test endpoints.
- Include some code tests for the front-end.
- Add missing validations.
