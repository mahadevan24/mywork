"use client";

import React, { useState } from "react";
import { Priority, TaskItem } from "@/types/notes";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  AlertCircle,
  Zap,
  Filter,
} from "lucide-react";

interface QuickTasksProps {
  tasks: TaskItem[];
  onToggle: (id: string) => void;
  onAdd: (title: string, priority: Priority, tags: string[]) => void;
  onDelete: (id: string) => void;
  searchQuery?: string;
}

export const QuickTasks: React.FC<QuickTasksProps> = ({
  tasks,
  onToggle,
  onAdd,
  onDelete,
  searchQuery = "",
}) => {
  const [newTitle, setNewTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const handleAddItem = () => {
    if (!newTitle.trim()) return;

    const tags: string[] = [];
    const tagMatches = newTitle.match(/#([a-zA-Z0-9_\-]+)/g);
    if (tagMatches) {
      tagMatches.forEach((t) => tags.push(t.replace("#", "").toLowerCase()));
    }

    // Clean hashtag tokens from title if any were parsed
    const cleanTitle = newTitle
      .replace(/#([a-zA-Z0-9_\-]+)/g, "")
      .trim()
      .replace(/\s+/g, " ");

    onAdd(cleanTitle || newTitle.trim(), priority, tags);
    setNewTitle("");
    setPriority("normal");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (searchQuery) {
      const matchSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchSearch) return false;
    }
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-amber-500/10 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
            Quick Standup & Action Items
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {completedCount}/{tasks.length} done
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 self-end sm:self-auto text-xs bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/50">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-0.5 rounded-md transition ${
              filter === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-2 py-0.5 rounded-md transition ${
              filter === "active" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Active ({tasks.length - completedCount})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-2 py-0.5 rounded-md transition ${
              filter === "completed" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Done ({completedCount})
          </button>
        </div>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add quick item with #tags (e.g., 'Stop dev oce mails #work', 'BASTION request #access'). Press Enter"
            className="w-full pl-3 pr-24 py-2 text-xs rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
          />

          {/* Priority selector pill */}
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="text-[11px] bg-slate-900 text-slate-300 border border-slate-700 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent 🔥</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleAddItem}
          disabled={!newTitle.trim()}
          className="px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full py-6 text-center text-xs text-slate-500 font-mono">
            {searchQuery ? "No matching quick items." : "No items here yet. Type above to add."}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-start justify-between gap-2 p-2.5 rounded-lg border transition-all ${
                task.completed
                  ? "bg-slate-950/40 border-slate-800/60 opacity-65"
                  : task.priority === "urgent"
                  ? "bg-rose-950/20 border-rose-900/50 shadow-sm"
                  : task.priority === "high"
                  ? "bg-amber-950/20 border-amber-900/40"
                  : "bg-slate-800/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div
                onClick={() => onToggle(task.id)}
                className="flex items-start gap-2 flex-1 cursor-pointer select-none"
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 hover:text-indigo-400 shrink-0 transition"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs font-mono break-words leading-tight block ${
                      task.completed
                        ? "line-through text-slate-500"
                        : "text-slate-200"
                    }`}
                  >
                    {task.title}
                  </span>

                  {/* Badges: priority & tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {task.completed && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                        (done)
                      </span>
                    )}
                    {task.priority === "urgent" && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800/60 font-mono font-semibold">
                        URGENT
                      </span>
                    )}
                    {task.priority === "high" && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800/60 font-mono">
                        HIGH
                      </span>
                    )}
                    {task.tags &&
                      task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
