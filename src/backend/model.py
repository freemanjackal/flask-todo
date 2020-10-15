from flask_sqlalchemy import SQLAlchemy
from __init__ import app
from flask_bcrypt import generate_password_hash, check_password_hash
import os
import sqlite3


try:
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
except Exception:
    app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://freeman:superman@localhost/todo"


app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy()
db.init_app(app)

def initialize(test=None):
    if test:
        apps = test
        test.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        test.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///foos.db"
        db.init_app(test)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(64), unique=True, nullable=False)
    tasks = db.relationship("Tasks", back_populates="user")

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode("utf8")

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(64), unique=True, nullable=False)
    priority = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship("User", back_populates="tasks")

    def as_dict(self):
        return {c.name: getattr(self, c.name) if c.name != "date" else getattr(self, c.name).
                strftime("%Y-%m-%d") for c in self.__table__.columns}


def init_db():
    with app.app_context():
        db.create_all()
    print("database created succesfully")


def get_user(username):
    user = db.session.query(User).filter(User.username == username).first()
    return user


def insert_task(task, priority, date, user_id):
    try:
        db.session.add(Tasks(task_name=task, priority=priority, date=date, user_id=user_id))
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(e)


def delete_task(user_id, task_id):
    task = db.session.query(Tasks).filter(Tasks.id == task_id).filter(Tasks.user_id == user_id).first()
    if not task:
        return False

    db.session.delete(task)
    db.session.commit()

    return True


def get_tasks(user_id):
    try:
        tasks = db.session.query(Tasks).filter(Tasks.user_id == user_id).order_by(
            Tasks.priority.asc(), Tasks.date.asc()).all()
        return tasks
    except Exception as ex:
        print("error getting data")
        print(ex)
        return []


def update_task(priority, date, task_id, user_id):
    task = db.session.query(Tasks).filter(Tasks.id == task_id).filter(Tasks.user_id == user_id).first()

    flag = False
    if not task:
        return False
    
    if priority:
        task.priority = priority
        flag = True
    if date:
        task.date = date
        flag = True

    if flag:
        db.session.commit()
        return True
    return False

def clear_db():
    with app.app_context():
        db.drop_all()
    

if __name__ == "__main__":

    init_db()
