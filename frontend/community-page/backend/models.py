from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize SQLAlchemy
db = SQLAlchemy()

# Define the Post model
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique ID
    title = db.Column(db.String(100), nullable=False)  # Title of the post
    content = db.Column(db.Text, nullable=False)  # Content of the post
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp
