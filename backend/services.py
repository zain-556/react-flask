from model import db, User 



def create_user(data):
    user = User(
        name=data["name"],
        email=data["email"],
        phone=data["phone"]
    )
    db.session.add(user)
    db.session.commit()
    return user

def get_all_users():
    return User.query.all()


def get_user_by_id(id):    
    return User.query.get(id)


def remove_user(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()


def update_user_put(id,data):
    user = User.query.get(id)
    user.name = data["name"]
    user.email = data["email"]
    user.phone = data["phone"]
    db.session.commit()
    return user


def update_user_patch(id, data):
    user = User.query.get(id)

    if not user:
        return {'message': 'User not found'}, 404

    if "name" in data:
        user.name = data["name"]

    if "email" in data:
        user.email = data["email"]

    if "phone" in data:
        user.phone = data["phone"]

    db.session.commit()
    return user