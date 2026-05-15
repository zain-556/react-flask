from model import db  # reuse the same shared db instance

class Stock(db.Model):
    __tablename__ = "stocks"

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(100), nullable=False)      # product name
    category    = db.Column(db.String(50),  nullable=False)      # e.g. Electronics
    quantity    = db.Column(db.Integer,     nullable=False)      # units in stock
    price       = db.Column(db.Float,       nullable=False)      # unit price
    description = db.Column(db.String(300), nullable=True)       # optional note
    image_url   = db.Column(db.String(300), nullable=True)       # stored file path

    def to_dict(self):
        return {
            "id":          self.id,
            "name":        self.name,
            "category":    self.category,
            "quantity":    self.quantity,
            "price":       self.price,
            "description": self.description,
            "image_url":   self.image_url,
        }
