from flask import Flask
from config import config
from model import db
from routes import register_routes
from flask_cors import CORS

from auth import register_auth_routes
import auth_model   # ensure AuthUser is registered before create_all()

# ── NEW: import stock pieces ──────────────────────────────────────────────────
import stock_model                              # registers Stock table
from stock_routes import register_stock_routes  # stock CRUD routes

app = Flask(__name__)
CORS(app)

app.config.from_object(config)

app.config["SQLALCHEMY_BINDS"] = {
    "auth": "sqlite:///auth_users.db"
}

db.init_app(app)

with app.app_context():
    db.create_all()   # creates users, auth_users, AND stocks tables

register_routes(app)        # existing user routes
register_auth_routes(app)   # existing auth routes
register_stock_routes(app)  # ← NEW stock routes

if __name__ == '__main__':
    app.run(debug=True)
