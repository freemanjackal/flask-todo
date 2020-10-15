from flask import Flask


app = Flask(__name__,  template_folder="../frontend/build/", static_folder="../frontend/build/static")
