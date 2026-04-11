# The Portal & The Cabinet: System Architecture & Design Guide

## 1. The Vision: High-Fidelity Intelligence
**The Concept**
The "Portal" is the high-fidelity gateway between your local environment and the "Cabinet" of AI Drawers. It represents the transition from a collection of scripts to a unified, autonomous command center.

**Tech Stack**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **AI Engine**: Google Genkit + Gemini 2.5 Pro
- **Styling**: Tailwind CSS + ShadCN UI
- **Database**: Firestore (Firebase Admin SDK)

## 2. The "Portal" Interface (UI/UX)
The interface follows a **Cybernetic HUD** aesthetic, utilizing deep blacks (#050505), neon-blue/purple accents, and Glassmorphism (blur-2xl).

*   **Access Terminal (Login)**: A high-security entry point featuring scanning animations and system status telemetry.
*   **Interior Dashboard (Home)**: A real-time command center with dynamic metrics (Neural Complexity, Uptime) and a "Visualizer" window for summoned drawers.
*   **The Testing Chamber**: A parallel execution environment where multiple logic streams can be evolved and previewed simultaneously.
*   **The Autonomous Previewer**: A high-fidelity sandbox that analyzes code intent and synthesizes live execution environments using CDN-backed runners.

## 3. The Cabinet Domains (The Backend)

### A. The Discovery Domain (Identity & Construction)
*   **Home Base**: Connects to Firestore to anchor the AI's memory.
*   **The Architect**: A "3D printer for code." Generates production-ready structures and boilerplate, now featuring the **Autonomous Writing Protocol** for direct VFS commits.
*   **The Tutor**: Synthesizes structured lesson plans, expanding neural context density and mastery levels.

### B. The Research Domain (Intelligence & Analysis)
*   **Flux Echo (Scout)**: High-speed research scout for web reconnaissance and topic scouting.
*   **Epitomizer (Deep Reader)**: Transforms complex web content into structured, epitomized notes.
*   **Code Inspector**: Specialized security and performance auditor with structured JSON output and refactoring suggestions.

### C. The Storage Domain (Persistence)
*   **Virtual File System (VFS)**: Hierarchical Firestore-backed storage layer. Supports collaborative editing, manual node synthesis, and breadcrumb navigation.
*   **Agentic Memory**: A coordination stream where agents leave signals (Agent Notes) for cross-domain orchestration.

### D. The Safety Domain (Integrity & Logging)
*   **Gatekeepers**: Bidirectional filters that vet all neural streams for system safety.
*   **Safety Ledger (Gems)**: A 24-hour gamified cycle where "Safety Pulses" are harvested to grow neural credits and maintain system health.

---
*Status: Phase 3.0 (Multi-Agent Orchestration) is ACTIVE. Cabinet Core V4.2.0 is fully operational.*
