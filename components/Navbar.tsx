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
  Briefcase,
  Settings,
  Download,
  Upload,
  Flame,
  Layout,
  Columns,
  Layers,
  Lock,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  viewMode: "standup" | "focus" | "board" | "notepad";
  setViewMode: (mode: "standup" | "focus" | "board" | "notepad") => void;
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
  stats?: {
    totalTasks: number;
    completedTasks: number;
    urgentTasks: number;
    streamsCount: number;
    progressPercent: number;
  };
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
  stats,
}) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shrink-0 select-none backdrop-blur-sm">
      <div className="w-full px-3 sm:px-4">
        <div className="flex items-center justify-between h-13 py-1.5 gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white font-mono">
                  MyWork
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 font-mono font-medium">
                  v2.0
                </span>
              </div>
            </div>
          </div>

          {/* Compact Stats Ticker in Navbar */}
          {stats && (
            <div className="hidden xl:flex items-center gap-3 bg-slate-100/90 dark:bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800/80 font-mono text-xs">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span className="text-slate-600 dark:text-slate-400">{stats.streamsCount} streams</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {stats.completedTasks}/{stats.totalTasks} done
                </span>
                <span className="text-slate-500 dark:text-slate-500">({stats.progressPercent}%)</span>
              </div>
              {stats.urgentTasks > 0 && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{stats.urgentTasks} urgent</span>
                  </div>
                </>
              )}
              {/* Mini pace bar */}
              <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden ml-1">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${stats.progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Search bar */}
          <div className="flex-1 max-w-xs md:max-w-sm">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all items... (Ctrl+K)"
                className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* View Switcher & Action Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* 4 View Mode Switchers: Standup, Focus, Board, Notepad */}
            <div className="flex bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs font-mono">
              <button
                onClick={() => setViewMode("standup")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
                  viewMode === "standup"
                    ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                title="Daily Standup Focus Mode (Ctrl+J)"
              >
                <Zap
                  className={`w-3.5 h-3.5 ${
                    viewMode === "standup"
                      ? "text-slate-950 fill-slate-950/20"
                      : "text-amber-500"
                  }`}
                />
                <span className="hidden md:inline">Standup</span>
              </button>
              <button
                onClick={() => setViewMode("focus")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
                  viewMode === "focus"
                    ? "bg-indigo-600 text-white font-medium shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                title="Direct Stream Focus View"
              >
                <Layout className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Focus</span>
              </button>
              <button
                onClick={() => setViewMode("board")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
                  viewMode === "board"
                    ? "bg-indigo-600 text-white font-medium shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                title="Multi-Column Board View"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Board</span>
              </button>
              <button
                onClick={() => setViewMode("notepad")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
                  viewMode === "notepad"
                    ? "bg-indigo-600 text-white font-medium shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                title="Raw Markdown Notepad"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Notepad</span>
              </button>
            </div>

            {/* Quick Add Section */}
            <button
              onClick={onOpenNewSectionModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              title="Add New Section / Topic"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline font-mono">Stream</span>
            </button>

            {/* Import / Export Notepad */}
            <button
              onClick={onOpenImportExportModal}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition"
              title="Import or Export Raw Notepad"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Firebase Cloud Status Pill */}
            <button
              onClick={onOpenFirebaseModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition ${
                isFirebaseConnected
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/80 dark:hover:bg-emerald-900/40"
                  : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/80 dark:hover:bg-amber-900/40"
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
                  <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden md:inline">
                    {isSyncing ? "Syncing..." : "Cloud"}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="hidden md:inline">Local Only</span>
                </>
              )}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Lock Workspace (Sign Out) */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700/60 transition disabled:opacity-50"
              title="Lock Workspace (Sign Out)"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
