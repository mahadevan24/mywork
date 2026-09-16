"use client";

import React, { useState, useEffect } from "react";
import { useNotesStore } from "@/hooks/useNotesStore";
import { Navbar } from "@/components/Navbar";
import { QuickTasks } from "@/components/QuickTasks";
import { ProjectCard } from "@/components/ProjectCard";
import { ScratchpadView } from "@/components/ScratchpadView";
import { FirebaseModal } from "@/components/FirebaseModal";
import { ImportExportModal } from "@/components/ImportExportModal";
import { NewSectionModal } from "@/components/NewSectionModal";
import { StatsSummary } from "@/components/StatsSummary";
import confetti from "canvas-confetti";
import { Plus, Sparkles, FolderPlus, Terminal } from "lucide-react";

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

  const [viewMode, setViewMode] = useState<"board" | "notepad">("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  // Modals state
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isNewSectionModalOpen, setIsNewSectionModalOpen] = useState(false);

  // Keyboard shortcut listeners (e.g. Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Search"]'
        );
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleTaskWithConfetti = (sectionId: string, taskId: string) => {
    const section = state.sections.find((s) => s.id === sectionId);
    const task = section?.tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      // Fire confetti for satisfying task completion
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-mono gap-3">
        <div className="h-8 w-8 rounded-lg bg-indigo-600 animate-spin flex items-center justify-center">
          <Terminal className="w-4 h-4 text-white" />
        </div>
        <p className="text-sm">Initializing DevNotes...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-[#0b0f19]" : "light bg-slate-100"} transition-colors duration-200 text-slate-100 flex flex-col font-sans`}>
      {/* Navbar */}
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
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === "notepad" ? (
          <ScratchpadView
            state={state}
            onApplyState={replaceAllState}
            onSwitchToBoard={() => setViewMode("board")}
          />
        ) : (
          <div className="space-y-6">
            {/* Developer Top Stats */}
            <StatsSummary state={state} />

            {/* Quick Actions / Top Notepad items */}
            <QuickTasks
              tasks={state.quickTodos}
              onToggle={handleToggleQuickWithConfetti}
              onAdd={addQuickTodo}
              onDelete={deleteQuickTodo}
              searchQuery={searchQuery}
            />

            {/* Topic / Project Sections Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase font-mono">
                    Project Work Streams
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                    {state.sections.length} topics
                  </span>
                </div>

                <button
                  onClick={() => setIsNewSectionModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>New Topic Section</span>
                </button>
              </div>

              {state.sections.length === 0 ? (
                <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center">
                  <p className="text-slate-400 font-mono text-sm mb-3">
                    No topic sections yet.
                  </p>
                  <button
                    onClick={() => setIsNewSectionModalOpen(true)}
                    className="px-4 py-2 text-xs font-mono bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Section</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {state.sections.map((section) => (
                    <ProjectCard
                      key={section.id}
                      section={section}
                      onToggleTask={handleToggleTaskWithConfetti}
                      onToggleSubTask={toggleSubTask}
                      onAddTask={addTask}
                      onDeleteTask={deleteTask}
                      onDeleteSection={deleteSection}
                      onUpdateNotes={updateSectionNotes}
                      searchQuery={searchQuery}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 mt-12 bg-slate-950/60 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DevNotes WorkPad • Next.js + Tailwind CSS + Firebase</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsImportExportModalOpen(true)}
              className="hover:text-slate-300 transition"
            >
              Export / Import
            </button>
            <span>•</span>
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className="hover:text-slate-300 transition"
            >
              {isFirebaseConnected ? "Firebase Connected" : "Connect Firebase"}
            </button>
          </div>
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
