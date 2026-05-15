from flask import request, jsonify
from stock_services import (
    create_stock,
    get_all_stocks,
    get_stock_by_id,
    search_stock_by_name,
    update_stock_put,
    update_stock_patch,
    remove_stock,
)
from auth_services import verify_token   # JWT guard reused from existing auth


# ── JWT helper ───────────────────────────────────────────────────────────────
def _get_token(req):
    """Extract Bearer token from Authorization header."""
    header = req.headers.get("Authorization", "")
    parts  = header.split()
    return parts[1] if len(parts) == 2 and parts[0].lower() == "bearer" else None


def register_stock_routes(app):

    # ── POST /stocks  →  create a new stock item (multipart form + image) ────
    @app.route("/stocks", methods=["POST"])
    def add_stock():
        # Verify JWT
        user_id, error = verify_token(_get_token(request))
        if error:
            return jsonify({"error": error}), 401

        # Form data (not JSON – we need multipart for file upload)
        data       = request.form          # text fields
        image_file = request.files.get("image")   # optional file

        # Basic validation
        if not data.get("name") or not data.get("category"):
            return jsonify({"error": "name and category are required"}), 400

        stock = create_stock(data, image_file)
        return jsonify(stock.to_dict()), 201


    # ── GET /stocks  →  list all stock items ─────────────────────────────────
    @app.route("/stocks", methods=["GET"])
    def list_stocks():
        user_id, error = verify_token(_get_token(request))
        if error:
            return jsonify({"error": error}), 401

        stocks = get_all_stocks()
        return jsonify([s.to_dict() for s in stocks]), 200


    # ── GET /stocks/<id>  →  get one stock item ───────────────────────────────
    @app.route("/stocks/<int:stock_id>", methods=["GET"])
    def get_stock(stock_id):
        user_id, error = verify_token(_get_token(request))
        if error:
            return jsonify({"error": error}), 401

        stock = get_stock_by_id(stock_id)
        if not stock:
            return jsonify({"error": "Stock item not found"}), 404
        return jsonify(stock.to_dict()), 200


    # ── GET /stocks/search  →  search stock by name ──────────────────────────
    @app.route("/stocks/search", methods=["GET"])
    def search_stock():
        user_id, error = verify_token(_get_token(request))
        if error:
            return jsonify({"error": error}), 401

        name = request.args.get("name", "").strip()
        if not name:
            return jsonify({"error": "Name parameter is required"}), 400

        stock = search_stock_by_name(name)
        if not stock:
            return jsonify({"error": "Stock item not found"}), 404
        return jsonify(stock.to_dict()), 200


    # ── PUT /stocks/<id>  →  full update ─────────────────────────────────────
    @app.route("/stocks/<int:stock_id>", methods=["PUT"])
    def edit_stock_put(stock_id):
        user_id, error = verify_token(_get_token(request))
        if error:
            return jsonify({"error": error}), 401

        data       = request.form
        image_file = request.files.get("image")

        stock = update_stock_put(stock_id, data, image_file)
        if not stock:
            return jsonify({"error": "Stock item not found"}), 404
        return jsonify(stock.to_dict()), 200


    # ── DELETE /stocks/<id>  →  remove item ──────────────────────────────────
    @app.route("/stocks/<int:stock_id>", methods=["DELETE"])
    def delete_stock(stock_id):
        user_id, error = verify_token(_get_token(request))
        if error:
            return jsonify({"error": error}), 401

        remove_stock(stock_id)
        return jsonify({"message": "Stock item deleted successfully"}), 200
