"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  FirebaseSettings,
  Priority,
  SectionTopic,
  SubTask,
  TaskItem,
  WorkpadState,
} from "@/types/notes";
import { INITIAL_DATA } from "@/lib/initialData";
import {
  FIREBASE_SETTINGS_KEY,
  LOCAL_STORAGE_DATA_KEY,
  getStoredFirebaseSettings,
  initFirebase,
  saveWorkpadStateToFirestore,
  subscribeToWorkpadChanges,
} from "@/lib/firebase";
import { Firestore } from "firebase/firestore";

export function useNotesStore() {
  const [state, setState] = useState<WorkpadState>(INITIAL_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [firebaseSettings, setFirebaseSettings] = useState<FirebaseSettings | null>(
    null
  );

  const dbRef = useRef<Firestore | null>(null);
  const isRemoteUpdate = useRef(false);

  // 1. Initial Load: localStorage first
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.sections)) {
          setState(parsed);
        } else {
          setState(INITIAL_DATA);
        }
      } else {
        localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(INITIAL_DATA));
        setState(INITIAL_DATA);
      }

      const fbSettings = getStoredFirebaseSettings();
      setFirebaseSettings(fbSettings);
    } catch (e) {
      console.warn("Storage access warning:", e);
      setState(INITIAL_DATA);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Initialize Firebase if config exists
  useEffect(() => {
    if (!isLoaded) return;

    const { db, isConfigured } = initFirebase(firebaseSettings || undefined);
    dbRef.current = db;
    setIsFirebaseConnected(isConfigured);

    if (db && isConfigured) {
      const unsubscribe = subscribeToWorkpadChanges(
        db,
        (cloudState) => {
          isRemoteUpdate.current = true;
          setState(cloudState);
          try {
            localStorage.setItem(
              LOCAL_STORAGE_DATA_KEY,
              JSON.stringify(cloudState)
            );
          } catch {}
          setTimeout(() => {
            isRemoteUpdate.current = false;
          }, 100);
        },
        (err) => {
          setSyncError(err.message);
        }
      );

      return () => unsubscribe();
    }
  }, [isLoaded, firebaseSettings]);

  // 3. Save helper: persists locally and writes to Firestore
  const persistState = useCallback(
    async (newState: WorkpadState) => {
      setState(newState);

      // Local persistence
      try {
        localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(newState));
      } catch (err) {
        console.error("Failed to save to localStorage", err);
      }

      // Cloud persistence if connected
      if (dbRef.current && isFirebaseConnected && !isRemoteUpdate.current) {
        try {
          setIsSyncing(true);
          setSyncError(null);
          await saveWorkpadStateToFirestore(dbRef.current, newState);
        } catch (err: any) {
          console.error("Error saving to Firestore", err);
          setSyncError(err.message || "Failed to sync to cloud");
        } finally {
          setIsSyncing(false);
        }
      }
    },
    [isFirebaseConnected]
  );

  // Quick Todo Actions
  const toggleQuickTodo = useCallback(
    (id: string) => {
      const updatedTodos = state.quickTodos.map((todo) => {
        if (todo.id === id) {
          const nextCompleted = !todo.completed;
          return {
            ...todo,
            completed: nextCompleted,
            completedAt: nextCompleted ? Date.now() : undefined,
          };
        }
        return todo;
      });

      persistState({
        ...state,
        quickTodos: updatedTodos,
        lastUpdated: Date.now(),
      });
    },
    [state, persistState]
  );

  const addQuickTodo = useCallback(
    (title: string, priority: Priority = "normal", tags: string[] = []) => {
      if (!title.trim()) return;
      const newTodo: TaskItem = {
        id: `quick-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        completed: false,
        priority,
        tags,
        createdAt: Date.now(),
      };

      persistState({
        ...state,
        quickTodos: [newTodo, ...state.quickTodos],
        lastUpdated: Date.now(),
      });
    },
    [state, persistState]
  );

  const deleteQuickTodo = useCallback(
    (id: string) => {
      persistState({
        ...state,
        quickTodos: state.quickTodos.filter((t) => t.id !== id),
        lastUpdated: Date.now(),
      });
    },
    [state, persistState]
  );

  // Section Task Actions
  const toggleTask = useCallback(
    (sectionId: string, taskId: string) => {
      const updatedSections = state.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          tasks: sec.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const nextCompleted = !task.completed;
            return {
              ...task,
              completed: nextCompleted,
              completedAt: nextCompleted ? Date.now() : undefined,
            };
          }),
        };
      });

      persistState({
        ...state,
        sections: updatedSections,
        lastUpdated: Date.now(),
      });
    },
    [state, persistState]
  );

  const toggleSubTask = useCallback(
    (sectionId: string, taskId: string, subtaskId: string) => {
      const updatedSections = state.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          tasks: sec.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              subtasks: (task.subtasks || []).map((sub) => {
                if (sub.id !== subtaskId) return sub;
                return { ...sub, completed: !sub.completed };
              }),
            };
          }),
        };
      });

      persistState({
        ...state,
        sections: updatedSections,
        lastUpdated: Date.now(),
      });
    },
    [state, persistState]
  );

  const addTask = useCallback(
    (
      sectionId: string,
      title: string,
      priority: Priority = "normal",
      tags: string[] = [],
      subtasksList: string[] = []
    ) => {
      if (!title.trim()) return;
      const newTask: TaskItem = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        completed: false,
        priority,
        tags: tags.length > 0 ? tags : undefined,
        subtasks: subtasksList.map((st, i) => ({
          id: `sub-${Date.now()}-${i}`,
          title: st,
          completed: false,
        })),
        createdAt: Date.now(),
      };

      const updatedSections = state.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          tasks: [...sec.tasks, newTask],
        };
      });

      persistState({
        ...state,
        sections: updatedSections,
        lastUpdated: Date.now(),
      });
    },
    [state, persistState]
  );

  const deleteTask = useCallback(
    (sectionId: string, taskId: string) => {
      const updatedSections = state.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          tasks: sec.tasks.filter((t) => t.id !== taskId),
        };
      });

      persistState({
        ...state,
        sections: updatedSections,
        lastUpdated: Date.now(),
      });
    },
    [state, persistState]
  );

  const addSection = useCallback(
    (title: string, color = "#3b82f6", description = "") => {
      if (!title.trim()) return;
      const newSec: SectionTopic = {
        id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        order: state.sections.length + 1,
        color,
        description,
        tasks: [],
        createdAt: Date.now(),
      };

      persistState({
        ...state,
        sections: [...state.sections, newSec],
        lastUpdated: Date.now(),
      });
    },
    [state, persistState]
  );

  const deleteSection = useCallback(
    (sectionId: string) => {
      persistState({
        ...state,
        sections: state.sections.filter((s) => s.id !== sectionId),
        lastUpdated: Date.now(),
      });
    },
    [state, persistState]
  );

  const updateSectionNotes = useCallback(
    (sectionId: string, notes: string) => {
      const updatedSections = state.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return { ...sec, notes };
      });

      persistState({
        ...state,
        sections: updatedSections,
        lastUpdated: Date.now(),
      });
    },
    [state, persistState]
  );

  const replaceAllState = useCallback(
    (newState: WorkpadState) => {
      persistState(newState);
    },
    [persistState]
  );

  const resetToDemo = useCallback(() => {
    persistState(INITIAL_DATA);
  }, [persistState]);

  const updateFirebaseConfig = useCallback(
    async (settings: FirebaseSettings) => {
      try {
        localStorage.setItem(FIREBASE_SETTINGS_KEY, JSON.stringify(settings));
        setFirebaseSettings(settings);
        const { isConfigured, db } = initFirebase(settings);
        setIsFirebaseConnected(isConfigured);
        if (db && isConfigured) {
          // Push current state to Firestore right after connecting
          await saveWorkpadStateToFirestore(db, state);
        }
        return true;
      } catch (err: any) {
        setSyncError(err.message || "Failed to configure Firebase");
        return false;
      }
    },
    [state]
  );

  const disconnectFirebase = useCallback(() => {
    localStorage.removeItem(FIREBASE_SETTINGS_KEY);
    setFirebaseSettings(null);
    setIsFirebaseConnected(false);
    dbRef.current = null;
  }, []);

  return {
    state,
    isLoaded,
    isFirebaseConnected,
    isSyncing,
    syncError,
    firebaseSettings,
    toggleQuickTodo,
    addQuickTodo,
    deleteQuickTodo,
    toggleTask,
    toggleSubTask,
    addTask,
    deleteTask,
    addSection,
    deleteSection,
    updateSectionNotes,
    replaceAllState,
    resetToDemo,
    updateFirebaseConfig,
    disconnectFirebase,
  };
}
