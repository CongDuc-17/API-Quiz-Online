from .quiz_routes import quiz_bp

def init_app(app):
    app.register_blueprint(quiz_bp) 