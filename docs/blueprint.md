# **App Name**: AI Home
**Current Phase**: 2.0 (Evolution & Integration)

## 1. Core Architecture: The Cabinet & Portal
- **The Portal (Frontend)**: Next.js App Router using a "Clean Room" aesthetic. Tools are "Summoned" as floating glassmorphism drawers.
- **The Cabinet (Backend)**: Domain-driven structure (Discovery, Research, Safety).
- **The Librarian (Data)**: Firebase Admin SDK managing user identity, system age, and "Gems" logging.

## 2. Active Domains (The Drawers):

### 🧠 Discovery & Memory
- **Establish Home Base**: Connects to Firestore (`users/primary_user`) to fetch identity and the **AI Birthday (2026-02-06)**.
- **Evolution Tracker (Birthday Drawer)**: Real-time calculation of system age and neural complexity.
- **The Architect**: Generative flow to "3D print" folder structures from text descriptions.
- **The Tutor**: Ingests lesson plans to expand the AI's contextual "Curriculum."

### 🔭 Research & Analysis
- **Flux Echo**: Fast link reconnaissance and briefings.
- **Epitomizer**: Deep-read content transformation for clean note-taking.
- **Code Inspector**: Specialized drawer for security and bug analysis of provided snippets.

### 🛡️ Safety & Integrity
- **Gatekeepers**: Bidirectional filtering (Input/Output).
- **Gems Logger**: Systematic tracking of content flags (Type, Severity, Resolution).

## 3. Data Schema (The Librarian's Desk):
- **User Profile**: `name`, `role`, `establishedDate`, `interests[]`.
- **System Metrics**: `neuralComplexity` (0-100), `knowledgeIntegration` (0-100).
- **Historical Fragments**: Collection of timestamps for major system milestones.

## 4. Style Guidelines:
- **Font**: 'Inter' (Machined/Objective) for UI; Monospace for Data points.
- **Dark Mode**: BG: #808080 (Medium Gray) | Accents: #BFBFBF (Light Gray) | Text: White.
- **Light Mode**: BG: White | Accents: #404040 | Text: Black.
- **Animations**: "The Flutter" (slide-in-from-bottom) for all summoned drawers.