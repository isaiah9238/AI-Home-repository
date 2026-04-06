# The Cabinet: High-Fidelity AI Orchestration

**The Cabinet** is a domain-driven, autonomous AI development environment designed to bridge the gap between static scripts and intelligent, self-evolving systems. It interfaces a high-fidelity **Portal** (Next.js 15 HUD) with a **Cabinet** of specialized AI **Drawers** (Domain Agents) powered by Google Genkit and Firebase.

---

## 🏛️ System Architecture

The system follows a "Clean Room" philosophy, where high-complexity tools are summoned only when needed, maintaining a minimalist operational core.

### 🧩 The Portal (Interface)
A cybernetic HUD designed with glassmorphism, neon telemetry, and real-time status pulses.
- **Interior Dashboard**: A real-time command center visualizing neural complexity and system health.
- **The Visualizer**: A central gateway for summoning specialized operational drawers.
- **Autonomous Previewer**: A live sandbox for intent analysis and high-fidelity code execution.

### 📁 The Cabinet (Operational Domains)

#### 1. Discovery Domain (Identity & Construction)
- **The Architect**: A 3D printer for code that generates structures and commits them directly to the VFS via the **Autonomous Writing** protocol.
- **The Tutor**: Synthesizes and ingests lesson plans to expand neural context density and mastery phases.
- **Home Base**: Anchors the AI's memory in Firestore, ensuring persistence of user mastery and system calibrations.

#### 2. Research Domain (Intelligence & Analysis)
- **Flux Echo (Scout)**: Conducts high-speed web reconnaissance and general topic scouting.
- **Epitomizer**: Deep-reads web coordinates to extract structured essence and technical notes.
- **Code Inspector**: Specialized auditor for security, performance, and logical integrity.

#### 3. Storage Domain (Persistence)
- **Virtual File System (VFS)**: A hierarchical, Firestore-backed storage layer for all AI-generated assets and blueprints.
- **Agentic Memory**: A coordination stream where agents leave signals for cross-domain orchestration.

#### 4. Safety Domain (Integrity)
- **The Ledger (Gems)**: A gamified 24-hour cycle where security pulses are harvested to grow neural credits.
- **Gatekeepers**: High-fidelity input/output filters vetting all neural streams for system safety.

---

## 🚀 Technical Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI Engine**: [Google Genkit](https://firebase.google.com/docs/genkit) + Gemini 2.5 Pro
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/)

---

## 🛠️ Operational Setup

1. **Environment**: Configure `.env` with Google AI and Firebase coordinates.
2. **Initialization**: Run `npm install` followed by `npm run dev`.
3. **Synchronization**: Launch the `feed-nodes` script to initialize VFS root nodes.

---
*Status: Cabinet Core V4.2.0 Operational. Multi-Agent Orchestration Active.*
