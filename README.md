# 🚀 Hackaton Intelligence System: Cross-Language Data Dock

An end-to-end intelligence platform designed to normalize, translate, and deduplicate heterogeneous data entries across scripts and languages. This system combines a modern Next.js dashboard with a sophisticated FastAPI agent logic to ensure data integrity in multi-source environments.

---

## 🏗️ 1. System Architecture

The system is built on a service-oriented architecture designed for high-concurrency translation and low-latency data retrieval.

```text
  [ Client Tier ]       [ Application Tier ]       [ Intelligence Tier ]         [ Cache / Storage ]
  
  (Next.js App) <----> (FastAPI Router) <--------> (Deduplication Agent) <----> (MongoDB)
   (Dashboard)               |                            |                        | -> data
   (Edu Suite)               |                    (Translation Workers)            | -> cache
                             |                            |                        |
                             +--------------------> (OpenRouter LLM API) <---------+
```

- **Protocol**: All tiers communicate via **REST/HTTP**.
- **Execution**: The Agent operates using a synchronous-orchestration pattern with three distinct Layers (Fuzzy, Transliteration, LLM) and an internal Cache Warmer to skip heavy LLM translation loops.

---

## ⚙️ 2. THE AGENT — Core Mechanics

The **Deduplication Agent** is the heart of this platform. It doesn't just look for string matches; it understands cultural and linguistic equivalents.

### 2a. The 3-Layered Inference Engine
The agent is triggered via a `POST /api/deduplicate/` request and follows a multi-layered fallback sequence to balance accuracy, speed, and cost.

- **Layer 1: Deterministic Match**: Rapid fuzzy matching leveraging `Levenshtein` and regex bounds to find immediate phonetic bounds on the original script.
- **Layer 2: Transliteration Mapping**: Utilizes `anyascii` and algorithmic mappings to catch non-LLM phonetic overlaps across scripts.
- **Layer 3: Cross-Language Semantic Search (LLM)**: An orchestration loop that translates missing terms to find multi-lingual correlations.

### 2b. The Layer 3 Intelligence Loop (5-Iterations)
If Layers 1 & 2 fail, the agent utilizes a loop-based LLM retry mechanism:
- **Cache-First**: Queries the internal Database Cache for recent translations, completely bypassing the LLM if found.
- **Fail-Safe**: It recursively tracks "Translation unavailable" LLM outputs and retries only those specific language nodes within its 5-iteration cap.
- **Cache Warmer**: An async process (`POST /api/cache/warmup`) translates and pre-allocates names across all languages directly to speeds up real-time requests.

### 2c. Pipeline Step-by-Step
| Layer | Step | Action | Processing Logic | Exit Condition |
| :--- | :--- | :--- | :--- | :--- |
| **L1** | **Fuzzy** | Direct Comparison | Jaro-Winkler/Levenshtein matching | `match_found == true` |
| **L2** | **ASCII** | Transliteration | `anyascii` standard mapping | `ascii_match_found == true` |
| **L3** | **Translate** | Distributed LLM | Cache hits -> Threaded LLM queries | `iterations == 5` |
| **L3** | **Probe** | Target Mapping | MongoDB Case-Insensitive search | Continues to Attribute |
| **L3** | **Attribute** | Confidence Score | Map DB hits to source languages | End of Execution |

### 2d. Data Transformations: A Concrete Example
**Input**: `"Ivan"` (English)

1.  **Step 1 (Normalize)**: `"ivan"`
2.  **Step 2 (Translate)**: 
    - Hindi: `"इवान"`
    - Russian: `"Иван"`
    - Kannada: `"ಇವಾನ್"`
3.  **Step 3 (Heuristic)**: No single word dominates > 70% (Unique scripts detected).
4.  **Step 4 (Database Probe)**:
    - Search for: `{"name": {"$regex": "^(ivan|इवान|иван|ಇವಾನ್)$", "$options": "i"}}`
5.  **Step 5 (Final Result)**: 
    - Found: `{ "name": "Иван", "lang": "Russian" }` in DB.
    - Output: Matches found in "Russian".

---

## 🔄 3. End-to-End User Flow

1. **Dashboard Interaction**: A developer accesses the frontend API Explorer and Educational Suite (`/the-agent`).
2. **Input Submision**: User requests Deduplication for "Ivan".
3. **Layer Invocation**: Backend attempts L1/L2 and then falls back to L3 (`app/services/agent.py`).
4. **Cache & LLM Checks**: 
   - Known translations are loaded instantly from MongoDB.
   - Unknowns are dispatched via threading to the LLM (OpenRouter).
5. **Score Allocation**: Matching logic runs yielding high/low confidence ratings per match type.
6. **Frontend Synthesis**: The Next.js client renders dynamic JSON, visual trace trees, and deduplication latency markers on the Dashboard.

---

## 🗄️ 4. Data Models

### Normalized Document (`data` collection)
```typescript
interface NormalizedData {
  _id: string;
  name: string;      // Normalized lowercase name
  lang: string;      // Source language (Hindi, Russian, etc.)
  salary: number;    // Standardized integer
  experience: number;// Years of experience
  department: string;// Normalized category
}
```

### Translation Cache (`cache` collection)
```typescript
interface CacheEntry {
  word: string;            // Original normalized word
  lang: string;            // Target language
  translated_word: string; // LLM output
}
```

---

## 🛠️ 5. Running the Full Stack Locally

1.  **Start MongoDB**: Ensure a local instance is running on `port 27017`.
2.  **Backend Setup**:
    ```bash
    cd backend
    uv sync
    uvicorn app.main:app --reload --port 8000
    ```
3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev  # accessible at localhost:3000
    ```

## ⚠️ 6. Failure Modes & Edge Cases

- **Rate Limiting**: The agent handles LLM rate limits by retrying failed language nodes in subsequent iterations.
- **Ambiguous Names**: Names like "Apple" (company vs fruit) can cause translation drift. The agent's **Consensus Heuristic** (70% match) attempts to catch these by re-evaluating the translation logic.
- **CORS Issues**: Resolved via `CORSMiddleware` in `main.py` allowing cross-origin requests from the Next.js port.
- **DB Connection**: System health is monitored via the `GET /api/health` pulsing dot in the UI.
