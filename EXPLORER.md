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
