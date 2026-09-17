# Workspace Guidelines & Instructions

## Development Server Rules
- **DO NOT run `npm run dev` or start background dev servers.** The user prefers to start and manage the development server manually.

## Project Overview & Tech Stack
- **Project**: DevNotes / WorkPad (`devnotes-workpad`)
- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React (`lucide-react`)
- **State & Storage**: LocalStorage / Offline-first fallback with optional Firebase (Firestore) sync

## Coding Conventions
- Prefer functional React components and standard React hooks.
- Maintain TypeScript strictness; avoid untyped or `any` values where possible.
- Use Tailwind CSS for styling and maintain existing visual aesthetics and responsive design.
- Use `clsx` and `tailwind-merge` (`cn` helper if present) for dynamic class names.
- Do not modify files in `.next/` or `node_modules/`.
