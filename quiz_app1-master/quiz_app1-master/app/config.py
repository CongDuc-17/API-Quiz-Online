import os
from dotenv import load_dotenv

load_dotenv()
 
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev')
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost:3306/quiz_app'
    SQLALCHEMY_TRACK_MODIFICATIONS = False 