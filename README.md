# MyWork 💼

A modern, fast, developer-centric work notes and task pipeline built with **Next.js 14**, **Tailwind CSS**, and **Firebase (Firestore)**.

Designed to replace traditional text editors and desktop Notepad with an organized, responsive workflow while maintaining 100% of the plain-text speed.

---

## ✨ Highlights

1. **Pre-Loaded with Your Exact Work Streams:**
   - **Quick Actions / Standup**: Direct checklist for immediate action items (`Send screenshots`, `Remove Satya mail id`, `Stop dev oce mails`, `BASTION request`, `fix angular22 ui issues`).
   - **Project Work Streams**: Dedicated sections for:
     - `User analytics dashboard` (with VP usage milestone, demo URL to Parth, branch tracker subtasks, DB connection in `values-dev.yaml`)
     - `Nexxus DR Testing` (`test orderload API`, DR env URL payload formulation)
     - `Python Email Changes` (`Remove env column (done)`, `Merge changes to trunk ###########`)
     - `Angular 22 upgrade`, `MyTracker DR`, `Saranya onboarding`, `Claude certification`, `Consulting Academy`, `Vulnerability fix`.

2. **Dual Mode (Visual Board + Notepad Scratchpad):**
   - **Board Mode**: Visual cards with progress rings, subtasks, color tags, high/urgent priority flags, and inline project memos.
   - **Notepad Mode**: Clean plaintext editor with line numbers matching your original desktop Notepad layout. Edit plain text and click **"Apply to Board"** to auto-parse, or edit cards and see it auto-serialize back to plain text!

3. **Smart Notepad Import & Export:**
   - Copy to clipboard or export `.txt` file at any time.
   - Paste any Notepad text; DevNotes will automatically detect headings, dashes, sub-bullets (`* `), priorities (`##`, `###########`), and completion flags (`(done)`).

4. **Zero-Configuration Offline First + Firebase Cloud Sync:**
   - **Immediate Local Persistence**: Works straight away out of the box using browser storage. No setup needed.
   - **Firebase Cloud Sync**: Click the cloud icon in the navbar or set `.env.local` to enable real-time sync across your devices via Google Firestore.

---

## ⌨️ Keyboard Shortcuts & Tips

- `Ctrl + K`: Focus global search bar (filters tasks, tags, and pipelines instantly)
- `Enter`: Quickly save new task / standup item
- `(done)`: In notepad mode or task title, automatically marks the item completed
- `## ` or `###########`: Marks task with **Urgent** priority badge

---

## 🛠️ Firebase Setup (Optional)

You can either:
1. Click the **Cloud** button in the header and paste your Firebase Project ID and Web API Key directly.
2. Or create a `.env.local` file in the root with:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## 🏃 Running Locally

```bash
# Start development server
npm run dev

# Production build
npm run build
npm run start
```
