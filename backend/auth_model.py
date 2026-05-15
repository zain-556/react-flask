from model import db  # ← use the single shared SQLAlchemy instance

class AuthUser(db.Model):
    __bind_key__ = "auth"          # ← tells SQLAlchemy to use the "auth" bind (auth_users.db)
    __tablename__ = "auth_users"

    id    = db.Column(db.Integer, primary_key=True)
    name  = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    reset_token   = db.Column(db.String(200), nullable=True)

    def to_dict(self):
        return {
            "id":    self.id,
            "name":  self.name,
            "email": self.email
        }