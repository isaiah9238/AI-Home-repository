# GEMINI.md: The AI Collaborator's Manual 🤖

## 1. Project Identity
- **Name:** The Cabinet (AI Home)
- **Status:** Cabinet Core V4.2.0 (Operational)
- **Philosophy:** A high-fidelity "Portal" (Next.js HUD) to a "Cabinet" (Backend) of specialized Domain Agents.
- **Aesthetic:** Cybernetic HUD / Glassmorphism. Dark Mode: #050505.
- **Core Principle:** Multi-Agent Orchestration—A self-evolving intelligence that constructs its own VFS.

## 2. Structural Guardrails (The Cabinet Map)
- **src/ai/discovery:** Identity and Construction (The Architect, The Tutor, Mentor).
- **src/ai/domains/research:** Intelligence and Intent (Flux Echo, Code Inspector, Sandbox, Variation Agent).
- **src/ai/domains/safety:** Integrity and Gamification (Gatekeepers, 24h Gems Ledger).
- **src/ai/storage:** Persistence (Librarian VFS, Agentic Memory).

## 3. Phase 3 progress (The Orchestrator)
- [x] **Autonomous Writing**: The Architect commits structures directly to the VFS.
- [x] **High-Fidelity VFS**: Storage Vault features breadcrumbs and collaborative node editing.
- [x] **Testing Chamber**: Parallel execution environment for evolutionary code branching.
- [x] **Autonomous Previewer**: Sandbox with intent analysis and live execution runners.
- [x] **Neural Synchronization**: All agents aligned on **Gemini 2.5 Pro**.
- [x] **Agentic Memory Sync**: Agents use "Agent Notes" in the VFS to coordinate complex tasks.

## 4. Operational Standards
- **Engine**: Google Genkit (v1.x) utilizing `gemini-2.5-pro`.
- **Database**: Firestore (The Librarian) for persistent context and VFS assets.
- **Type-Safety**: Strict truthiness checks for all Server Action responses (`res.data`).
- **Entity Protocol**: All HTML entities in JSX must be formally escaped (e.g., `&apos;`).
- **Administrative Core**: Use the "Purge Protocol" in `firebaseAdmin.ts` to neutralize emulator signals in remote nodes.

## 5. Known Command Coordinates
- **VFS Browser**: `src/components/storage-drawer.tsx`
- **Testing Logic**: `src/app/testing-area/page.tsx`
- **Switchboard**: `src/app/actions.ts`
- **Initialization**: Run `npx tsx src/scripts/feed-nodes.ts` to sync VFS root nodes.

---
*Status: Phase 3 Orchestration is ACTIVE. Cabinet maintaining optimal structural density.*


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

#### 5. Privacy Domain (The Black Box)
- **Sovereign Vault**: A locally-encrypted secure enclave for sensitive credentials and identity vectors. 
- **Node_Active**: Uses client-side AES-256 encryption to ensure even the Librarian cannot read sensitive neural keys without the Master Passphrase.

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

# 🏛️ AI Home Blueprint: Phase 2.0 (The Integrated Cabinet)

## 1. Core Philosophy: The Cybernetic HUD
- **The Portal**: Next.js 15 (App Router) with high-fidelity Glassmorphism.
- **The Cabinet**: Genkit-powered domain structure (Discovery, Research, Safety).
- **The Librarian**: Firebase Firestore for persistent identity and ledger logging.

## 2. Completed Domains (The Drawers)

### 🧠 Discovery & Memory
- **Home Base**: Firestore-anchored identity matrix.
- **The Architect**: 3D printer for code; generates structured blueprints and boilerplate.
- **The Tutor**: Curriculum-based learning with dynamic mastery levels.
- **Birthday Milestone**: Real-time evolution tracking since 2026-02-06.

### 🔭 Research & Analysis
- **Flux Echo**: High-speed scout for web reconnaissance.
- **Epitomizer**: Deep-read content transformation for structured notes.
- **Code Inspector**: Structured security and performance auditing (gemini-2.5-pro).

### 🛡️ Safety & Integrity
- **Gatekeepers**: Bidirectional communications vetting (Input/Output).
- **Gems Drawer**: Vertical timeline of safety pulses and administrative resolution.

## 3. Metrics & XAI
- **Neural Complexity**: (Integrated Lessons * Gain) + Base context.
- **Knowledge Integration**: (Historical Fragments * Impact) + Base density.
- **The Neural Graph**: Interactive SVG node-map for context association mapping.

## 4. Tuning Protocols
- **The Laboratory**: Neumorphic parameter tuner for neural weights (Temp, TopP).
- **Persona Matrix**: Real-time switching between system identities.

## 5. Phase 3 Roadmap (The Orchestrator)
- **Multi-Agent Mode**: Allow drawers to call each other (e.g., Scout -> Architect).
- **Autonomous Writing**: Empower The Architect to perform filesystem I/O via the Librarian.
- **Vector Context**: Integrate Pinecone/Firestore Vector Search for deep retrieval.

---
*Status: Phase 2.0 Integrated. Ready for Phase 3 Orchestration.*


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

# AI Home: The Cabinet Map 🗺️

This file provides a visual representation of the system architecture, organized by Domain and Responsibility.

studio/
├── src/
│   ├── ai/                      # THE BRAIN (Genkit Flows & Prompts)
│   │   ├── discovery/           # Memory & Identity Domain
│   │   │   ├── establish-home-base.ts
│   │   │   ├── generate-initial-files.ts (The Architect)
│   │   │   ├── generate-lesson-plan.ts   (The Tutor)
│   │   │   ├── mentor-ai.ts              (Adaptive Persona)
│   │   │   └── multi-agent-dispatcher.ts (Intent Router)
│   │   ├── domains/             # Specialized Toolsets
│   │   │   ├── research/        # Scout & Analyst Domain
│   │   │   │   ├── analyze-code-snippet.ts (Inspector)
│   │   │   │   ├── analyze-preview-intent.ts (Sandbox Core)
│   │   │   │   ├── variation-agent.ts        (Evolution Core)
│   │   │   │   ├── link-genie.ts             (Flux Echo)
│   │   │   │   └── search-genie.ts           (General Recon)
│   │   │   └── safety/          # The Gatekeepers & Gamification
│   │   │       ├── filter-ai-output.ts
│   │   │       ├── filter-user-input.ts
│   │   │       └── gems-logger.ts            (Gems Ledger)
│   │   ├── storage/             # AI Persistent Memory
│   │   │   └── virtual-file-system.ts    (Firestore AI File Manager)
│   │   └── genkit.ts            # Genkit Configuration (Gemini 2.5 Pro)
│   │
│   ├── app/                     # THE PORTAL (Next.js Routes)
│   │   ├── architect/           # Construction Terminal
│   │   ├── sandbox/             # Autonomous Previewer
│   │   ├── testing-area/        # Parallel Execution Chamber
│   │   ├── flux-echo/           # Research Drawer UI
│   │   ├── actions.ts           # The Cabinet Switchboard
│   │   └── page.tsx             # The Interior Dashboard
│   │
│   ├── components/              # UI COMPONENTS
│   │   ├── storage-drawer.tsx   # High-Fidelity VFS UI
│   │   ├── gems-drawer.tsx      # Safety Ledger Visualizer
│   │   └── portal-interface.tsx # The Tool Switchboard
│   │
│   ├── scripts/                 # SYSTEM UTILITIES
│   │   ├── seed-etiquette-lesson.ts  (New Module Integration)
│   │   ├── feed-nodes.ts             (VFS Initialization)
│   │   └── seed-home-base.ts         (Identity Initialization)
│
└── README.md                    # Project Overview

### Domain Key:
- **Discovery**: Construction, Identity, and Mastery Growth.
- **Research**: Reconnaissance, Deep Reading, and Intent Analysis.
- **Storage**: The VFS and Agentic Memory synchronization.
- **Safety**: System integrity, Gatekeepers, and the 24h Gems Cycle.
- **Portal**: High-fidelity HUD interface for all domains.

### 📁 Operational Nodes:
- `src/scripts/seed-etiquette-lesson.ts`: Integrates the Social Etiquette module.
- `src/components/storage-drawer.tsx`: VFS browser with breadcrumbs and editing.
- `src/app/sandbox/page.tsx`: Neural Link grounded code execution.
