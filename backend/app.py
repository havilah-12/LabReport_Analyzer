import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema, fields, ValidationError, validate
from dotenv import load_dotenv

load_dotenv()

# Environment: "sqlite" or "postgres"
DB_TYPE = os.getenv("DB_TYPE", "sqlite")

app = Flask(__name__)

# --- DATABASE SETUP ---
if DB_TYPE == "postgres":
    POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost/lab_reports")
    app.config["SQLALCHEMY_DATABASE_URI"] = POSTGRES_URL
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# --- MODEL ---
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(250), nullable=False)

# --- VALIDATION ---
class CommentSchema(Schema):
    text = fields.Str(required=True, validate=[validate.Length(min=1, max=250)])

comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)

@app.before_first_request
def create_tables():
    db.create_all()

# --- ROUTES ---

@app.route('/comments', methods=['POST'])
def create_comment():
    try:
        data = comment_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400
    comment = Comment(text=data['text'])
    db.session.add(comment)
    db.session.commit()
    return jsonify({"id": comment.id, "text": comment.text}), 201

@app.route('/comments', methods=['GET'])
def get_comments():
    comments = Comment.query.all()
    return jsonify([{"id": c.id, "text": c.text} for c in comments]), 200

@app.route('/comments/<int:id>', methods=['GET'])
def get_comment(id):
    comment = Comment.query.get(id)
    if not comment:
        return jsonify({"error": "Comment not found"}), 404
    return jsonify({"id": comment.id, "text": comment.text}), 200

@app.route('/comments/<int:id>', methods=['PUT'])
def update_comment(id):
    comment = Comment.query.get(id)
    if not comment:
        return jsonify({"error": "Comment not found"}), 404
    try:
        data = comment_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400
    comment.text = data['text']
    db.session.commit()
    return jsonify({"id": comment.id, "text": comment.text}), 200

@app.route('/comments/<int:id>', methods=['DELETE'])
def delete_comment(id):
    comment = Comment.query.get(id)
    if not comment:
        return jsonify({"error": "Comment not found"}), 404
    db.session.delete(comment)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
