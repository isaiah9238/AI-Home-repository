# AI Home: The Cabinet Map 🗺️

This file provides a visual representation of the system architecture, organized by Domain and Responsibility.

```text
studio/
├── src/
│   ├── ai/                      # THE BRAIN (Genkit Flows & Prompts)
│   │   ├── discovery/           # Memory & Identity Domain
│   │   │   ├── establish-home-base.ts
│   │   │   ├── generate-initial-files.ts (The Architect)
│   │   │   ├── integrate-lesson-plans.ts (The Tutor)
│   │   │   ├── mentor-ai.ts
│   │   │   ├── migrate-lesson-to-db.ts
│   │   │   └── web-intel.ts
│   │   ├── domains/             # Specialized Toolsets
│   │   │   ├── research/        # Scout & Analyst Domain
│   │   │   │   ├── analyze-code-snippet.ts (Inspector)
│   │   │   │   ├── epitomize-fetched-content.ts (Deep Reader)
│   │   │   │   └── link-genie.ts (Flux Echo)
│   │   │   └── safety/          # The Gatekeepers
│   │   │       ├── filter-ai-output.ts
│   │   │       ├── filter-user-input.ts
│   │   │       └── gems-logger.ts (The Ledger)
│   │   ├── flows/               # Core Orchestration
│   │   │   └── userBrain.ts
│   │   ├── genkit.ts            # Genkit Configuration
│   │   └── dev.ts               # Local Dev Entry
│   │
│   ├── app/                     # THE PORTAL (Next.js Routes)
│   │   ├── (auth)/              # Authentication
│   │   │   └── login/           # Access Terminal
│   │   ├── architect/           # The Architect UI (Construction)
│   │   ├── code-analyzer/       # Code Inspector UI (Audit)
│   │   ├── flux-echo/           # Research Drawer UI (Recon)
│   │   ├── lesson-plans/        # Discovery Drawer UI (Tutor)
│   │   ├── mentorship/          # AI Mentor UI (Briefing)
│   │   ├── reports/             # Security Logs (Gems)
│   │   ├── actions.ts           # The "Cabinet" Switchboard (Server Actions)
│   │   ├── layout.tsx           # HUD Frame
│   │   └── page.tsx             # The Interior Dashboard
│   │
│   ├── components/              # UI COMPONENTS
│   │   ├── ui/                  # ShadCN & HUD Elements
│   │   ├── logo/                # Branding (Vault & Portal)
│   │   ├── app-shell.tsx        # Navigation & Sidebar
│   │   ├── birthday-drawer.tsx  # Evolution Tracker
│   │   ├── curriculum-drawer.tsx# Progress Visualizer
│   │   ├── gems-drawer.tsx      # Safety Ledger Visualizer
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
│
├── docs/
│   └── blueprint.md             # The Technical Roadmap
├── ARCHITECTURE.md              # The Vision Document
├── EXPLORER.md                  # This Map
└── README.md                    # Project Overview
```

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
