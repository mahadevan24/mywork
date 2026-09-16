"use client";

import React, { useState } from "react";
import {
  Cloud,
  CloudOff,
  Search,
  Plus,
  FileText,
  LayoutGrid,
  Sun,
  Moon,
  Sparkles,
  Settings,
  Download,
  Upload,
} from "lucide-react";

interface NavbarProps {
  viewMode: "board" | "notepad";
  setViewMode: (mode: "board" | "notepad") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFirebaseConnected: boolean;
  isSyncing: boolean;
  onOpenFirebaseModal: () => void;
  onOpenNewSectionModal: () => void;
  onOpenQuickAddModal: () => void;
  onOpenImportExportModal: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  isFirebaseConnected,
  isSyncing,
  onOpenFirebaseModal,
  onOpenNewSectionModal,
  onOpenQuickAddModal,
  onOpenImportExportModal,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-mono">
                  DevNotes
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Modern developer notepad & task pipeline
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks, pipelines, branches... (Ctrl+K)"
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* View Switcher & Action Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex bg-slate-800/90 p-1 rounded-lg border border-slate-700/60">
              <button
                onClick={() => setViewMode("board")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  viewMode === "board"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Board & Task View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Board</span>
              </button>
              <button
                onClick={() => setViewMode("notepad")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  viewMode === "notepad"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Raw Notepad / Scratchpad View"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Notepad</span>
              </button>
            </div>

            {/* Quick Add Task / Section */}
            <button
              onClick={onOpenNewSectionModal}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Add New Section / Topic"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Section</span>
            </button>

            {/* Import / Export Notepad */}
            <button
              onClick={onOpenImportExportModal}
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 border border-slate-700/60 transition"
              title="Import or Export Raw Notepad"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Firebase Cloud Status Pill */}
            <button
              onClick={onOpenFirebaseModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition ${
                isFirebaseConnected
                  ? "bg-emerald-950/50 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/40"
                  : "bg-amber-950/40 text-amber-300 border-amber-800/80 hover:bg-amber-900/40"
              }`}
              title={
                isFirebaseConnected
                  ? isSyncing
                    ? "Syncing to Firebase Firestore..."
                    : "Connected to Firebase Cloud Sync"
                  : "Local Storage Mode (Click to configure Firebase)"
              }
            >
              {isFirebaseConnected ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">
                    {isSyncing ? "Syncing..." : "Cloud"}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Local Only</span>
                </>
              )}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
