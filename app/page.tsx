"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useNotesStore } from "@/hooks/useNotesStore";
import { Navbar } from "@/components/Navbar";
import { QuickTasks } from "@/components/QuickTasks";
import { DirectStreamView } from "@/components/DirectStreamView";
import { ProjectCard } from "@/components/ProjectCard";
import { ScratchpadView } from "@/components/ScratchpadView";
import { FirebaseModal } from "@/components/FirebaseModal";
import { ImportExportModal } from "@/components/ImportExportModal";
import { NewSectionModal } from "@/components/NewSectionModal";
import confetti from "canvas-confetti";
import { Plus, Layers, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";

export default function Home() {
  const {
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
  } = useNotesStore();

  const [viewMode, setViewMode] = useState<"focus" | "board" | "notepad">("focus");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  // Theme state: defaults to dark unless 'light' is specified in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const storedTheme = localStorage.getItem("devnotes_theme");
        if (storedTheme) return storedTheme === "dark";
      } catch (e) {}
    }
    return true;
  });
  const [streamTabFilter, setStreamTabFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    try {
      localStorage.setItem("devnotes_theme", darkMode ? "dark" : "light");
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {}
  }, [darkMode]);

  // Modals state
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isNewSectionModalOpen, setIsNewSectionModalOpen] = useState(false);

  // Sync selectedSectionId on initial load or if section is deleted
  useEffect(() => {
    if (state.sections.length > 0) {
      const exists = state.sections.some((s) => s.id === selectedSectionId);
      if (!exists) {
        setSelectedSectionId(state.sections[0].id);
      }
    } else {
      setSelectedSectionId("");
    }
  }, [state.sections, selectedSectionId]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const allQuick = state.quickTodos || [];
    const allSectionTasks = state.sections.flatMap((s) => s.tasks) || [];
    const all = [...allQuick, ...allSectionTasks];
    const total = all.length;
    const completed = all.filter((t) => t.completed).length;
    const urgent = all.filter((t) => !t.completed && (t.priority === "urgent" || t.priority === "high")).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      totalTasks: total,
      completedTasks: completed,
      urgentTasks: urgent,
      streamsCount: state.sections.length,
      progressPercent: pct,
    };
  }, [state]);

  // Keyboard shortcut listeners (Ctrl+K, Ctrl+1..9, Ctrl+B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Search"]'
        );
        if (searchInput) searchInput.focus();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setViewMode((prev) => (prev === "focus" ? "board" : "focus"));
      } else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= 9) {
          const idx = num - 1;
          if (state.sections[idx]) {
            e.preventDefault();
            setSelectedSectionId(state.sections[idx].id);
            setViewMode("focus");
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.sections]);

  const handleToggleTaskWithConfetti = (sectionId: string, taskId: string) => {
    const section = state.sections.find((s) => s.id === sectionId);
    const task = section?.tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#6366f1", "#10b981", "#38bdf8"],
      });
    }
    toggleTask(sectionId, taskId);
  };

  const handleToggleQuickWithConfetti = (id: string) => {
    const quickTask = state.quickTodos.find((t) => t.id === id);
    if (quickTask && !quickTask.completed) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#6366f1", "#10b981", "#fbbf24"],
      });
    }
    toggleQuickTodo(id);
  };

  // Active section for direct focus view
  const activeSection =
    state.sections.find((s) => s.id === selectedSectionId) || state.sections[0];

  // Filtered sections for stream tabs
  const filteredSections = state.sections.filter((sec) => {
    const isCompleted = sec.tasks.length > 0 && sec.tasks.every((t) => t.completed);
    if (streamTabFilter === "active") return !isCompleted;
    if (streamTabFilter === "completed") return isCompleted;
    return true;
  });

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex flex-col ${
        darkMode ? "dark bg-[#0b0f19] text-slate-100" : "light bg-slate-100 text-slate-800"
      } font-sans select-none`}
    >
      {/* Top Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isFirebaseConnected={isFirebaseConnected}
        isSyncing={isSyncing}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        onOpenNewSectionModal={() => setIsNewSectionModalOpen(true)}
        onOpenQuickAddModal={() => {}}
        onOpenImportExportModal={() => setIsImportExportModalOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        stats={stats}
      />

      {/* Direct Stream Selector Tabs Bar (Instant 1-Click Access) */}
      <div className="bg-slate-100/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800/90 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto scrollbar-none py-0.5">
          {/* Streams Tab Label & Filter */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 pr-2 border-r border-slate-200 dark:border-slate-800 shrink-0">
            <span className="uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Streams:
            </span>
            <button
              onClick={() =>
                setStreamTabFilter((prev) =>
                  prev === "all" ? "active" : prev === "active" ? "completed" : "all"
                )
              }
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition font-mono"
              title="Click to toggle filter: All / Active / Completed"
            >
              [{streamTabFilter}]
            </button>
          </div>

          {/* Stream Direct Tabs */}
          {filteredSections.map((sec, idx) => {
            const isSelected = activeSection?.id === sec.id && viewMode === "focus";
            const completedCount = sec.tasks.filter((t) => t.completed).length;
            const totalCount = sec.tasks.length;
            const isDone = totalCount > 0 && completedCount === totalCount;

            return (
              <button
                key={sec.id}
                onClick={() => {
                  setSelectedSectionId(sec.id);
                  setViewMode("focus");
                }}
                className={`group flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all shrink-0 ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-white border-indigo-300 dark:border-indigo-500/70 shadow-sm ring-1 ring-indigo-400/30 dark:ring-indigo-500/40 font-semibold"
                    : "bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                }`}
                title={`Open "${sec.title}" (Ctrl+${idx + 1})`}
              >
                {/* Dot color indicator */}
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: sec.color || "#6366f1" }}
                />

                <span className="truncate max-w-[150px]">{sec.title}</span>

                {/* Progress / Status pill */}
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isDone
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800/60"
                      : isSelected
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {completedCount}/{totalCount}
                </span>

                {/* Shortcut tag for first 9 */}
                {idx < 9 && (
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 opacity-60 group-hover:opacity-100 hidden xl:inline font-mono">
                    ^{idx + 1}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Add Stream Button directly on tab bar */}
          <button
            onClick={() => setIsNewSectionModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 border border-dashed border-slate-300 dark:border-slate-700 transition shrink-0"
            title="Create a new stream section"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Stream</span>
          </button>
        </div>
      </div>

      {/* Main Screen-Fitted Workspace (Zero Outer Page Scroll) */}
      <main className="flex-1 overflow-hidden flex divide-x divide-slate-200/80 dark:divide-slate-800/80 p-2 sm:p-2.5 gap-2 sm:gap-2.5 min-h-0 bg-slate-100 dark:bg-slate-950/20">
        {/* Left Column: Persistent Standup & Quick Items (~360px) */}
        <div className="w-72 sm:w-80 lg:w-96 shrink-0 h-full overflow-hidden flex flex-col">
          <QuickTasks
            tasks={state.quickTodos}
            onToggle={handleToggleQuickWithConfetti}
            onAdd={addQuickTodo}
            onDelete={deleteQuickTodo}
            searchQuery={searchQuery}
            className="h-full"
          />
        </div>

        {/* Right / Main Pane: Direct Active Stream or Multi-Column Board or Scratchpad */}
        <div className="flex-1 h-full overflow-hidden flex flex-col min-w-0">
          {viewMode === "notepad" ? (
            <ScratchpadView
              state={state}
              onApplyState={replaceAllState}
              onSwitchToBoard={() => setViewMode("focus")}
              className="h-full"
            />
          ) : viewMode === "board" ? (
            /* Horizontal Multi-Column Board */
            <div className="h-full overflow-x-auto overflow-y-hidden flex gap-3 pb-1">
              {state.sections.length === 0 ? (
                <div className="m-auto text-center p-8 text-slate-500 font-mono text-xs">
                  No topic streams yet. Click &quot;New Stream&quot; above to create one.
                </div>
              ) : (
                state.sections.map((sec) => (
                  <ProjectCard
                    key={sec.id}
                    section={sec}
                    onToggleTask={handleToggleTaskWithConfetti}
                    onToggleSubTask={toggleSubTask}
                    onAddTask={addTask}
                    onDeleteTask={deleteTask}
                    onDeleteSection={deleteSection}
                    onUpdateNotes={updateSectionNotes}
                    searchQuery={searchQuery}
                    className="w-80 shrink-0 h-full flex flex-col"
                  />
                ))
              )}
            </div>
          ) : (
            /* Focus Mode (Direct Stream Command Center) */
            activeSection ? (
              <DirectStreamView
                section={activeSection}
                onToggleTask={handleToggleTaskWithConfetti}
                onToggleSubTask={toggleSubTask}
                onAddTask={addTask}
                onDeleteTask={deleteTask}
                onDeleteSection={deleteSection}
                onUpdateNotes={updateSectionNotes}
                searchQuery={searchQuery}
              />
            ) : (
              <div className="h-full bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 font-mono text-sm mb-3">
                  No work stream topics found.
                </p>
                <button
                  onClick={() => setIsNewSectionModalOpen(true)}
                  className="px-4 py-2 text-xs font-mono bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition inline-flex items-center gap-2 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Stream</span>
                </button>
              </div>
            )
          )}
        </div>
      </main>

      {/* Ultra-Compact Bottom Status Bar */}
      <footer className="h-7 shrink-0 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800/80 px-3 text-[11px] font-mono text-slate-500 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <span className="text-slate-600 dark:text-slate-400">
            DevNotes WorkPad • Zero-Scroll Direct Workspace
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="hidden md:inline text-slate-500">
            Shortcuts: <kbd className="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-transparent">Ctrl+K</kbd> Search • <kbd className="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-transparent">Ctrl+1..9</kbd> Jump stream • <kbd className="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-transparent">Ctrl+B</kbd> Toggle board
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportExportModalOpen(true)}
            className="hover:text-slate-800 dark:hover:text-slate-300 transition"
          >
            Import / Export
          </button>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <button
            onClick={() => setIsFirebaseModalOpen(true)}
            className="hover:text-slate-800 dark:hover:text-slate-300 transition"
          >
            {isFirebaseConnected ? (
              <span className="text-emerald-600 dark:text-emerald-400">Cloud Synced</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400/90">Local Storage</span>
            )}
          </button>
        </div>
      </footer>

      {/* Modals */}
      <FirebaseModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        isConnected={isFirebaseConnected}
        currentSettings={firebaseSettings}
        onSave={updateFirebaseConfig}
        onDisconnect={disconnectFirebase}
        syncError={syncError}
      />

      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        state={state}
        onApplyState={replaceAllState}
        onResetDemo={resetToDemo}
      />

      <NewSectionModal
        isOpen={isNewSectionModalOpen}
        onClose={() => setIsNewSectionModalOpen(false)}
        onAdd={addSection}
      />
    </div>
  );
}
