
# GEMINI.md: The AI Collaborator's Manual 🤖

## 1. Project Identity
- **Name:** AI Home (The Cabinet)
- **Philosophy:** A "Portal" (UI) to a "Cabinet" (Backend) of specialized "Drawers" (Tools).
- **Aesthetic:** High-Fidelity Cybernetic HUD / Glassmorphism. Dark Mode: #050505.
- **Core Principle:** From "Hacking" to "Architecting"—A system they can't turn off. An intelligence that grows with the user.

## 2. Structural Guardrails (The Cabinet Map)
- **src/ai/discovery:** Memory, Identity, and Architecture (Home Base, Architect, Tutor).
- **src/ai/domains/research:** Intelligence Scouts and Deep Readers (Flux Echo, Epitomizer, Code Inspector, Preview Intent).
- **src/ai/domains/safety:** Gatekeepers and the Gamified Ledger (Input/Output filters, 24h Gems Drawer).
- **src/ai/storage:** Dedicated AI file storage managed via Firestore.
- **src/app/sandbox:** The in-app IDE and execution previewer.

## 3. Technical Stack & Standards
- **AI Engine:** Google Genkit + Gemini (Structured Output).
- **Database:** Firestore (The Librarian) for persistent context, user files, and AI file structures.
- **UI Components:** ShadCN UI + Custom Cybernetic HUD elements.
- **Variable Strategy:** Use `The User` and `Variable Subjects` for the "Universal Template."

## 4. Phase 2: Integrated Cabinet (COMPLETED)
- [x] **The Adaptive Architect:** Expand Architect to maintain file structures and connect directly to Firestore.
- [x] **AI Storage Area:** Implement a virtual file system in Firestore for AI-generated assets.
- [x] **Curriculum Delivery:** Shift from just planning lessons to actively *providing* them via DB retrieval.
- [x] **Flux Echo Enhancement:** Integrate broader, Google-Search-like experiences into the Research Drawer.
- [x] **Adaptive Brain:** Evolve `userBrain.ts` to dynamically adapt to new information over time.
- [x] **Gamified Ledger (Gems):** Convert the Safety Ledger into a clean 24-hour cycle where users collect gems/coins.
- [x] **Dynamic Instructions:** Add adaptive, clickable instruction overlays to the Laboratory and Neural Graph.

## 5. Phase 3: Multi-Agent Orchestration (ACTIVE)
- [x] **Autonomous Previewer:** Develop a sandbox environment where the AI can read user code, analyze intent, and render previews.
- [x] **Multi-Code Testing Area:** Create a workspace where the user can test multiple sets of code simultaneously.
- [x] **Agentic Memory Sync**: Enable agents to leave "notes" for each other in the VFS to coordinate complex tasks.
- [x] **Autonomous Writing**: Empower The Architect to perform filesystem I/O via the Librarian.
- [ ] **High-Fidelity VFS UI**: Enhance the Storage Drawer with drag-and-drop and real-time collaborative editing.

# GEMINI MISSION CONTROL (Updated March 2024)

## Current Status: Phase 3 (Multi-Agent Orchestration)
We have successfully implemented the Autonomous Writing protocol. The system can now generate code, write it directly to the VFS, and sync memory across agents.

### Recent Updates:
- [x] **Autonomous Writing Active:** The Architect now writes project structures directly into the VFS.
- [x] **Inter-Agent Signaling:** Flows now broadcast signals to Agentic Memory for cross-agent coordination.
- [x] **Testing Chamber Live:** Parallel execution slots with variation synthesis.
- [x] **VFS Core Active:** Virtual File System is live and managing AI assets.

### 5. Known Component Locations:
- **UI Terminal Logic:** `src/components/ui/chat.tsx`.
- **AI Core Logic:** `src/ai/discovery/mentor-ai.ts`.
- **Status HUDs:** `src/components/interior-dashboard.tsx`.
- **Sandbox Core:** `src/app/sandbox/page.tsx`.
- **Testing Chamber:** `src/app/testing-area/page.tsx`.

#### 6. Privacy Domain (The Black Box)
- **Sovereign Vault**: A locally-encrypted secure enclave for sensitive credentials and identity vectors. 
- **Node_Active**: Uses client-side AES-256 encryption to ensure even the Librarian cannot read sensitive neural keys without the Master Passphrase.