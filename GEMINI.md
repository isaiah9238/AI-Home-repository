# GEMINI.md: The AI Collaborator's Manual 🤖

## 1. Project Identity
- **Name:** AI Home (The Cabinet)
- **Philosophy:** A "Portal" (UI) to a "Cabinet" (Backend) of specialized "Drawers" (Tools).
- **Aesthetic:** High-Fidelity Cybernetic HUD / Glassmorphism. Dark Mode: #050505.
- **Core Principle:** From "Hacking" to "Architecting"—A system they can't turn off. An intelligence that grows with the user.

## 2. Structural Guardrails (The Cabinet Map)
- **src/ai/discovery:** Memory, Identity, and Architecture (Home Base, Architect, Tutor).
- **src/ai/domains/research:** Intelligence Scouts and Deep Readers (Flux Echo, Epitomizer, Code Inspector).
- **src/ai/domains/safety:** Gatekeepers and the Gamified Ledger (Input/Output filters, 24h Gems Drawer).
- **src/ai/storage:** Dedicated AI file storage managed via Firestore.
- **src/app/sandbox:** The in-app IDE and execution previewer.

## 3. Technical Stack & Standards
- **AI Engine:** Google Genkit + Gemini (Structured Output).
- **Database:** Firestore (The Librarian) for persistent context, user files, and AI file structures.
- **UI Components:** ShadCN UI + Custom Cybernetic HUD elements.
- **Variable Strategy:** Use `The User` and `Variable Subjects` for the "Universal Template."

## 4. Phase 1: Adaptation & Expansion (Current Focus)
- [ ] **The Adaptive Architect:** Expand Architect to maintain file structures and connect directly to Firestore.
- [ ] **AI Storage Area:** Implement a virtual file system in Firestore for AI-generated assets.
- [ ] **Curriculum Delivery:** Shift from just planning lessons to actively *providing* them via DB retrieval.
- [ ] **Flux Echo Enhancement:** Integrate broader, Google-Search-like experiences into the Research Drawer.
- [ ] **Adaptive Brain:** Evolve `userBrain.ts` to dynamically adapt to new information over time.
- [ ] **Gamified Ledger (Gems):** Convert the Safety Ledger into a clean 24-hour cycle where users collect gems/coins.
- [ ] **Dynamic Instructions:** Add adaptive, clickable instruction overlays to the Laboratory and Neural Graph.

## 5. Phase 2: The In-App IDE & Code Execution
- **Autonomous Previewer:** Develop a sandbox environment where the AI can read user code, analyze intent, and render previews (e.g., rendering a generated image or a 3D CSS/WebGL cube).
- **Multi-Code Testing Area:** Create a workspace where the user can test multiple sets of code simultaneously.
- **Guided Development:** Integrate Mentor, Flux Echo, and Code Analyzer into the sandbox to provide real-time guidance, transforming the Home into a localized learning and development ecosystem.

Currently working on the laboratory-drawer and the neural-graph. Done instructions, prbablility wave, flux echo stays the same. Still needs work: the core, nodes, growth, connectons (check lessons and curriculum), keyboard and binary Marque

# GEMINI MISSION CONTROL (Updated March 2024)

## Current Status: Phase 1 (Adaptation & Expansion)
We have successfully transitioned to the `getAdminDb()` pattern for Firestore connectivity. 

### Recent Updates:
- [x] **Firestore Connection Fixed:** Updated `mentor-ai.ts` to correctly call `getAdminDb()`.
- [~] **Laboratory UI:** Development of the "Neural Graph" and "Laboratory Drawer" is underway.
- [ ] **Adaptive Brain:** (Next Focus) Evolving `userBrain.ts` for dynamic data ingestion.

### 4. Phase 1: Focus Areas
- [x] **Primary User Fetch:** Implementing personalized mentor responses via Firestore `users/primary_user`.
- [/] **UI Registry:** Refining the `LIVE_NEURAL-REGISTRY` and keyboard logic in `src/components/ui/chat.tsx`.
- [ ] **Curriculum Delivery:** (Pending) Connecting DB retrieval to the Mentor prompt.

### 5. Known Component Locations:
- **UI Terminal Logic:** `src/components/ui/chat.tsx` (Contains keyboard & registry branding).
- **AI Core Logic:** `src/ai/discovery/mentor-ai.ts`.
- **Status HUDs:** `src/components/birthday-drawer.tsx`.
