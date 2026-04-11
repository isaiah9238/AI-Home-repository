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
│   │   ├── flows/               # Core Orchestration
│   │   │   └── userBrain.ts     (Adaptive Node)
│   │   └── genkit.ts            # Genkit Configuration (Gemini 2.5 Pro)
│   │
│   ├── app/                     # THE PORTAL (Next.js Routes)
│   │   ├── (auth)/              # Authentication
│   │   │   └── login/           # Access Terminal
│   │   ├── architect/           # Full-screen Construction Terminal
│   │   ├── code-analyzer/       # Security Audit HUD
│   │   ├── flux-echo/           # Research Drawer UI
│   │   ├── sandbox/             # Autonomous Previewer
│   │   ├── testing-area/        # Multi-Agent Testing Chamber
│   │   ├── actions.ts           # The Cabinet Switchboard
│   │   └── page.tsx             # The Interior Dashboard
│   │
│   ├── components/              # UI COMPONENTS
│   │   ├── ui/                  # ShadCN & HUD Elements
│   │   ├── app-shell.tsx        # Navigation & Sidebar
│   │   ├── storage-drawer.tsx   # High-Fidelity VFS UI
│   │   ├── gems-drawer.tsx      # Safety Ledger Visualizer
│   │   ├── laboratory-drawer.tsx# Parameter Tuner
│   │   ├── neural-graph.tsx     # XAI Context Map
│   │   └── portal-interface.tsx # The Tool Switchboard
│   │
│   ├── lib/                     # SHARED LIBRARIES
│   │   ├── firebase.ts          # Client SDK (Gemini 2.5 Pro)
│   │   └── firebaseAdmin.ts     # Admin SDK (The Purge Protocol)
│
└── README.md                    # Project Overview

### Domain Key:
- **Discovery**: Construction, Identity, and Mastery Growth.
- **Research**: Reconnaissance, Deep Reading, and Intent Analysis.
- **Storage**: The VFS and Agentic Memory synchronization.
- **Safety**: System integrity, Gatekeepers, and the 24h Gems Cycle.
- **Portal**: High-fidelity HUD interface for all domains.

### 📁 Operational Nodes:
- `src/components/storage-drawer.tsx`: VFS browser with breadcrumbs and editing.
- `src/app/testing-area/page.tsx`: Parallel execution and variation chamber.
- `src/app/sandbox/page.tsx`: Intent-driven code execution environment.
