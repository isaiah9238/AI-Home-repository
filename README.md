# The Cabinet: High-Fidelity AI Orchestration

**The Cabinet** is a domain-driven, autonomous AI development environment designed to bridge the gap between static scripts and intelligent, self-evolving systems. It utilizes a **Portal** (Next.js 15 HUD) to interface with a **Cabinet** of specialized AI **Drawers** (Domain Agents) powered by Google Genkit and Firebase.

---

## 🏛️ System Architecture

The system follows a "Clean Room" philosophy, where high-complexity tools are summoned only when needed, maintaining a minimalist operational core.

### 🧩 The Portal (Interface)
A cybernetic HUD designed with high-fidelity Glassmorphism, neon-glow telemetry, and real-time status pulses.
- **Access Terminal**: Secure OAuth2 entry point with system status monitoring.
- **Interior Dashboard**: A real-time command center visualizing neural complexity and system health.
- **The Visualizer**: A central gateway for summoning specialized operational drawers.

### 📁 The Cabinet (Operational Domains)

#### 1. Discovery Domain (Identity & Construction)
- **The Architect**: A 3D printer for code that generates production-ready project structures and commits them directly to the VFS.
- **The Tutor**: Synthesizes and ingests structured lesson plans to expand the system's neural context density.
- **Home Base**: Anchors the AI's memory in Firestore, ensuring persistence of user profile and mastery metrics.

#### 2. Research Domain (Intelligence & Analysis)
- **Flux Echo (Scout)**: Conducts high-speed web reconnaissance and general topic scouting.
- **Epitomizer**: Deep-reads web coordinates to extract structured essence and technical notes.
- **Code Inspector**: Specialized auditor for security, performance, and logical integrity.

#### 3. Storage Domain (Persistence)
- **Virtual File System (VFS)**: A hierarchical, Firestore-backed storage layer for AI-generated logic, assets, and agentic notes.
- **Agentic Memory**: A coordination stream where agents leave "signals" for cross-domain orchestration.

#### 4. Safety Domain (Integrity)
- **Gatekeepers**: High-fidelity input/output filters vetting all neural streams for system safety.
- **The Ledger (Gems)**: A gamified 24-hour cycle where security pulses are harvested to grow neural credits.

---

## 🚀 Technical Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI Engine**: [Google Genkit](https://firebase.google.com/docs/genkit) + Gemini 2.5 Pro
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore) (The Librarian)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) + Google OAuth
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/)
- **Runtime**: Node.js 22+

---

## 🛠️ Operational Setup

### 1. Environment Configuration
Create a `.env` file in the project root with the following coordinates:

```env
# Google AI
GOOGLE_GENAI_API_KEY="your_api_key"

# Firebase Config (Client)
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"

# NextAuth
AUTH_SECRET="your_random_secret"
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"

# Admin Access
FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", ...}'
```

### 2. Development Protocol
Initialize the environment and launch the HUD:

```bash
npm install
npm run dev
```

### 3. Agentic Synchronization
To initialize the system's root nodes and VFS structure:

```bash
npx tsx src/scripts/feed-nodes.ts
```

---

## 📈 Roadmap Status: Phase 3 (Active)

- [x] **Autonomous Previewer**: Sandbox environment for intent analysis and real-time execution.
- [x] **Multi-Code Testing Area**: Parallel execution slots with variation synthesis.
- [x] **Autonomous Writing**: The Architect now performs direct I/O to the VFS.
- [x] **Agentic Memory Sync**: Cross-agent signaling for complex task coordination.
- [ ] **High-Fidelity VFS UI**: Enhanced storage drawer with real-time collaborative editing.

---
*Status: Cabinet Core V4.2.0 is fully operational. Neural pathways stabilized.*
