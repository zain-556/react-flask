import os
from model import db
from stock_model import Stock

# Folder where uploaded images are saved
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)   # create folder if it doesn't exist


# ── CREATE ──────────────────────────────────────────────────────────────────
def create_stock(data, image_file=None):
    image_url = None

    # If an image was attached, save it to disk
    if image_file and image_file.filename:
        filename  = f"{image_file.filename}"          # keep original name (add uuid in prod)
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(save_path)
        image_url = f"/{save_path}"                   # relative URL served by Flask

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
    return Stock.query.get(stock_id)


# ── SEARCH BY NAME ───────────────────────────────────────────────────────────
def search_stock_by_name(name):
    """Search for a stock item by name (case-insensitive partial match)."""
    return Stock.query.filter(Stock.name.ilike(f"%{name}%")).first()


# ── UPDATE (PUT – replace all fields) ────────────────────────────────────────
def update_stock_put(stock_id, data, image_file=None):
    stock = Stock.query.get(stock_id)
    if not stock:
        return None

    stock.name        = data.get("name", stock.name)
    stock.category    = data.get("category", stock.category)
    stock.quantity    = int(data.get("quantity", stock.quantity))
    stock.price       = float(data.get("price", stock.price))
    stock.description = data.get("description", stock.description)

    # Replace image only if a new one is provided
    if image_file and image_file.filename:
        filename  = image_file.filename
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(save_path)
        stock.image_url = f"/{save_path}"

    db.session.commit()
    return stock


# ── UPDATE (PATCH – update only provided fields) ─────────────────────────────
def update_stock_patch(stock_id, data, image_file=None):
    stock = Stock.query.get(stock_id)
    if not stock:
        return None

    if "name"        in data: stock.name        = data["name"]
    if "category"    in data: stock.category    = data["category"]
    if "quantity"    in data: stock.quantity    = int(data["quantity"])
    if "price"       in data: stock.price       = float(data["price"])
    if "description" in data: stock.description = data["description"]

    if image_file and image_file.filename:
        filename  = image_file.filename
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(save_path)
        stock.image_url = f"/{save_path}"

    db.session.commit()
    return stock


# ── DELETE ───────────────────────────────────────────────────────────────────
def remove_stock(stock_id):
    stock = Stock.query.get(stock_id)
    if stock:
        db.session.delete(stock)
        db.session.commit()
