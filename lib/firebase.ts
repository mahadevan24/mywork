import { FirebaseSettings, WorkpadState } from "@/types/notes";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  Firestore,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export const FIREBASE_SETTINGS_KEY = "devnotes_firebase_settings";
export const LOCAL_STORAGE_DATA_KEY = "devnotes_workpad_state";

export function getStoredFirebaseSettings(): FirebaseSettings | null {
  if (typeof window === "undefined") return null;

  // 1. Check localStorage first
  try {
    const local = localStorage.getItem(FIREBASE_SETTINGS_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading local firebase settings", e);
  }

  // 2. Check Next.js public environment variables
  if (
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ) {
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    };
  }

  return null;
}

export function initFirebase(customConfig?: FirebaseSettings): {
  app: FirebaseApp | null;
  db: Firestore | null;
  isConfigured: boolean;
} {
  const config = customConfig || getStoredFirebaseSettings();

  if (!config || !config.apiKey || !config.projectId) {
    return { app: null, db: null, isConfigured: false };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    return { app, db, isConfigured: true };
  } catch (err) {
    console.warn("Failed to initialize Firebase:", err);
    return { app: null, db: null, isConfigured: false };
  }
}

const DOCUMENT_PATH = {
  collection: "workpad",
  docId: "default_user_notes",
};

export async function saveWorkpadStateToFirestore(
  dbInstance: Firestore,
  state: WorkpadState
): Promise<void> {
  const ref = doc(dbInstance, DOCUMENT_PATH.collection, DOCUMENT_PATH.docId);
  await setDoc(ref, {
    ...state,
    lastUpdated: Date.now(),
  });
}

export function subscribeToWorkpadChanges(
  dbInstance: Firestore,
  onUpdate: (state: WorkpadState) => void,
  onError?: (err: Error) => void
): () => void {
  const ref = doc(dbInstance, DOCUMENT_PATH.collection, DOCUMENT_PATH.docId);
  return onSnapshot(
    ref,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as WorkpadState;
        onUpdate(data);
      }
    },
    (err) => {
      console.error("Firestore subscription error:", err);
      if (onError) onError(err);
    }
  );
}
