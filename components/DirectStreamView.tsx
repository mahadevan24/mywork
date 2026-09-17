"use client";

import React, { useState, useEffect } from "react";
import { Priority, SectionTopic, TaskItem } from "@/types/notes";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  CornerDownRight,
  Sparkles,
  FileCode,
  Tag,
  Copy,
  Check,
  Flame,
  AlertCircle,
} from "lucide-react";

interface DirectStreamViewProps {
  section: SectionTopic;
  onToggleTask: (sectionId: string, taskId: string) => void;
  onToggleSubTask: (sectionId: string, taskId: string, subtaskId: string) => void;
  onAddTask: (
    sectionId: string,
    title: string,
    priority: Priority,
    tags: string[],
    subtasks: string[]
  ) => void;
  onDeleteTask: (sectionId: string, taskId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onUpdateNotes: (sectionId: string, notes: string) => void;
  searchQuery?: string;
}

export const DirectStreamView: React.FC<DirectStreamViewProps> = ({
  section,
  onToggleTask,
  onToggleSubTask,
  onAddTask,
  onDeleteTask,
  onDeleteSection,
  onUpdateNotes,
  searchQuery = "",
}) => {
  const [taskFilter, setTaskFilter] = useState<"all" | "active" | "completed">("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("normal");
  const [notesContent, setNotesContent] = useState(section.notes || "");
  const [isCopiedNotes, setIsCopiedNotes] = useState(false);
  const [addingSubtaskId, setAddingSubtaskId] = useState<string | null>(null);
  const [newSubtask, setNewSubtask] = useState("");

  // Sync notes when active section changes
  useEffect(() => {
    setNotesContent(section.notes || "");
  }, [section.id, section.notes]);

  const completedTasks = section.tasks.filter((t) => t.completed).length;
  const totalTasks = section.tasks.length;
  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const tags: string[] = [];
    const tagMatches = newTaskTitle.match(/#([a-zA-Z0-9_\-]+)/g);
    if (tagMatches) {
      tagMatches.forEach((t) => tags.push(t.replace("#", "").toLowerCase()));
    }

    const cleanTitle = newTaskTitle
      .replace(/#([a-zA-Z0-9_\-]+)/g, "")
      .trim()
      .replace(/\s+/g, " ");

    onAddTask(
      section.id,
      cleanTitle || newTaskTitle.trim(),
      newPriority,
      tags,
      []
    );
    setNewTaskTitle("");
    setNewPriority("normal");
  };

  const handleNotesBlur = () => {
    if (notesContent !== section.notes) {
      onUpdateNotes(section.id, notesContent);
    }
  };

  const handleCopyNotes = () => {
    if (!notesContent) return;
    navigator.clipboard.writeText(notesContent);
    setIsCopiedNotes(true);
    setTimeout(() => setIsCopiedNotes(false), 2000);
  };

  const filteredTasks = section.tasks.filter((t) => {
    if (searchQuery) {
      const match =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.subtasks?.some((st) =>
          st.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      if (!match) return false;
    }
    if (taskFilter === "active") return !t.completed;
    if (taskFilter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Stream Top Header */}
      <div className="p-3.5 px-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-3 h-7 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: section.color || "#6366f1" }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white truncate font-mono tracking-tight">
                {section.title}
              </h2>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
                  progressPercent === 100
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/80"
                    : "bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800/80"
                }`}
              >
                {progressPercent}% done
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter tabs */}
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-950/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <button
              onClick={() => setTaskFilter("all")}
              className={`px-2.5 py-1 rounded transition ${
                taskFilter === "all"
                  ? "bg-indigo-600 text-white font-medium shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              All ({totalTasks})
            </button>
            <button
              onClick={() => setTaskFilter("active")}
              className={`px-2.5 py-1 rounded transition ${
                taskFilter === "active"
                  ? "bg-indigo-600 text-white font-medium shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Active ({totalTasks - completedTasks})
            </button>
            <button
              onClick={() => setTaskFilter("completed")}
              className={`px-2.5 py-1 rounded transition ${
                taskFilter === "completed"
                  ? "bg-indigo-600 text-white font-medium shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Done ({completedTasks})
            </button>
          </div>

          <button
            onClick={() => {
              if (confirm(`Delete section "${section.title}"?`)) {
                onDeleteSection(section.id);
              }
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
            title="Delete this section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress line */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 shrink-0 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            progressPercent === 100 ? "bg-emerald-500" : "bg-indigo-500"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Dual Column Workspace (Tasks & Notes Side-by-Side) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
        {/* Left Column: Tasks Pipeline (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden p-3.5 space-y-3">
          {/* Quick Add Task Input */}
          <form onSubmit={handleAddTaskSubmit} className="shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder={`+ Add item to ${section.title}... (e.g. 'Deploy branch #ci')`}
                  className="w-full pl-3 pr-20 py-2 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-slate-800"
                />
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as Priority)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 cursor-pointer focus:outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent 🔥</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition flex items-center gap-1 shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </form>

          {/* Scrollable Tasks Container */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500 font-mono text-xs">
                <p>
                  {searchQuery
                    ? "No tasks match your search filter."
                    : taskFilter !== "all"
                    ? `No ${taskFilter} tasks in this stream.`
                    : "No tasks in this stream yet. Add one above!"}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group rounded-lg border p-3 transition-all ${
                    task.completed
                      ? "bg-slate-50/50 border-slate-200 dark:bg-slate-950/40 dark:border-slate-800/60 opacity-65"
                      : task.priority === "urgent"
                      ? "bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/60 shadow-sm"
                      : task.priority === "high"
                      ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50"
                      : "bg-slate-50/70 border-slate-200 hover:border-slate-300 dark:bg-slate-850/60 dark:border-slate-800 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      onClick={() => onToggleTask(section.id, task.id)}
                      className="flex items-start gap-2.5 flex-1 cursor-pointer select-none"
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 transition"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs font-mono leading-relaxed break-words block ${
                            task.completed
                              ? "line-through text-slate-400 dark:text-slate-500"
                              : task.priority === "urgent"
                              ? "text-rose-900 dark:text-rose-200 font-semibold"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {task.title}
                        </span>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {task.completed && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/60 font-mono">
                              (done)
                            </span>
                          )}
                          {task.priority === "urgent" && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800/60 font-mono font-semibold">
                              URGENT 🔥
                            </span>
                          )}
                          {task.priority === "high" && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800/60 font-mono">
                              HIGH
                            </span>
                          )}
                          {task.tags &&
                            task.tags.map((tg) => (
                              <span
                                key={tg}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 dark:border-transparent dark:bg-slate-800 dark:text-slate-400 font-mono"
                              >
                                #{tg}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                      <button
                        onClick={() =>
                          setAddingSubtaskId(
                            addingSubtaskId === task.id ? null : task.id
                          )
                        }
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded transition"
                        title="Add subtask / detail"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(section.id, task.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 rounded transition"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtasks */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-2.5 ml-6 space-y-1.5 pl-2.5 border-l-2 border-slate-200 dark:border-slate-700/60">
                      {task.subtasks.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() =>
                            onToggleSubTask(section.id, task.id, sub.id)
                          }
                          className="flex items-start gap-2 cursor-pointer group/sub select-none"
                        >
                          <button type="button" className="mt-0.5 shrink-0">
                            {sub.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" />
                            )}
                          </button>
                          <span
                            className={`text-xs font-mono leading-tight break-words ${
                              sub.completed
                                ? "line-through text-slate-400 dark:text-slate-500"
                                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                          >
                            {sub.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Subtask Form */}
                  {addingSubtaskId === task.id && (
                    <div className="mt-2.5 ml-6 flex items-center gap-1.5">
                      <input
                        type="text"
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newSubtask.trim()) {
                            e.preventDefault();
                            const stList = task.subtasks
                              ? task.subtasks.map((s) => s.title)
                              : [];
                            stList.push(newSubtask.trim());
                            onDeleteTask(section.id, task.id);
                            onAddTask(
                              section.id,
                              task.title,
                              task.priority || "normal",
                              task.tags || [],
                              stList
                            );
                            setNewSubtask("");
                            setAddingSubtaskId(null);
                          }
                        }}
                        placeholder="Add subtask / pipeline detail..."
                        className="flex-1 px-2.5 py-1 text-xs font-mono rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          if (newSubtask.trim()) {
                            const stList = task.subtasks
                              ? task.subtasks.map((s) => s.title)
                              : [];
                            stList.push(newSubtask.trim());
                            onDeleteTask(section.id, task.id);
                            onAddTask(
                              section.id,
                              task.title,
                              task.priority || "normal",
                              task.tags || [],
                              stList
                            );
                            setNewSubtask("");
                            setAddingSubtaskId(null);
                          }
                        }}
                        className="px-2 py-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white rounded font-mono shadow-sm"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setAddingSubtaskId(null)}
                        className="px-1.5 py-1 text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Live Context & Notes / Pipeline Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full overflow-hidden bg-slate-50/50 dark:bg-slate-950/40 p-3.5 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span className="text-xs font-mono font-semibold uppercase text-slate-700 dark:text-slate-300">
                Stream Scratchpad & Notes
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyNotes}
                disabled={!notesContent}
                className="p-1 px-2 text-[11px] font-mono rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 shadow-sm"
                title="Copy notes"
              >
                {isCopiedNotes ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
            {"// Context, branch names, pipeline parameters, YAML snippets & URLs:"}
          </p>

          <div className="flex-1 overflow-hidden relative">
            <textarea
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Keep relevant links, commands, branch names, or deployment notes for this stream here. Auto-saved."
              className="w-full h-full p-3 text-xs font-mono rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
            <span>{notesContent ? `${notesContent.length} chars` : "Empty memo"}</span>
            <span>Auto-saves on edit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
