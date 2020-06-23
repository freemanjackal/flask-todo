# Flask Todos app
## Backend Flask
### Installation steps
- Create a virtual environment(recommended)
-  > pip install -r requirements.txt
- You will need a mysql database named "todos" (you may use a postgreSql database but need to make a few changes and install the respective python package for postgres connection). 
  - Change in model.py *app.config["SQLALCHEMY_DATABASE_URI"]* with your own connection info.(The best approach is to have this configured in an env variable)
  - run `python model.py`, it will create the database tables needed by the project.
  - Configure a server to expose the api, you could use the builtin flask server for testing porpuses, after activating the virtual environemnt. 
    - > python app.py
    
    #### Dockerized backend
    - The python backend and a mysql database are dockerized
    - Install docker and docker-composer
    - Run  `docker-compose build` ... after that `docker-compose up -d` ... this will run a flask development server, install mysql and create database *"todo"* ... just need to follow the frontend installation steps and everything would be ready to test. create an user, login... 
    
    this will launch flask development server running by default at port 5000
### Local checks
- flake8 is used to check the code linting

## Frontend React
### Installation steps
- > npm install
- > yarn build
 - Optionally you can serve the front end instead of building it
    - > yarn start 
    
     (it will start a development server)
- it is configured to connect to backend server at `localhost:5000`, to change this modify the url in `config.js` to point to your server

### Frontend linting and local code formating
- It is configured with husky and prettier so that in every commit linting is checked.
## CI
- There is configured a github workflow to check python linting with flake8
## Api
- To develop the api was used flask-restful.
  - To test the api(for instance in postman) you need a Bearer token added in the authorization header.
  You get one when the user log in(it is returned in the response).
- To document the api was used flask-restful-swagger(it is incomplete, just a simple test)
- The api docs can be checked on *`http://server/api/spec.html`*, where **server** is where project was deployed.

## TODO:
- Add automatic formatting for python code on github actions.
- Add automatic code check for frontend.
- Change api docs flask-restful-swagger for a more complete and powerful swagger(open api) compliant package.
- Include token authorization in docs to test api endpoints.
- Generate postman collection to test endpoints.
- Include code tests for backend and frontend.
- Add all missing validations.
