# AI Home 🚀

Welcome to **AI Home**, the architecture for your personal "Portal" and "Cabinet" of AI tools. This project represents the transition from hacking on external platforms to architecting a system on your own server—one that cannot be turned off.

## Project Philosophy

The core idea is to build a **Portal**: a doorway between your clean "Home" and the powerful AI "Drawers" (tools) you’ve built.

-   **The Clean Room:** The interface is minimalist. Tools are "summoned" only when needed.
-   **The Cabinet:** The backend is organized into specific **Domains** (Discovery, Research, Safety) rather than a flat pile of scripts.
-   **Universal Template:** The system is designed as a house that adapts to its inhabitant, using variables like `The User` instead of hardcoded names.

## The Cabinet (Features)

The system is organized into "Drawers" that you can open via the Portal:

### 🔭 The Research Domain (Scout & Analyst)
-   **Flux Echo**: A scout that runs to a URL and brings back a quick briefing.
-   **Epitomizer**: Deep reads webpages and turns noise into clean notes.
-   **Code Inspector**: Reviews code snippets for bugs and security vulnerabilities.

### 🧠 The Discovery Domain (Memory & Growth)
-   **Home Base**: The heart of the system. Connects to Firestore to ensure the AI knows who you are.
-   **The Architect**: A "3D printer for code" that generates folder structures from blueprints.
-   **The Tutor**: Ingests lesson plans (PDFs, guides) to teach the AI new contexts.

### 🛡️ The Safety Domain (Gatekeepers)
-   **Input/Output Filters**: Ensures structural integrity by vetting what enters and leaves the system.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **AI Toolkit**: [Genkit](https://firebase.google.com/docs/genkit)
-   **UI**: [React](https://react.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
-   **Database**: [Firestore](https://firebase.google.com/docs/firestore) (for user profile data)

## Getting Started

Follow these steps to get your local development environment up and running.

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/en) (version 18 or higher) installed on your system.

### 2. Install Dependencies

Clone the repository and install the necessary packages using npm:

```bash
npm install
```

### 3. Set Up Environment Variables

This project requires an API key to connect to the Google Gemini service.

1.  Create a new file named `.env` in the root of the project if it doesn't already exist.
2.  Add your Gemini API key to the file:

    ```env
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open the local URL provided in your terminal (e.g., http://localhost:9004) with your browser to see the result.

## Project Structure: The Cabinet Architecture

The system has been reorganized from a flat structure into specific **Domains**.

-   **`src/ai/discovery/`** (Memory & Growth)
    -   `establish-home-base.ts`: Connects to Firestore and maintains AI self-awareness.
    -   `generate-initial-files.ts`: The Architect tool for building file structures.
    -   `integrate-lesson-plans.ts`: The Tutor for ingesting new knowledge.

-   **`src/ai/domains/research/`** (The Scout & Analyst)
    -   `link-genie.ts`: (Flux Echo) Fetches content from URLs.
    -   `epitomize-fetched-content.ts`: Summarizes and cleans web content.
    -   `analyze-code-snippet.ts`: The Code Inspector.

-   **`src/ai/domains/safety/`** (The Gatekeepers)
    -   Contains filters for User Input and AI Output.

-   **`src/ai/flows/`**
    -   `userBrain.ts`: The Core Brain. Connects the "Librarian" (Firestore) to the "Mentor" (AI).

-   **`src/app/`** (The Portal Interface)
    -   Follows a "Clean Room" aesthetic. The UI acts as a floating "Portal" that summons specific drawers.
