import jwt
from functools import wraps
from flask import request, jsonify
from app.models.user import User

SECRET_KEY = 'Secret_key' # Fill
def test_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing!'}), 401
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            # Giải mã token
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get('userId')
            # Check User
            user = User.query.filter_by(id=user_id).first()
            if not user:
                return jsonify({'message': 'User not found!'}), 401
            request.user = user
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        return f(*args, **kwargs)
    return decorated 