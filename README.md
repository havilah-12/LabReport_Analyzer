# 🧬 LabReport Analyzer

**LabReport Analyzer** is a full-stack application that uses Natural Language Processing (NLP) to extract diseases and assess severity levels from clinical lab report comments. Designed for healthcare professionals and researchers to gain insights from unstructured medical text.

---

## 🌟 Features

- 🧠 NLP (spaCy) powered disease & severity detection  
- 🗂️ PostgreSQL database to store and query structured insights  
- ⚙️ Flask backend with RESTful API endpoints  
- 💻 React frontend for simple UI  
- 📈 SQL scripts for schema, sample data, and custom queries  

---

## 🛠️ Tech Stack

| Layer        | Technology         |
| ------------ | ------------------ |
| Backend      | Python, Flask      |
| NLP Engine   | spaCy              |
| ORM          | SQLAlchemy         |
| Database     | PostgreSQL         |
| Frontend     | React    |

---

## 🚀 Getting Started

### 📁 Clone the Repository

```bash
git clone https://github.com/havilah-12/LabReport_Analyzer.git
cd LabReport_Analyzer

##🔌 API Endpoints

| Method | Endpoint                | Description                        |
|--------|-------------------------|------------------------------------|
| GET    | `/comments`             | Retrieve all comments              |
| POST   | `/comments`             | Submit a new comment               |
| PUT    | `/comments/<id>`        | Update a comment                   |
| DELETE | `/comments/<id>`        | Delete a comment                   |
| GET    | `/disease-distribution` | Disease occurrence frequency       |
| GET    | `/analytics-stats`      | Overall dashboard stats            |
| GET    | `/comments-analytics`   | Comments annotated with severity   |
