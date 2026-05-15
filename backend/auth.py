from flask import request, jsonify
from auth_services import (
    register_user,
    login_user,
    logout_user,
    forgot_password,
    reset_password,
    verify_token
)

def register_auth_routes(app):

    @app.route('/auth/register', methods=['POST'])
    def register():
        data = request.json or {}
        user, error = register_user(data)
        if error:
            return jsonify({"error": error}), 400
        return jsonify({"message": "registered successfully", "user": user.to_dict()}), 201


    @app.route('/auth/login', methods=['POST'])
    def login():
        data = request.json or {}
        token, error = login_user(data)
        if error:
            return jsonify({"error": error}), 401
        return jsonify({"message": "login successful", "token": token}), 200


    @app.route('/auth/logout', methods=['POST'])
    def logout():
        token = _get_token(request)
        user_id, error = verify_token(token)
        if error:
            return jsonify({"error": error}), 401
        logout_user(token)
        return jsonify({"message": "logged out successfully"}), 200


    @app.route('/auth/forgot-password', methods=['POST'])
    def forgot():
        data = request.json or {}
        reset_token, error = forgot_password(data)
        if error:
            return jsonify({"error": error}), 404
        return jsonify({"message": "use this token to reset your password", "reset_token": reset_token}), 200


    @app.route('/auth/reset-password', methods=['POST'])
    def reset():
        data = request.json or {}
        success, error = reset_password(data)
        if error:
            return jsonify({"error": error}), 400
        return jsonify({"message": "password reset successfully"}), 200


def _get_token(request):
    auth_header = request.headers.get("Authorization", "")
    parts = auth_header.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return None
