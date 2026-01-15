# Repo Doc Bot

Repo Doc Bot is a backend-driven system that allows users to **ingest a GitHub repository** and **ask natural-language questions about its codebase**.
It uses retrieval-augmented generation (RAG) to ground answers in real code.

This project was built as a **capstone submission**, with a strong focus on correctness, clarity, and real-world engineering decisions.

---

## ✨ Features

* Ingest any public GitHub repository
* Index the entire codebase
* Embed code into a vector database (MongoDB)
* Ask natural-language questions about the repository
* Receive answers grounded in retrieved code snippets
* End-to-end system tests

---

## 🧠 Architecture Overview

### Ingestion

* Full `git clone` of the repository
* File-type filtering (`.py`, `.js`, `.html`, `.md`, `.txt`)
* Blind chunking with overlap
* Embedding via Ollama
* Vector storage in MongoDB

### Querying

* Query embedding
* Brute-force cosine similarity retrieval
* Context injection into LLM prompt
* Concise, grounded answers

---

## 🖥️ Tech Stack

* **Backend**: FastAPI
* **Frontend**: Vanilla HTML, CSS, JavaScript
* **Vector Store**: MongoDB
* **Embeddings**: Ollama (`nomic-embed-text`)
* **LLM**: Groq (primary), Ollama fallback
* **Testing**: pytest (end-to-end system tests)

---

## 📁 Project Structure

```
repo-doc-bot/
│
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── infra/
│   │   ├── llm.py
│   │   └── db.py
│   └── tasks/
│       ├── ingest/
│       └── query/
│
├── frontend/
│   ├── ingest.html
│   ├── chat.html
│   ├── styles.css
│   ├── ingest.js
│   └── chat.js
│
├── tests/
│   ├── test_ingest.py
│   └── test_query.py
│
├── pytest.ini
├── requirements.txt
├── .env (not committed)
└── README.md
```

---

## 🚀 Running the Project

### Prerequisites

* Python 3.11+
* MongoDB (running locally)
* Ollama installed and running
* Git

### Setup

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=repo_doc_bot
MONGO_COLLECTION_NAME=code_chunks
GROQ_API_KEY=your_key_here
```

Start the backend:

```bash
uvicorn backend.main:app --reload
```

Open in browser:

```
http://localhost:8000
```

---

## 🧪 Running Tests

Make sure MongoDB and Ollama are running.

```bash
pytest
```

Tests are **system-level**:

* Real repository ingestion
* Real embeddings
* Real LLM calls

---

## 🧩 Design Decisions

* Blind chunking chosen for MVP robustness
* MongoDB used as vector store for simplicity
* Single-repo indexing by design
* UI split into separate pages to avoid state bugs
* Structural chunking intentionally deferred

These choices were made to prioritize **correctness and clarity** over premature optimization.

---

## 📌 Status

* ✅ MVP complete
* ✅ MVP+1 polish complete
* ✅ Tests passing
* ⏳ Structural chunking planned next

---

## 📄 License

This project is for academic purposes as part of a capstone submission.
