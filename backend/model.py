from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50) )
    email = db.Column(db.String(50))
    phone = db.Column(db.String(50),)

    def to_dict(self):
        return (
            {
                "id": self.id,
                "name": self.name,
                "email": self.email,
                "phone": self.phone
            }


        )