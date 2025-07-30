from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    # One-to-many relationship
    analytics = db.relationship('DiseaseAnalytics', backref='comment', lazy=True)


class DiseaseAnalytics(db.Model):
    __tablename__ = 'disease_analytics'
    id = db.Column(db.Integer, primary_key=True)
    comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'), nullable=False)  # ← Foreign key
    comment_text = db.Column(db.Text, nullable=False)
    disease_name = db.Column(db.String(255), nullable=False)
    severity = db.Column(db.String(50), nullable=False)
