from app import db
from datetime import datetime,timezone

class Quiz(db.Model):
    __tablename__ = 'quizzes'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    questions = db.relationship('Question', backref='quiz', lazy=True)
    attempts = db.relationship('UserQuizAttempt', backref='quiz', lazy=True)

    def __repr__(self):
        return f'<Quiz {self.title}>' 