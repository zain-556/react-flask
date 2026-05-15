import jwt
import uuid
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from model import db                   # ← shared instance
from auth_model import AuthUser

JWT_SECRET  = "z1a3i5n7u9l11a13b15e17d19i21n23"
JWT_EXPIRES = timedelta(hours=1)

token_blacklist = set()


def _make_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + JWT_EXPIRES
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def _decode_token(token):
    return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])


def register_user(data):
    if not data.get("name") or not data.get("email") or not data.get("password"):
        return None, "name, email and password are required"

    if AuthUser.query.filter_by(email=data["email"]).first():
        return None, "email already registered"

    user = AuthUser(
        name=data["name"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"])
    )
    db.session.add(user)
    db.session.commit()
    return user, None


def login_user(data):
    if not data.get("email") or not data.get("password"):
        return None, "email and password are required"

    user = AuthUser.query.filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.password_hash, data["password"]):
        return None, "invalid email or password"

    token = _make_token(user.id)
    return token, None


def logout_user(token):
    token_blacklist.add(token)


def forgot_password(data):
    if not data.get("email"):
        return None, "email is required"

    user = AuthUser.query.filter_by(email=data["email"]).first()
    if not user:
        return None, "no account with that email"

    reset_token = str(uuid.uuid4())
    user.reset_token = reset_token
    db.session.commit()
    return reset_token, None


def reset_password(data):
    if not data.get("reset_token") or not data.get("new_password"):
        return False, "reset_token and new_password are required"

    user = AuthUser.query.filter_by(reset_token=data["reset_token"]).first()
    if not user:
        return False, "invalid or expired reset token"

    user.password_hash = generate_password_hash(data["new_password"])
    user.reset_token = None
    db.session.commit()
    return True, None


def verify_token(token):
    if not token:
        return None, "missing token"
    if token in token_blacklist:
        return None, "token has been logged out"
    try:
        payload = _decode_token(token)
        return payload["user_id"], None
    except jwt.ExpiredSignatureError:
        return None, "token expired"
    except jwt.InvalidTokenError:
        return None, "invalid token"