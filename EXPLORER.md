# AI Home: The Cabinet Map 🗺️

This file provides a visual representation of the system architecture, organized by Domain and Responsibility.

```text
studio/
├── src/
│   ├── ai/                      # THE BRAIN (Genkit Flows & Prompts)
│   │   ├── discovery/           # Memory & Identity Domain
│   │   │   ├── establish-home-base.ts
│   │   │   ├── flux-echo.ts
│   │   │   ├── generate-initial-files.ts
│   │   │   ├── integrate-lesson-plans.ts
│   │   │   ├── mentor-ai.ts
│   │   │   └── web-intel.ts
│   │   ├── domains/             # Specialized Toolsets
│   │   │   ├── research/        # Scout & Analyst Domain
│   │   │   │   ├── analyze-code-snippet.ts
│   │   │   │   ├── epitomize-fetched-content.ts
│   │   │   │   ├── link-genie.ts
│   │   │   │   └── summarize-fetched-content.ts
│   │   │   └── safety/          # The Gatekeepers
│   │   │       ├── filter-ai-output.ts
│   │   │       ├── filter-user-input.ts
│   │   │       └── gems-logger.ts
│   │   ├── flows/               # Core Orchestration
│   │   │   └── userBrain.ts
│   │   ├── genkit.ts            # Genkit Configuration
│   │   └── dev.ts               # Local Dev Entry
│   │
│   ├── app/                     # THE PORTAL (Next.js Routes)
│   │   ├── (auth)/              # Authentication
│   │   │   └── login/
│   │   ├── code-analyzer/       # Development Drawer
│   │   ├── flux-echo/           # Research Drawer
│   │   ├── lesson-plans/        # Discovery Drawer
│   │   ├── mentorship/          # Mentor UI
│   │   ├── reports/             # Safety Logs
│   │   ├── actions.ts           # The "Cabinet" Switchboard (Server Actions)
│   │   ├── layout.tsx           # HUD Frame
│   │   └── page.tsx             # The Interior Dashboard
│   │
│   ├── components/              # UI COMPONENTS
│   │   ├── ui/                  # ShadCN & HUD Elements
│   │   ├── logo/                # Branding (Vault & Portal)
│   │   ├── app-shell.tsx        # Navigation & Sidebar
│   │   ├── birthday-drawer.tsx  # Evolution Tracker
│   │   ├── interior-dashboard.ts# Cybernetic HUD
│   │   ├── portal-interface.tsx # The Engagable Core
│   │   └── MainLogo.tsx         # Logo Switchboard
│   │
│   ├── firebase/                # Firebase Custom Error Handling
│   ├── hooks/                   # React Hooks (useToast, useMobile)
│   └── lib/                     # SHARED LIBRARIES
│       ├── firebase.ts          # Client SDK Init
│       ├── firebaseAdmin.ts     # Admin SDK Init
│       └── utils.ts             # Tailwind Helpers
│
├── .agents/                     # AI Skill Manifests
├── ARCHITECTURE.md              # The Vision Document
├── EXPLORER.md                  # This Map
├── README.md                    # Project Overview
├── firebase.json                # Firebase Infrastructure Config
└── package.json                 # Dependencies & Scripts
```

### Domain Key:
- **Discovery (src/ai/discovery)**: Where the AI learns who you are and ingests new knowledge.
- **Research (src/ai/domains/research)**: The "Scouts" that fetch and analyze external data.
- **Safety (src/ai/domains/safety)**: The gatekeepers that ensure system integrity.
- **Portal (src/app)**: The interface where you summon and interact with these domains.