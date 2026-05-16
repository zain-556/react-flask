from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id    = db.Column(db.Integer,     primary_key=True)
    name  = db.Column(db.String(50),  nullable=False)
    # FIX: added unique=True — without it, duplicate emails were silently
    #      allowed, unlike AuthUser which already had this constraint.
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(50),  nullable=False)

    def to_dict(self):
        return {
            "id":    self.id,
            "name":  self.name,
            "email": self.email,
            "phone": self.phone,
        }
