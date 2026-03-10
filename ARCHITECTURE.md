# The Portal & The Cabinet: System Architecture & Design Guide

## 1. The Vision: High-Fidelity Intelligence
**The Concept**
The "Portal" is the high-fidelity gateway between your local environment and the "Cabinet" of AI Drawers. It represents the transition from a collection of scripts to a unified, autonomous command center.

## 2. The "Portal" Interface (UI/UX)
The interface follows a **Cybernetic HUD** aesthetic, utilizing deep blacks (#050505), neon-blue/purple accents, and Glassmorphism (blur-2xl).

*   **Access Terminal (Login)**: A high-security entry point featuring scanning animations and system status telemetry.
*   **Interior Dashboard (Home)**: A real-time command center with dynamic metrics (Neural Complexity, Uptime) and a "Visualizer" window for summoned drawers.
*   **The Flutter**: Smooth, slide-in-from-bottom animations for all summoned drawers, ensuring the tools feel like they are "floating" over the home screen.

## 3. The Cabinet Domains (The Backend)

### A. The Discovery Domain (Identity & Construction)
*   **Home Base**: Connects to Firestore to anchor the AI's memory.
*   **The Architect**: A "3D printer for code." Generates production-ready folder structures and complete boilerplate files from conceptual blueprints.
*   **The Tutor**: Ingests lesson plans, expanding the neural context density and mastery levels via Server Actions.

### B. The Research Domain (Intelligence & Analysis)
*   **Flux Echo (Scout)**: Fast web reconnaissance returning concise signals and summaries.
*   **Epitomizer (Deep Reader)**: Transforms complex web content into structured, epitomized notes.
*   **Code Inspector**: Specialized security and performance auditor with structured JSON output.

### C. The Safety Domain (Integrity & Logging)
*   **Gatekeepers**: Input/Output filters that vet all neural streams for safety.
*   **Safety Ledger (Gems)**: A vertical timeline of "Safety Pulses" tracking system integrity and model uncertainty.

## 4. Tuning & Explainability
*   **The Laboratory**: Real-time parameter tuner for neural weights (Temperature, TopP) and system personas.
*   **The Neural Graph**: Interactive SVG node-map for "Explainable AI," visualizing the density and association strings of learned context.

---
*Status: Phase 2.0 (The Integrated Cabinet) is fully operational. Awaiting Phase 3 activation.*
