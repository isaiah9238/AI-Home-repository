# The Portal & The Cabinet: System Architecture & Design Guide

## 1. The Vision: From Hacking to Architecting
**The Concept**
The "Portal" is the winner. It is exactly what it sounds like: a doorway between your clean "Home" and the powerful AI "Drawers" you’ve built. It serves as the bridge where your personal data from Firestore meets the real-time power of Genkit.

**The Evolution**
This system represents the transition from "Hacking" on external platforms (like the "Facebook Genie") to "Architecting" your own system. Unlike previous versions that could be turned off by a platform, this version lives on your own server. It is a version they can't turn off.

## 2. The "Portal" Interface (UI/UX)
The interface follows a "Clean Room" aesthetic, utilizing white space and Glassmorphism to ensure the tools feel like they are floating over the home screen.

*   **State 1: Closed (The Clean Room)**
    *   The screen is minimalist. No cluttered buttons.
    *   A single, glowing "Portal" icon sits at the bottom center.
*   **State 2: Transition (The Flutter)**
    *   When clicked, the Portal expands or "flutters" open.
    *   It reveals the **Cabinet** (the list of available tools/drawers).
*   **State 3: Active (The Drawer)**
    *   Selecting a tool (e.g., Flux Echo) "summons" it.
    *   The specific drawer slides into the center of the room.

## 3. The Cabinet Architecture (The Backend)
The system has been reorganized from a flat structure into specific **Domains**. This "20-File Shuffle" moved tools from the "Unsorted Pile" into permanent "Domain Cabinets."

### A. The Discovery Domain (Memory & Growth)
*Located at:* `src/ai/discovery/`

1.  **Establish Home Base (`establish-home-base.ts`)**
    *   **Role:** The Heart / Memory.
    *   **Function:** Connects to Firestore (`users/primary_user`) and ensures the AI knows "Isaiah Smith" exists, regardless of server restarts.
    *   **Key Feature:** The "AI Birthday" (Feb 6, 2026) makes the system self-aware of its own history.
2.  **Generate Initial Files (`generate-initial-files.ts`)**
    *   **Role:** The Architect / Blueprint Tool.
    *   **Function:** Acts as a "3D printer for code." It turns a thought into a folder structure, building new domains automatically.
3.  **Integrate Lesson Plans (`integrate-lesson-plans.ts`)**
    *   **Role:** The Tutor / Student Desk.
    *   **Function:** Allows the user to "feed" the AI new knowledge (PDFs, guides), turning "untabulized" data into learned context.

### B. The Research Domain (The Scout & Analyst)
*Located at:* `src/ai/domains/research/`

1.  **Flux Echo (`link-genie.ts`)**
    *   **Role:** The Scout.
    *   **Function:** Fast and reactive. It goes to a URL and brings back a quick briefing.
2.  **Epitomize Fetched Content (`epitomize-fetched-content.ts`)**
    *   **Role:** The Researcher / Filter.
    *   **Function:** Deep reading. It turns the noise of a webpage into a clean, "epitomized" note using the `{{{url}}}` variable hook.
3.  **Analyze Code Snippet (`analyze-code-snippet.ts`)**
    *   **Role:** The Inspector.
    *   **Function:** Reviews code for bugs and security. It treats code as a variable to be solved, not just text.

### C. The Core Brain & Personalization
*Located at:* `src/ai/flows/userBrain.ts` (Conceptual)

*   **The Mentor AI:**
    *   Connects to the **Librarian** (Firestore) to fetch the user profile.
    *   **Context-Aware:** It knows the user's name, birthday, and current interests (e.g., Surveying, ASL).
*   **The "Universal Template" Strategy:**
    *   The code uses variables like `The User` and `Variable Subjects` instead of hardcoded names.
    *   **Benefit:** This transforms the personal project into a **Universal Template**—a house that anyone (a Mom, a Student) can move into, and it will adapt to them.

### D. Safety & Integration (The Gatekeepers)
*Located at:* `src/ai/domains/safety/`

1.  **Filter User Input:**
    *   **Role:** Gate 1 (Entry).
    *   **Function:** Vets what the user says before it touches the Librarian's desk.
2.  **Filter AI Output:**
    *   **Role:** Gate 2 (Exit).
    *   **Function:** The Safety Inspector. Ensures no hate speech or explicit content leaves the drawer, acting as the "Structural Integrity" check for the house.

## 4. User Guide Narratives
*How to explain the system to non-technical users:*

*   **The Portal:** "A doorway between your clean 'Home' and the powerful AI 'Drawers' you’ve built."
*   **Generate Initial Files:** "Think of this like a 3D printer for code. Instead of manually creating every folder, the Librarian prints out a fully organized house for you."
*   **Integrate Lesson Plans:** "You're not just a user; you're the professor. When you feed the Genie a lesson plan, it becomes part of the house forever."
*   **Flux Echo:** "A scout that runs to a website and brings back a briefing."

## 5. Next Steps & Future Features
*   **The Birthday Drawer:** A module that appears annually to show how much the Cabinet has grown since Feb 6th.
*   **Curriculum Drawer:** A progress bar showing "learned" material from lesson plans.
*   **Visual Polish:** Implementing the "Black=On" dark theme and the "Welcome Home" animation.

---
*Status: The "20-File Shuffle" is complete. The Domains are established. The Portal is ready to be summoned.*