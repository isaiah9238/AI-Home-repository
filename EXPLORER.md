# AI Home: The Cabinet Map 🗺️

This file provides a visual representation of the system architecture, organized by Domain and Responsibility.

studio/
├── src/
│   ├── ai/                      # THE BRAIN (Genkit Flows & Prompts)
│   │   ├── discovery/           # Memory & Identity Domain
│   │   │   ├── establish-home-base.ts
│   │   │   ├── generate-initial-files.ts (The Adaptive Architect)
│   │   │   ├── provide-lessons.ts        (The Tutor - Expanded Delivery)
│   │   │   ├── mentor-ai.ts
│   │   │   ├── migrate-lesson-to-db.ts
│   │   │   └── web-intel.ts
│   │   ├── domains/             # Specialized Toolsets
│   │   │   ├── research/        # Scout & Analyst Domain
│   │   │   │   ├── analyze-code-snippet.ts (Inspector)
│   │   │   │   ├── epitomize-fetched-content.ts (Deep Reader)
│   │   │   │   └── link-genie.ts (Flux Echo - Expanded Search)
│   │   │   └── safety/          # The Gatekeepers & Gamification
│   │   │       ├── filter-ai-output.ts
│   │   │       ├── filter-user-input.ts
│   │   │       └── gems-logger.ts (The 24h Gamified Ledger)
│   │   ├── storage/             # AI Persistent Memory
│   │   │   └── virtual-file-system.ts    (Firestore AI File Manager)
│   │   ├── flows/               # Core Orchestration
│   │   │   └── userBrain.ts     (Adaptive Node)
│   │   ├── genkit.ts            # Genkit Configuration
│   │   └── dev.ts               # Local Dev Entry
│   │
│   ├── app/                     # THE PORTAL (Next.js Routes)
│   │   ├── (auth)/              # Authentication
│   │   │   └── login/           # Access Terminal
│   │   ├── architect/           # The Architect UI (Construction)
│   │   ├── code-analyzer/       # Code Inspector UI (Audit)
│   │   ├── flux-echo/           # Research Drawer UI (Recon & Google Search UX)
│   │   ├── lesson-plans/        # Curriculum Drawer UI (DB Retrieval)
│   │   ├── mentorship/          # AI Mentor UI (Briefing)
│   │   ├── reports/             # 24h Gems & Coin Collection UI
│   │   ├── sandbox/             # PHASE 2: In-App Development Environment
│   │   │   └── page.tsx         # Multi-Code Testing Area & Previewer
│   │   ├── actions.ts           # The "Cabinet" Switchboard (Server Actions)
│   │   ├── layout.tsx           # HUD Frame
│   │   └── page.tsx             # The Interior Dashboard
│   │
│   ├── components/              # UI COMPONENTS
│   │   ├── ui/                  # ShadCN & HUD Elements
│   │   ├── logo/                # Branding (Vault & Portal)
│   │   ├── app-shell.tsx        # Navigation & Sidebar
│   │   ├── dynamic-instructions.tsx # Adaptive Help Docs for Drawers
│   │   ├── birthday-drawer.tsx  # Evolution Tracker
│   │   ├── curriculum-drawer.tsx# DB Progress Visualizer
│   │   ├── gems-drawer.tsx      # 24h Gamified Ledger Visualizer
│   │   ├── laboratory-drawer.tsx# Parameter Tuner
│   │   ├── neural-graph.tsx     # Context Map Visualizer
│   │   ├── interior-dashboard.tsx# Cybernetic HUD
│   │   ├── portal-interface.tsx # The Engagable Core
│   │   └── MainLogo.tsx         # Logo Switchboard
│   │
│   ├── lib/                     # SHARED LIBRARIES
│   │   ├── firebase.ts          # Client SDK Init
│   │   ├── firebaseAdmin.ts     # Admin SDK Init
│   │   └── utils.ts             # Tailwind merging
│   │
│   ├── auth.ts                  # NextAuth v5 Configuration
│   └── middleware.ts            # Auth Redirect Middleware
│
├── docs/
│   └── blueprint.md             # The Technical Roadmap
├── ARCHITECTURE.md              # The Vision Document
├── EXPLORER.md                  # This Map
└── README.md                    # Project Overview

### Domain Key:
- **Discovery**: Where the AI learns who you are and constructs new architecture.
- **Research**: The Scouts and Analysts that fetch and vet external data.
- **Safety**: The gatekeepers ensuring system integrity and logging "Gems."
- **Portal**: The high-fidelity interface for system interaction.

### 📂 Explorer: The Cabinet Files
- `src/components/gems-drawer.tsx`: The Safety Ledger (Black Box).
- `src/components/laboratory-drawer.tsx`: Neural weight parameter tuner.
- `src/components/neural-graph.tsx`: interactive XAI node-map.
- `src/app/architect/page.tsx`: Full-screen instantiation terminal.
