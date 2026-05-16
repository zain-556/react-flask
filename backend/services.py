from model import db, User


def create_user(data):
    user = User(
        name=data["name"],
        email=data["email"],
        phone=data["phone"]
    )
    db.session.add(user)
    db.session.commit()
    return user, None


def get_all_users():
    return User.query.all()


def get_user_by_id(id):
    # FIX: replaced deprecated User.query.get(id) with db.session.get()
    return db.session.get(User, id)


def remove_user(id):
    # FIX: replaced deprecated .query.get(); added null-check to avoid
    #      UnmappedInstanceError when id doesn't exist
    user = db.session.get(User, id)
    if not user:
        return False
    db.session.delete(user)
    db.session.commit()
    return True


def update_user_put(id, data):
    # FIX: replaced deprecated .query.get(); added null-check so accessing
    #      user.name on None no longer raises AttributeError
    user = db.session.get(User, id)
    if not user:
        return None
    user.name  = data["name"]
    user.email = data["email"]
    user.phone = data["phone"]
    db.session.commit()
    return user


def update_user_patch(id, data):
    # FIX: replaced deprecated .query.get()
    user = db.session.get(User, id)
    if not user:
        return None

    if "name"  in data: user.name  = data["name"]
    if "email" in data: user.email = data["email"]
    if "phone" in data: user.phone = data["phone"]

    db.session.commit()
    return user
