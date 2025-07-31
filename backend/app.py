from flask import Flask, request, jsonify
from models import db, Comment, DiseaseAnalytics
from schema import CommentSchema
from marshmallow import ValidationError
from semantic_analysis.analytics import analytics_bp
from dotenv import load_dotenv
load_dotenv()
from flask_cors import CORS
import os
# Environment: "sqlite" or "postgres"
DB_TYPE = os.getenv("DB_TYPE", "sqlite")
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
# --- DATABASE SETUP ---
if DB_TYPE == "postgres":
    POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost/lab_reports")
    app.config["SQLALCHEMY_DATABASE_URI"] = POSTGRES_URL
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
import os

def execute_sql_file(file_path):
    with app.app_context():
        if not os.path.exists(file_path):
            print(f"SQL file not found: {file_path}")
            return
        with open(file_path, 'r') as f:
            sql = f.read()
        with db.engine.connect() as conn:
            for statement in sql.split(';'):
                if statement.strip():
                    conn.execute(statement)

comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)

# Register the analytics blueprint
app.register_blueprint(analytics_bp)

# Flask 2.3 compatible way to create tables
with app.app_context():
    db.create_all()
    
@app.route('/comments', methods=['POST'])
def create_comment():
    try:
        data = comment_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    comment = Comment(text=data['text'])
    db.session.add(comment)
    db.session.commit()
    return jsonify({'id': comment.id, 'text': comment.text}), 201

@app.route('/comments', methods=['GET'])
def get_comments():
    comments = Comment.query.all()
    return jsonify([{'id': c.id, 'text': c.text} for c in comments]), 200

@app.route('/comments/<int:id>', methods=['PUT'])
def update_comment(id):
    comment = Comment.query.get_or_404(id)
    try:
        data = comment_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    comment.text = data['text']
    db.session.commit()
    return jsonify({'id': comment.id, 'text': comment.text}), 200

@app.route('/comments/<int:id>', methods=['DELETE'])
def delete_comment(id):
    comment = Comment.query.get_or_404(id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'message': 'Comment deleted'}), 200

@app.route("/disease-distribution", methods=["GET"])
def disease_distribution():
    data = db.session.query(
        DiseaseAnalytics.disease_name,
        db.func.count(DiseaseAnalytics.id)
    ).group_by(DiseaseAnalytics.disease_name).all()

    results = [
        {"disease": name, "patients": count}
        for name, count in data
    ]
    return jsonify(results)
@app.route("/analytics-stats", methods=["GET"])
def analytics_stats():
    total_patients = db.session.query(db.func.count(DiseaseAnalytics.comment_id.distinct())).scalar()
    total_comments = db.session.query(db.func.count(Comment.id)).scalar()
    warnings = db.session.query(db.func.count(DiseaseAnalytics.id)).filter(DiseaseAnalytics.severity == "High").scalar()
    resolved = total_comments - warnings

    return jsonify({
        "total_patients": total_patients,
        "active_comments": total_comments,
        "warnings": warnings,
        "resolved": resolved
    })
@app.route("/comments-analytics", methods=["GET"])
def comments_analytics():
    comments = db.session.query(Comment).all()
    results = []
    for comment in comments:
        analysis = DiseaseAnalytics.query.filter_by(comment_id=comment.id).first()
        status = None
        if analysis:
            if analysis.severity == "High":
                status = "warning"
            elif analysis.severity == "Low":
                status = "positive"
            elif analysis.severity == "Medium":
                status = "info"
        results.append({
            "id": comment.id,
            "text": comment.text,
            "status": status
        })
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)