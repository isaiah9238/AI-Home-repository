# AI Home 🚀

Welcome to AI Home, your personal development environment for creating, training, and interacting with a bespoke Generative AI. This project is designed to be your launchpad into the world of AI-powered applications, providing a suite of tools to build and manage your AI's capabilities.

## Project Philosophy

The core idea behind AI Home is to create a transparent and educational space for building with generative AI. It's a hands-on learning tool where you can:

-   **Build Incrementally:** Start with a basic structure and add complexity feature by feature.
-   **Understand the Pieces:** See how a frontend (Next.js), AI toolkit (Genkit), and UI components (ShadCN) work together.
-   **Interact Directly:** Use the tools you build to understand the capabilities and limitations of your AI.

## Features

This application includes the following features. We'll be building these out together!

-   **Dashboard**: A central hub that provides a "morning briefing" from your AI, tailored to your interests.
-   **Code Analyzer**: Analyze code snippets for bugs, vulnerabilities, and performance bottlenecks.
-   **Content Reports**: Review and manage content flagged by the AI moderation system.
-   **Link Genie**: *(Coming Soon)* Fetch and summarize content from any URL.
-   **Lesson Plans**: *(Coming Soon)* Provide structured lesson plans to guide your AI's learning journey.
-   **AI Mentor**: *(Coming Soon)* Receive guidance and advice from an experienced AI mentor.

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

## Project Structure

Here's a high-level overview of the key files and folders:

-   `src/ai/`: The engine room. This is where the core AI logic resides.
    -   `src/ai/genkit.ts`: Configures Genkit and connects it to the Gemini model.
    -   `src/ai/flows/`: Contains the specific AI workflows, like analyzing code or providing mentorship.
-   `src/app/`: The frontend. This folder controls what you see on the screen.
    -   `src/app/page.tsx`: The main dashboard page.
    -   `src/app/layout.tsx`: The main layout component that wraps all pages.
    -   `src/app/[feature]/page.tsx`: Individual pages for each feature (e.g., Code Analyzer).
-   `src/components/`: Shared React components, especially the UI components from ShadCN.
-   `.env`: Stores your secret API keys. This file is not committed to version control.

updated
