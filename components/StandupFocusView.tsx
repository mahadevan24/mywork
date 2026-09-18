"use client";

import React, { useState } from "react";
import { Priority, TaskItem } from "@/types/notes";
import {
  Zap,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Copy,
  Check,
  Flame,
  Calendar,
  Sparkles,
  Search,
} from "lucide-react";

interface StandupFocusViewProps {
  tasks: TaskItem[];
  onToggle: (id: string) => void;
  onAdd: (title: string, priority: Priority, tags: string[]) => void;
  onDelete: (id: string) => void;
  onExitFocus?: () => void;
  searchQuery?: string;
}

export const StandupFocusView: React.FC<StandupFocusViewProps> = ({
  tasks,
  onToggle,
  onAdd,
  onDelete,
  onExitFocus,
  searchQuery = "",
}) => {
  const [newTitle, setNewTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [filter, setFilter] = useState<"all" | "active" | "urgent" | "completed">("all");
  const [isCopied, setIsCopied] = useState(false);

  // Formatted today's date
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim()) return;

    const tags: string[] = [];
    const tagMatches = newTitle.match(/#([a-zA-Z0-9_\-]+)/g);
    if (tagMatches) {
      tagMatches.forEach((t) => tags.push(t.replace("#", "").toLowerCase()));
    }

    const cleanTitle = newTitle
      .replace(/#([a-zA-Z0-9_\-]+)/g, "")
      .trim()
      .replace(/\s+/g, " ");

    onAdd(cleanTitle || newTitle.trim(), priority, tags);
    setNewTitle("");
    setPriority("normal");
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeTasks = tasks.filter((t) => !t.completed);
  const urgentCount = activeTasks.filter(
    (t) => t.priority === "urgent" || t.priority === "high"
  ).length;
  const progressPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (searchQuery) {
      const matchSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchSearch) return false;
    }
    if (filter === "active") return !task.completed;
    if (filter === "urgent")
      return !task.completed && (task.priority === "urgent" || task.priority === "high");
    if (filter === "completed") return task.completed;
    return true;
  });

  // Copy standup summary to clipboard
  const handleCopyStandupSummary = () => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const activeList = tasks.filter((t) => !t.completed);
    const urgentList = activeList.filter((t) => t.priority === "urgent");
    const normalActiveList = activeList.filter((t) => t.priority !== "urgent");
    const doneList = tasks.filter((t) => t.completed);

    let summary = `🚀 Standup Update (${today})\n\n`;

    if (urgentList.length > 0) {
      summary += `🔥 Urgent / Blockers:\n`;
      urgentList.forEach((t) => {
        const tags = t.tags && t.tags.length > 0 ? ` #${t.tags.join(" #")}` : "";
        summary += `• ${t.title}${tags}\n`;
      });
      summary += `\n`;
    }

    summary += `🎯 In Progress / Today (${normalActiveList.length}):\n`;
    if (normalActiveList.length === 0) {
      summary += `• None currently pending\n`;
    } else {
      normalActiveList.forEach((t) => {
        const priorityTag = t.priority === "high" ? " [HIGH]" : "";
        const tags = t.tags && t.tags.length > 0 ? ` #${t.tags.join(" #")}` : "";
        summary += `• ${t.title}${priorityTag}${tags}\n`;
      });
    }
    summary += `\n`;

    summary += `✅ Completed (${doneList.length}):\n`;
    if (doneList.length === 0) {
      summary += `• None yet\n`;
    } else {
      doneList.forEach((t) => {
        const tags = t.tags && t.tags.length > 0 ? ` #${t.tags.join(" #")}` : "";
        summary += `• ${t.title}${tags}\n`;
      });
    }

    navigator.clipboard.writeText(summary.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Top Banner / Standup Header */}
      <div className="p-4 px-5 bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-transparent border-b border-slate-200 dark:border-slate-800 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-500 dark:text-amber-400 shadow-sm">
              <Zap className="w-4 h-4 fill-amber-500/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                  Standup Focus
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-mono font-medium flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Focus Mode
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{todayFormatted}</span>
                <span>•</span>
                <span>
                  {activeTasks.length} active • {completedCount} done
                </span>
                {urgentCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-0.5">
                      <Flame className="w-3 h-3" />
                      {urgentCount} urgent
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Progress pill & bar */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 font-mono text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              {progressPercent}% Complete
            </span>
            <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Copy Standup Summary Button */}
          <button
            onClick={handleCopyStandupSummary}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition shadow-sm border ${
              isCopied
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
            }`}
            title="Copy formatted standup report for Slack / Teams / Email"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Copied Summary!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Copy for Standup</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area (Max width centered for ideal reading & focus) */}
      <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6 max-w-4xl w-full mx-auto">
        {/* Quick Add Bar */}
        <form onSubmit={handleAddItem} className="mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="+ Add standup item (e.g. 'Fix login redirect #auth')... Press Enter"
                className="w-full pl-3.5 pr-24 py-2.5 text-xs sm:text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white dark:focus:bg-slate-800 transition"
                autoFocus
              />

              {/* Priority selector pill */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="text-xs font-mono bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent 🔥</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition flex items-center gap-1.5 shrink-0 shadow-sm font-mono"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </form>

        {/* Filter Tabs Bar */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs font-mono">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded transition ${
                filter === "all"
                  ? "bg-indigo-600 text-white font-medium shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1 rounded transition ${
                filter === "active"
                  ? "bg-indigo-600 text-white font-medium shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Active ({activeTasks.length})
            </button>
            <button
              onClick={() => setFilter("urgent")}
              className={`px-3 py-1 rounded transition flex items-center gap-1 ${
                filter === "urgent"
                  ? "bg-rose-600 text-white font-medium shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Urgent ({urgentCount})</span>
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded transition ${
                filter === "completed"
                  ? "bg-indigo-600 text-white font-medium shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Done ({completedCount})
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400 dark:text-slate-500 hidden sm:block">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Esc</kbd> to return to stream view
          </div>
        </div>

        {/* Scrollable Tasks List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5">
          {filteredTasks.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500 font-mono text-xs sm:text-sm">
              <Zap className="w-8 h-8 mb-2 opacity-30 text-amber-500" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">
                {searchQuery
                  ? "No standup items match your search filter."
                  : filter === "completed"
                  ? "No completed standup items yet."
                  : filter === "urgent"
                  ? "No urgent blockers! Great job!"
                  : "No items here. Add your daily standup tasks above!"}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                  task.completed
                    ? "bg-slate-50/50 border-slate-200 dark:bg-slate-950/40 dark:border-slate-800/60 opacity-60"
                    : task.priority === "urgent"
                    ? "bg-rose-50/80 border-rose-200 dark:bg-rose-950/25 dark:border-rose-900/60 shadow-sm hover:border-rose-300"
                    : task.priority === "high"
                    ? "bg-amber-50/80 border-amber-200 dark:bg-amber-950/25 dark:border-amber-900/50 hover:border-amber-300"
                    : "bg-slate-50/80 border-slate-200 hover:border-slate-300 dark:bg-slate-800/40 dark:border-slate-800 dark:hover:border-slate-700"
                }`}
              >
                <div
                  onClick={() => onToggle(task.id)}
                  className="flex items-start gap-3 flex-1 cursor-pointer select-none"
                >
                  <button
                    type="button"
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 transition"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs sm:text-sm font-mono leading-relaxed break-words block ${
                        task.completed
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : task.priority === "urgent"
                          ? "text-rose-950 dark:text-rose-200 font-semibold"
                          : "text-slate-800 dark:text-slate-200 font-medium"
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Badges: Priority, Tags, Done */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {task.completed && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/60 font-mono">
                          Completed
                        </span>
                      )}
                      {task.priority === "urgent" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800/60 font-mono font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          URGENT
                        </span>
                      )}
                      {task.priority === "high" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800/60 font-mono font-medium">
                          HIGH
                        </span>
                      )}
                      {task.tags &&
                        task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 border border-slate-300 dark:border-transparent dark:bg-slate-800 dark:text-slate-300 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
