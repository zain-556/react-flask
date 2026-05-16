import os
import jwt
import uuid
from datetime import datetime, timedelta, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from model import db
from auth_model import AuthUser

# ── SECURITY FIX 1: JWT secret loaded from environment variable ──────────────
# Never hardcode secrets in source. Set JWT_SECRET in your .env file.
# A safe random value can be generated with: python -c "import secrets; print(secrets.token_hex(32))"
JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError(
        "JWT_SECRET environment variable is not set. "
        "Add it to your .env file before starting the server."
    )

JWT_EXPIRES = timedelta(hours=1)

# ── SECURITY FIX 2: token blacklist ──────────────────────────────────────────
# The in-memory set below is kept for simplicity; it works correctly while the
# server is running but does NOT survive a restart — logged-out tokens become
# valid again after a restart.
# For production replace this with a persistent store, e.g.:
#   Redis:  redis_client.setex(token, int(JWT_EXPIRES.total_seconds()), "1")
#   SQLite: a BlacklistedToken table with an expiry column + a cleanup job.
token_blacklist: set[str] = set()


def _make_token(user_id: int) -> str:
    payload = {
        "user_id": user_id,
        # FIX: datetime.utcnow() is deprecated since Python 3.12.
        #      Use datetime.now(timezone.utc) instead.
        "exp": datetime.now(timezone.utc) + JWT_EXPIRES,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def _decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])


def register_user(data: dict):
    if not data.get("name") or not data.get("email") or not data.get("password"):
        return None, "name, email and password are required"

    if AuthUser.query.filter_by(email=data["email"]).first():
        return None, "email already registered"

    user = AuthUser(
        name=data["name"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"]),
    )
    db.session.add(user)
    db.session.commit()
    return user, None


def login_user(data: dict):
    if not data.get("email") or not data.get("password"):
        return None, "email and password are required"

    user = AuthUser.query.filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.password_hash, data["password"]):
        return None, "invalid email or password"

    token = _make_token(user.id)
    return token, None


def logout_user(token: str) -> None:
    token_blacklist.add(token)


def forgot_password(data: dict):
    if not data.get("email"):
        return None, "email is required"

    user = AuthUser.query.filter_by(email=data["email"]).first()
    if not user:
        return None, "no account with that email"

    reset_token = str(uuid.uuid4())
    user.reset_token = reset_token
    db.session.commit()
    return reset_token, None


def reset_password(data: dict):
    if not data.get("reset_token") or not data.get("new_password"):
        return False, "reset_token and new_password are required"

    user = AuthUser.query.filter_by(reset_token=data["reset_token"]).first()
    if not user:
        return False, "invalid or expired reset token"

    user.password_hash = generate_password_hash(data["new_password"])
    user.reset_token = None
    db.session.commit()
    return True, None


def verify_token(token: str | None):
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
