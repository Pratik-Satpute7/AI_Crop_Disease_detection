from flask import Flask, request, jsonify
from models import db, Post
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
app = Flask(__name__)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Enable CORS manually
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')  # Allow specific headers
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')  # Allow specific methods
    return response

# Create database tables (Ensures tables are created at every startup)
@app.before_request
def create_tables():
    db.create_all()

# Route: Root URL
@app.route('/')
def home():
    return "Welcome to the Community Page API! Use /api/posts to interact with posts."

# Route: Get all posts
@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    posts_data = [{'id': post.id, 'title': post.title, 'content': post.content, 'created_at': post.created_at} for post in posts]
    return jsonify(posts_data)

# Configure file upload
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Route: Create a new post with file upload
@app.route('/api/posts', methods=['POST'])
def create_post():
    title = request.form.get('title')
    content = request.form.get('content')
    file = request.files.get('file')

    file_path = None
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

    new_post = Post(title=title, content=content, file=file_path)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Post created successfully', 'file': file_path}), 201

if __name__ == '__main__':
    app.run(debug=True)
