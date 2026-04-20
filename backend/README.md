# Hackaton Data Intelligence Backend

A high-performance FastAPI backend designed for intelligent data processing, multi-language normalization, and cross-lingual deduplication. This system serves as the core intelligence layer for managing heterogeneous dataset entries.

---

## 🚀 1. Project Overview

### What it solves
Data fragmentation and redundancy are common when aggregating information from multiple sources. This project provides:
- **Normalization**: Standardizing raw data into a clean, searchable format.
- **Translation Orchestration**: Parallelized translation of entities across multiple languages (Hindi, Kannada, Russian, etc.).
- **Smart Deduplication**: An agent-based loop that identifies duplicates even when they are written in different scripts or languages.

### Tech Stack
- **Language**: Python 3.13+
- **Framework**: FastAPI (Asynchronous REST API)
- **Database**: MongoDB (Flexible document storage)
- **Runtime**: `uv` or `pip` for dependency management

### Architecture
The project follows a **Service-Oriented Architectural Pattern** within a monolith structure, separating the concerns of routing, business logic (services), and data access.

---

## 📂 2. Project Structure

```bash
backend/
├── app/
│   ├── api/            # FastAPI Routers (Controller layer)
│   │   ├── cache.py        # Translation cache management
│   │   ├── data.py         # Raw and Clean data retrieval
│   │   ├── deduplicate.py  # Deduplication agent interface
│   │   ├── normalize.py    # Data transformation triggers
│   │   └── translation.py  # Multi-language translation interface
│   ├── db/             # Database connection & lifecycle
│   ├── services/       # Logic layer (The "Brain")
│   │   ├── agent.py        # Deduplication orchestration
│   │   ├── cache_warmer.py # Automated LLM caching orchestration
│   │   ├── db.py           # DB access helper functions
│   │   ├── normalize.py    # Transformation rules
│   │   └── translator.py   # Parallel translation engine
│   ├── utils/          # Common helpers
│   └── main.py         # Application entry point & Middleware config
├── .env                # Secret management
├── pyproject.toml      # Project manifest & Dependencies
└── README.md           # This documentation
```

---

## 📡 3. API Reference

### Health Check
- **GET** `/api/health`
- **Description**: Returns the system status and connectivity health.
- **Success Response**: `{"status": "ok"}`

### Database Operations
- **GET** `/api/db/raw-data`
    - **Description**: Retrieves all documents from the `raw_data` collection.
    - **Success Response**: `{"count": 10, "data": [...]}`

- **GET** `/api/db/data`
    - **Description**: Retrieves all documents from the processed `data` collection.

- **POST** `/api/normalize/`
    - **Description**: Wipes the `data` collection and repopulates it with normalized versions of documents from `raw_data`.
    - **Response**: `{"message": "Normalization complete", "inserted": 10, "skipped": 2}`

### Intelligence Services
- **POST** `/api/translate/`
    - **Description**: Translates a word/name across all system-supported languages using an LLM backend.
    - **Request Body**: `{"word": "string"}`
    - **Success Response**: `{"word": "Apple", "translations": {"Hindi": "सेब", ...}}`

- **POST** `/api/deduplicate/`
    - **Description**: Runs an interactive agent loop to find duplicates in the DB for a given name.
    - **Request Body**: `{"word": "string"}`
    - **Example Request**: 
        ```bash
        curl -X POST http://localhost:8000/api/deduplicate/ \
             -H "Content-Type: application/json" \
             -d '{"word": "Ivan"}'
        ```
    - **Success Response**:
        ```json
        {
          "input_word": "Ivan",
          "matched_by_layer": 2,
          "llm_calls_made": false,
          "duplicates_found": [
            {
              "name": "Иван",
              "lang": "Russian",
              "confidence": 0.9,
              "match_type": "translation_cache"
            }
          ],
          "duplicate_languages": ["Russian"],
          "summary": {
            "total_found": 1,
            "high_confidence": 1,
            "low_confidence": 0
          }
        }
        ```

### Cache Management
- **POST** `/api/cache/warmup`
    - **Description**: Triggers the cache warmup process to translate all unique names into all missing target languages via the LLM API, persisting them in the database for zero-latency lookups.
    - **Success Response**: `{"unique_names": 100, "target_languages": ["Hindi", "Russian"], "already_cached": 50, "newly_translated": 150...}`

- **GET** `/api/cache/stats`
    - **Description**: Returns detailed statistics on the translation cache, including the percentage of coverage per target language.
    - **Success Response**: `{"total_cached_entries": 200, "coverage_by_language": {"Hindi": {"cached": 100, "total": 100, "coverage_pct": 100.0}}...}`

---

## 🔄 4. Data Flow

The system processes a deduplication request as follows:

```text
  [ Client ] -> (HTTP POST /api/deduplicate)
      |
      v
  [ FastAPI Router ] -> (app/api/deduplicate.py)
      |
      v
  [ Deduplication Agent ] -> (app/services/agent.py)
      |
      +---> [ Translation Service ] -----> [ External LLM API ]
      |         (Parallel Execution)            (OpenRouter)
      |
      +---> [ DB Service ] --------> [ MongoDB ]
      |         (Query Cluster)          (data collection)
      |
      v
  [ Aggregate Results ] -> (JSON Response)
```

---

## 🗄️ 5. Database & Storage

The system uses **MongoDB** as the persistent store. No ORM is used; instead, `pymongo` is utilized for manual control over queries and performance.

### Collections:
1. **`raw_data`**: The landing area for ingested, untrusted data.
2. **`data`**: The source of truth containing cleaned, formatted, and validated records.
3. **`cache`**: Stores translation results to minimize API costs and latency.

---

## 🔑 6. Environment Variables

Create a `.env` file in the root directory:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DB_URL` | MongoDB Connection String | `mongodb://localhost:27017` |
| `DB_NAME` | Database Name | `hackaton_db` |
| `API_KEY` | OpenRouter/LLM API Key | `sk-or-v1-...` |
| `URL` | API Endpoint URL | `https://openrouter.ai/api/...` |
| `MODEL` | LLM Model for translation | `meta-llama/llama-3-8b` |

---

## 🛡️ 7. Authentication & Security

- **CORS**: Configured in `main.py` with `allow_origins=["*"]` for compatibility with regional frontend deployments.
- **Input Validation**: Strictly enforced via Pydantic schemas in the Router layer.
- **Error Boundaries**: Routers wrapped in localized try-except blocks to prevent internal stack trace leakage.

---

## ⚙️ 8. Running Locally

### Prerequisites
- Python 3.13+
- MongoDB instance (local or Atlas)

### Setup
1. **Clone the repository** and navigate to the backend folder.
2. **Install dependencies**:
   ```bash
   uv sync
   # OR
   pip install -r requirements.txt
   ```
3. **Configure Environment**: Copy `.env.example` to `.env` and fill in your keys.
4. **Run Development Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

---

## 📦 9. Key Dependencies

- `fastapi`: Modern, fast web framework for building APIs.
- `pymongo`: Official Python driver for MongoDB.
- `requests`: Used for communicating with external translation APIs.
- `python-dotenv`: Management of environment variables.
- `uvicorn`: ASGI server for running the FastAPI application.
