import sys
import os

# Add the project root directory to sys.path to allow absolute imports from src
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from flask import Flask
from flask_login import LoginManager
from src.models.models import db, User # Changed to absolute import
from src.routes.api_routes import auth_bp, product_bp, message_bp # Changed to absolute import

app = Flask(__name__, static_folder=".", static_url_path="")

# Database Configuration - Switched to SQLite
sqlite_db_path = os.path.join(project_root, "rwanda_agri_platform.db")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + sqlite_db_path
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "a_very_strong_secret_key_for_production_!@#$%")

db.init_app(app)

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
# login_manager.login_view = "auth_bp.login" # Uncomment and set to your login route if you have one

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth") # Added url_prefix for clarity
app.register_blueprint(product_bp, url_prefix="/api/products") # Added url_prefix for clarity
app.register_blueprint(message_bp, url_prefix="/api/messages") # Added url_prefix for clarity

@app.route("/")
def hello():
    return "Rwanda Agri Backend is running! APIs are available at /api/auth, /api/products, /api/messages. DB: SQLite"

if __name__ == "__main__":
    with app.app_context():
        print(f"Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}") 
        db.create_all()  # Create database tables if they don't exist
    app.run(debug=True, host="0.0.0.0", port=8081) # Changed port to 8081

