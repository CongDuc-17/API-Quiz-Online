from flask import Blueprint, jsonify, request
from app import db
from app.models import Quiz, Question, Answer, UserQuizAttempt, UserAnswer

from app.middleware.test_auth import test_token_required

quiz_bp = Blueprint('quiz', __name__)



# @quiz_bp.route('/test-auth-middleware', methods=['GET'])
# @test_token_required
# def test_auth_middleware():
#     return jsonify({'message': 'Token hợp lệ! Middleware test hoạt động.'}), 200

# Lấy Quiz
@quiz_bp.route('/quiz/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    quiz_data = {}
    for question in quiz.questions:
        quiz_data[question.id] = {
            'question_text': question.question_text,
            'question_id': question.id,
            'answers': [
                {
                    'answer_id': answer.id,
                    'answer_text': answer.answer_text
                }
                for answer in question.answers
            ]
        }
    return jsonify(quiz_data)

# Làm và tính điểm
@quiz_bp.route('/quiz/submit', methods=['POST'])
def submit_quiz():
    data = request.get_json()
    quiz_id = data['quiz_id']
    answers = data['answers']

    user_id = data.get('user_id')
    attempt = UserQuizAttempt(user_id=user_id, quiz_id=quiz_id)
    db.session.add(attempt)
    db.session.flush()  # Lấy attempt.id

    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    total_questions = len(quiz.questions)
    point_per_question = 10 / total_questions if total_questions > 0 else 0
    score = 0
    for ans in answers:
        question_id = ans['question_id']
        user_answer_ids = set(ans.get('answer_ids', [ans.get('answer_id')]))

        question = Question.query.get(question_id)
        if not question or question.quiz_id != quiz_id:
            return jsonify({'error': f'Question {question_id} not found in quiz {quiz_id}'}), 400

        # Lấy đáp án đúng từ DB
        correct_answers = Answer.query.filter_by(question_id=question_id, is_correct=True).all()
        correct_answer_ids = set(a.id for a in correct_answers)

        # Lưu đáp án người dùng chọn
        for answer_id in user_answer_ids:
            answer_obj = Answer.query.get(answer_id)
            if not answer_obj or answer_obj.question_id != question_id:
                return jsonify({'error': f'Answer {answer_id} not found in question {question_id}'}), 400
            user_answer = UserAnswer(
                attempt_id=attempt.id,
                question_id=question_id,
                answer_id=answer_id
            )
            db.session.add(user_answer)

        # So sánh đáp án: phải chọn đúng và đủ, thiếu/thừa đều không có điểm
        if user_answer_ids == correct_answer_ids:
            score += point_per_question

    attempt.score = round(score, 2)
    db.session.commit()

    return jsonify({'score': attempt.score})

