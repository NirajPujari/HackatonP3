# Problem 3 API Explorer Dashboard

A premium, interactive developer cockpit for testing and documenting the "Problem 3" backend intelligence system. Built with modern web technologies, this frontend provides a developer-first experience for orchestrating normalization, translation, and deduplication tasks.

---

## 🚀 1. Project Overview

### Purpose
The API Explorer solves the fragmentation of manual API testing by providing:
- **Educational Suite**: Deep technical insights, data flow breakdowns, and interactive agent visualizations.
- **Interactive Documentation**: Test endpoints directly from the UI.
- **Visual Feedback**: Real-time response rendering with syntax highlighting.
- **Performance Monitoring**: Automatic measurement of backend response times.
- **Developer-Centric UX**: A dark, industrial aesthetic optimized for late-night hacking sessions.

### Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strictly typed)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Utility-first)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Code Rendering**: [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)

### Architecture
The application uses a **Hybrid Rendering Strategy**:
- **Server-Side Rendering (SSR)** is used for the page layout and initial metadata.
- **Client-Side Rendering (CSR)** powers the interactive API calls and stateful UI components.

---

## 📂 2. Project Structure

```bash
frontend/
├── app/                # Next.js App Router (Routing Layer)
│   ├── how-it-works/       # Visualizes the data pipeline & caching
│   ├── the-agent/          # Agent trace visualization & mechanics
│   ├── the-problem/        # Details the core fragmentation problem
│   ├── globals.css         # Global styles & Tailwind v4 config
│   ├── layout.tsx          # Root layout & Metadata
│   └── page.tsx            # Main Documentation Seat (Home)
├── components/         # Atomic & Molecular UI Components
│   ├── AgentTrace.tsx      # Live visualization of agentic loops
│   ├── CacheStatsUI.tsx    # Interactive caching analytics
│   ├── CodeSpotlight.tsx   # Educational syntax highlighting
│   ├── DecisionTree.tsx    # Flowchart of the deduplication logic
│   ├── EndpointCard.tsx    # Interactive endpoint testing logic
│   ├── Navbar.tsx          # site navigation bar
│   └── ResponsePanel.tsx   # JSON highlighting & Copy tools
├── public/             # Static assets
├── next.config.ts      # Next.js configuration
├── package.json        # Dependency manifest
└── tsconfig.json       # TypeScript configuration
```

---

## 🧩 3. Pages & Components Inventory

### Entry Page: API Explorer (`/`)
- **Purpose**: The main dashboard where all system endpoints are tested interactively.
- **Key Features**: Live status indicators, global base URL modifier, Endpoint cards.

### Educational Suite Pages
- **`/the-problem`**: Highlights the exact data fragmentation issue.
- **`/how-it-works`**: Visualizes the internal pipeline using `DataFlowStepper` and `LayerPipeline`.
- **`/the-agent`**: Deep dive into the deduplication agent, utilizing the interactive `AgentTrace` component to simulate LLM logic.

### Core Architecture Components

#### 1. `AgentTrace.tsx` & `DecisionTree.tsx`
- **Purpose**: Complex component visualizing the internal orchestrator logic for deduplication and caching.
- **Functionality**: Dynamic state management and micro-animations via Framer Motion to demonstrate live AI thought-processes.

#### 2. `EndpointCard.tsx`
- **Purpose**: The main interactive block for an API endpoint.
- **Functionality**: Executes requests via fetch, tracking network latency and response codes. Connects directly to `CacheWarmupUI` and `DeduplicateUI` for advanced interaction tracking.

#### 3. `ResponsePanel.tsx`
- **Purpose**: A specialized viewer for JSON data displaying live backend outputs.
- **Functionality**: Implements auto-copy and React-friendly Code view.

---

## 🧠 4. State Management

The application utilizes **Local React State** (`useState`, `useEffect`) to manage its data layer.
- **UI State**: Toggling of card expansion and loading indicators.
- **Form State**: Tracking the JSON payload in the request editor.
- **Execution State**: Capturing response data, status codes, and timing metrics from async calls.

Global settings like `baseUrl` are currently managed at the `page.tsx` level and passed down as props to ensure predictability.

---

## 🔌 5. API Integration

### Strategy
Communication with the backend is performed using the native **Browser Fetch API**.
- **Location**: API calls are defined inline within the `EndpointCard` component for high-cohesion request management.
- **Headers**: Default headers include `Content-Type: application/json` and `Accept: application/json`.
- **Latency Tracking**: Uses the `performance.now()` API to provide precise execution metrics.

### Error Handling
The frontend implements a robust error wrapper:
- Captures network failures (CORS issues, server down).
- Renders error messages directly into the UI's code block for immediate analysis.

---

## 🎨 6. Styling System

### Tailwind CSS v4
The project uses the latest **Tailwind CSS v4** engine, featuring:
- **CSS-first configuration**.
- **Dark Theme**: Deep charcoal backgrounds (`#0f1117`) and high-contrast typography.
- **Design Tokens**: Custom amber accents (`#f59e0b`) for interactive states.
- **Glassmorphism**: Backdrop filters applied to sticky headers and expanded panels.

---

## ⚙️ 7. Running Locally

### Prerequisites
- Node.js (Latest LTS)
- npm or pnpm

### Commands
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Launch Dev Server**:
   ```bash
   npm run dev
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📦 8. Key Dependencies

| Package | Role |
| :--- | :--- |
| `framer-motion` | Micro-animations and smooth layout transitions. |
| `lucide-react` | Industrial-themed iconography. |
| `react-syntax-highlighter` | Prism-based JSON rendering. |
| `next` | React framework for modern web features. |
