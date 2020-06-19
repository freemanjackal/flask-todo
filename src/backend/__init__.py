from flask import Flask

app = Flask(__name__,  template_folder='../frontend/build/', static_folder='../frontend/build/static')

JWT_SECRET_KEY = 'Rt1NP63m4wnBg6nyHJhyGtfsr23YKfmc2TpCOGI4nsCSs'
