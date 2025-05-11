from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from ..models.models import db, User, Product, Message

# User Authentication Blueprint
auth_bp = Blueprint("auth_bp", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Missing data"}), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already registered"}), 409
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "Username already taken"}), 409

    new_user = User(username=data["username"], email=data["email"])
    new_user.set_password(data["password"]) # Use the method from the model
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "New user registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Missing data"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"message": "Invalid email or password"}), 401

    login_user(user) # Flask-Login handles session
    return jsonify({"message": "Login successful", "user_id": user.id, "username": user.username}), 200

@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

@auth_bp.route("/status", methods=["GET"])
@login_required
def status():
    return jsonify({"user_id": current_user.id, "username": current_user.username, "email": current_user.email}), 200

# Product Management Blueprint
product_bp = Blueprint("product_bp", __name__, url_prefix="/products")

@product_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([{
        "id": p.id, 
        "name": p.name, 
        "description": p.description, 
        "price": p.price, 
        "category": p.category,
        "user_id": p.user_id,
        "author_username": p.author.username if p.author else None # Access username via backref
    } for p in products])

@product_bp.route("/add", methods=["POST"])
@login_required # Ensure only logged-in users can add products
def add_product():
    data = request.get_json()
    if not data or not data.get("name") or not data.get("price"):
        return jsonify({"message": "Missing product name or price"}), 400
    
    new_product = Product(
        user_id=current_user.id, # Use the ID of the currently logged-in user
        name=data["name"],
        description=data.get("description"),
        price=data["price"],
        category=data.get("category"),
        image_paths=data.get("image_paths")
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product added successfully", "product_id": new_product.id}), 201

@product_bp.route("/<int:product_id>", methods=["PUT"])
@login_required
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    if product.user_id != current_user.id:
        return jsonify({"message": "Not authorized to update this product"}), 403
    data = request.get_json()
    product.name = data.get("name", product.name)
    product.description = data.get("description", product.description)
    product.price = data.get("price", product.price)
    product.category = data.get("category", product.category)
    product.image_paths = data.get("image_paths", product.image_paths)
    db.session.commit()
    return jsonify({"message": "Product updated successfully"}), 200

@product_bp.route("/<int:product_id>", methods=["DELETE"])
@login_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    if product.user_id != current_user.id:
        return jsonify({"message": "Not authorized to delete this product"}), 403
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully"}), 200

# Contact Message Blueprint
message_bp = Blueprint("message_bp", __name__, url_prefix="/messages")

@message_bp.route("/contact", methods=["POST"])
def contact_message():
    data = request.get_json()
    if not data or not data.get("name") or not data.get("email") or not data.get("message_body"):
        return jsonify({"message": "Missing name, email, or message body"}), 400

    new_message = Message(
        name=data["name"],
        email=data["email"],
        subject=data.get("subject"),
        message_body=data["message_body"]
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify({"message": "Message received successfully"}), 201

