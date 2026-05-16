import os
import uuid
from model import db
from stock_model import Stock

UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def _save_image(image_file):
    """Save uploaded image with a UUID prefix to prevent filename collisions.
    FIX: original code used bare filename, so two uploads named 'photo.jpg'
         would silently overwrite each other."""
    ext       = os.path.splitext(image_file.filename)[1]   # e.g. '.jpg'
    filename  = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    image_file.save(save_path)
    return f"/{save_path}"


# ── CREATE ──────────────────────────────────────────────────────────────────
def create_stock(data, image_file=None):
    image_url = _save_image(image_file) if (image_file and image_file.filename) else None

    stock = Stock(
        name        = data.get("name"),
        category    = data.get("category"),
        quantity    = int(data.get("quantity", 0)),
        price       = float(data.get("price", 0.0)),
        description = data.get("description", ""),
        image_url   = image_url,
    )
    db.session.add(stock)
    db.session.commit()
    return stock


# ── READ ALL ─────────────────────────────────────────────────────────────────
def get_all_stocks():
    return Stock.query.all()


# ── READ ONE ─────────────────────────────────────────────────────────────────
def get_stock_by_id(stock_id):
    # FIX: replaced deprecated Stock.query.get() with db.session.get()
    return db.session.get(Stock, stock_id)


# ── SEARCH BY NAME ───────────────────────────────────────────────────────────
def search_stock_by_name(name):
    """Case-insensitive partial match on stock name."""
    return Stock.query.filter(Stock.name.ilike(f"%{name}%")).first()


# ── UPDATE (PUT – replace all fields) ────────────────────────────────────────
def update_stock_put(stock_id, data, image_file=None):
    # FIX: replaced deprecated .query.get()
    stock = db.session.get(Stock, stock_id)
    if not stock:
        return None

    stock.name        = data.get("name",        stock.name)
    stock.category    = data.get("category",    stock.category)
    stock.quantity    = int(data.get("quantity", stock.quantity))
    stock.price       = float(data.get("price", stock.price))
    stock.description = data.get("description", stock.description)

    if image_file and image_file.filename:
        stock.image_url = _save_image(image_file)

    db.session.commit()
    return stock


# ── UPDATE (PATCH – update only provided fields) ─────────────────────────────
def update_stock_patch(stock_id, data, image_file=None):
    # FIX: replaced deprecated .query.get()
    stock = db.session.get(Stock, stock_id)
    if not stock:
        return None

    if "name"        in data: stock.name        = data["name"]
    if "category"    in data: stock.category    = data["category"]
    if "quantity"    in data: stock.quantity    = int(data["quantity"])
    if "price"       in data: stock.price       = float(data["price"])
    if "description" in data: stock.description = data["description"]

    if image_file and image_file.filename:
        stock.image_url = _save_image(image_file)

    db.session.commit()
    return stock


# ── DELETE ───────────────────────────────────────────────────────────────────
def remove_stock(stock_id):
    # FIX: replaced deprecated .query.get()
    stock = db.session.get(Stock, stock_id)
    if stock:
        db.session.delete(stock)
        db.session.commit()
        return True
    return False
