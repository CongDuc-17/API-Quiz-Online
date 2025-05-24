from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .quiz import Quiz
from .question import Question
from .answer import Answer
from .user_quiz_attempt import UserQuizAttempt
from .user_answer import UserAnswer
from .user import User 