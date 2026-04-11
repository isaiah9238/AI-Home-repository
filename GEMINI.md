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
