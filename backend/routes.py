from flask import request, jsonify
from services import (
    create_user,
    get_all_users,
    get_user_by_id,
    remove_user,
    update_user_put,
    update_user_patch,
)


def register_routes(app):

    # ── POST /users  →  create user ──────────────────────────────────────────
    @app.route("/users", methods=["POST"])
    def add_user():
        data = request.json
        if not data or not data.get("name") or not data.get("email") or not data.get("phone"):
            return jsonify({"error": "name, email and phone are required"}), 400

        # FIX: create_user now returns (user, error) tuple
        user, error = create_user(data)
        if error:
            return jsonify({"error": error}), 400

        # FIX: was returning 200; correct HTTP status for resource creation is 201
        return jsonify(user.to_dict()), 201


    # ── GET /users  →  list all users ────────────────────────────────────────
    @app.route("/users", methods=["GET"])
    def list_users():
        users = get_all_users()
        return jsonify([u.to_dict() for u in users]), 200


    # ── GET /users/<id>  →  get one user ─────────────────────────────────────
    @app.route("/users/<int:id>", methods=["GET"])
    def get_user(id):
        user = get_user_by_id(id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict()), 200


    # ── DELETE /users/<id>  →  remove user ───────────────────────────────────
    @app.route("/users/<int:id>", methods=["DELETE"])
    def delete_user(id):
        # FIX: remove_user now returns False when id doesn't exist;
        #      previously it called db.session.delete(None) → UnmappedInstanceError crash
        deleted = remove_user(id)
        if not deleted:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"message": "User deleted successfully"}), 200


    # ── PUT /users/<id>  →  full replace ─────────────────────────────────────
    @app.route("/users/<int:id>", methods=["PUT"])
    def edit_user_put(id):
        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        # FIX: update_user_put now returns None when id doesn't exist;
        #      previously it accessed user.name on None → AttributeError crash
        user = update_user_put(id, data)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict()), 200


    # ── PATCH /users/<id>  →  partial update ─────────────────────────────────
    @app.route("/users/<int:id>", methods=["PATCH"])
    def edit_user_patch(id):
        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        user = update_user_patch(id, data)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict()), 200
