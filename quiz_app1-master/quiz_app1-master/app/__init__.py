from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import Config

db = SQLAlchemy()


from app.models import Quiz, Question, Answer, User, UserQuizAttempt, UserAnswer

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    from app.routes import init_app
    init_app(app)

    return app 