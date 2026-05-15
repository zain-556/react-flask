from flask import request, jsonify
from services import create_user, get_all_users, get_user_by_id, remove_user, update_user_put, update_user_patch

def register_routes(app):


    @app.route('/users', methods=['POST'])
    def add_user():
        data = request.json
        user = create_user(data)
        return jsonify(user.to_dict())
    


    @app.route('/users', methods=['GET'])
    def list_users():
        users = get_all_users()
        return jsonify([u.to_dict() for u in users])



    @app.route('/users/<int:id>', methods=['GET'])
    def get_user(id):
        user = get_user_by_id(id)
        if user:
            return jsonify(user.to_dict())
        else:
            return ({'message': 'User not found'}), 404


    @app.route('/users/<int:id>', methods=['DELETE'])
    def delete_user(id):
        remove_user(id)
        return {'message': 'User deleted successfully'}, 200


    @app.route('/users/<int:id>', methods=['PUT'])
    def edit_user_put(id):
        data = request.json
        user = update_user_put(id, data)
        
        return jsonify(user.to_dict())
    
   
    @app.route('/users/<int:id>', methods=['PATCH'])
    def edit_user_patch(id):
        data = request.json  

        if not data:
            return {"error": "Invalid JSON"}, 400

        user = update_user_patch(id, data)  # only updates provided fields

        if not user:
            return {"error": "User not found"}, 404

        return jsonify(user.to_dict())


