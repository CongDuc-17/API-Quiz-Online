from app import db
from datetime import datetime,timezone

class UserQuizAttempt(db.Model):
    __tablename__ = 'user_quiz_attempts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    score = db.Column(db.Float)
    submitted_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user_answers = db.relationship('UserAnswer', backref='attempt', lazy=True)

    def __repr__(self):
        return f'<UserQuizAttempt {self.id}>' 