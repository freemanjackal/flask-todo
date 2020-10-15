import os
import tempfile
import json
import pytest

import os,sys,inspect
currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0,parentdir)

from app import app
import model
from sqlalchemy import MetaData



@pytest.fixture
def client():
    app.config["TESTING"] = True
    os.environ["test"] = "True"
    model.initialize(app)

    model.init_db()
    client = app.test_client()

    yield client

    model.clear_db()


def test_home(client):
    response = client.get("/")
    assert response.status_code == 200


def test_login(client):
    response = login(client)
    assert response.status_code == 404

def tests_signup(client):
    
    response = sign_up(client)
    assert response.status_code == 200

def test_login_after_signup(client):
    
    response = sign_up(client)
    assert response.status_code == 200
    
    response = login(client)
    assert response.status_code == 200


def sign_up(client):
    data_signup = {
        "username": "freeman",
        "password": "hello",
    }
    response = client.post("/api/v1/auth/signup", data=json.dumps(data_signup))
    return response

def login(client):
    data = {
        "username": "freeman",
        "password": "hello",
    }
    response = client.post("/api/v1/auth/login", data=json.dumps(data))
    return response



