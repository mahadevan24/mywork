"use client";

import React, { useState } from "react";
import { Priority, SectionTopic, TaskItem } from "@/types/notes";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  CornerDownRight,
  Sparkles,
  FileCode,
  Tag,
  Clock,
} from "lucide-react";

interface ProjectCardProps {
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

export const ProjectCard: React.FC<ProjectCardProps> = ({
  section,
  onToggleTask,
  onToggleSubTask,
  onAddTask,
  onDeleteTask,
  onDeleteSection,
  onUpdateNotes,
  searchQuery = "",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotes, setShowNotes] = useState(Boolean(section.notes));
  const [notesContent, setNotesContent] = useState(section.notes || "");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("normal");
  const [newSubtask, setNewSubtask] = useState("");
  const [addingSubtaskId, setAddingSubtaskId] = useState<string | null>(null);

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

    onAddTask(section.id, newTaskTitle.trim(), newPriority, tags, []);
    setNewTaskTitle("");
    setNewPriority("normal");
  };

  const handleNotesBlur = () => {
    if (notesContent !== section.notes) {
      onUpdateNotes(section.id, notesContent);
    }
  };

  const filteredTasks = section.tasks.filter((t) => {
    if (!searchQuery) return true;
    const match =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.subtasks?.some((st) =>
        st.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return match;
  });

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 shadow-md overflow-hidden flex flex-col transition hover:border-slate-700/80">
      {/* Card Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-850/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {/* Color Accent Indicator */}
            <div
              className="w-2.5 h-7 rounded-full shrink-0"
              style={{ backgroundColor: section.color || "#6366f1" }}
            />
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-100 truncate font-mono tracking-tight">
                {section.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                <span>
                  {completedTasks}/{totalTasks} completed
                </span>
                <span>•</span>
                <span
                  className={
                    progressPercent === 100
                      ? "text-emerald-400 font-medium"
                      : "text-indigo-400"
                  }
                >
                  {progressPercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-1.5 rounded-md text-xs font-mono transition flex items-center gap-1 ${
                showNotes
                  ? "bg-indigo-950/80 text-indigo-300 border border-indigo-800/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
              title="Toggle project notes / scratchpad"
            >
              <FileCode className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition"
              title={isCollapsed ? "Expand section" : "Collapse section"}
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => {
                if (confirm(`Delete section "${section.title}"?`)) {
                  onDeleteSection(section.id);
                }
              }}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-md transition"
              title="Delete Section"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              progressPercent === 100 ? "bg-emerald-500" : "bg-indigo-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Optional Freeform Section Notes */}
      {showNotes && (
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono text-slate-400">
              {"// Section memo / pipeline notes"}
            </span>
          </div>
          <textarea
            value={notesContent}
            onChange={(e) => setNotesContent(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Add context, URLs, branch notes, or pipeline details here..."
            className="w-full h-16 p-2 text-xs font-mono rounded bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 resize-y"
          />
        </div>
      )}

      {/* Task List Body */}
      {!isCollapsed && (
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          {/* Tasks Container */}
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 font-mono italic">
                {searchQuery
                  ? "No tasks match your search."
                  : "No items yet. Add one below!"}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group rounded-lg border p-2.5 transition-all ${
                    task.completed
                      ? "bg-slate-950/40 border-slate-800/60 opacity-65"
                      : task.priority === "urgent"
                      ? "bg-rose-950/20 border-rose-900/60"
                      : task.priority === "high"
                      ? "bg-amber-950/20 border-amber-900/50"
                      : "bg-slate-800/40 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      onClick={() => onToggleTask(section.id, task.id)}
                      className="flex items-start gap-2 flex-1 cursor-pointer select-none"
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-slate-400 hover:text-indigo-400 shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs font-mono leading-relaxed break-words block ${
                            task.completed
                              ? "line-through text-slate-500"
                              : task.priority === "urgent"
                              ? "text-rose-200 font-medium"
                              : "text-slate-200"
                          }`}
                        >
                          {task.title}
                        </span>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {task.completed && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                              (done)
                            </span>
                          )}
                          {task.priority === "urgent" && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800/60 font-mono font-semibold">
                              URGENT 🔥
                            </span>
                          )}
                          {task.priority === "high" && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800/60 font-mono">
                              HIGH
                            </span>
                          )}
                          {task.tags &&
                            task.tags.map((tg) => (
                              <span
                                key={tg}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono"
                              >
                                #{tg}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() =>
                          setAddingSubtaskId(
                            addingSubtaskId === task.id ? null : task.id
                          )
                        }
                        className="p-1 text-slate-400 hover:text-indigo-400 rounded transition"
                        title="Add subtask / detail"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(section.id, task.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtasks (e.g. pipeline details, commands) */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-2.5 ml-6 space-y-1.5 pl-2 border-l-2 border-slate-700/60">
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
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Circle className="w-3 h-3 text-slate-500 hover:text-slate-300" />
                            )}
                          </button>
                          <span
                            className={`text-[11px] font-mono leading-tight break-words ${
                              sub.completed
                                ? "line-through text-slate-500"
                                : "text-slate-300 hover:text-slate-100"
                            }`}
                          >
                            {sub.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Subtask Inline Form */}
                  {addingSubtaskId === task.id && (
                    <div className="mt-2 ml-6 flex items-center gap-1">
                      <input
                        type="text"
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newSubtask.trim()) {
                            e.preventDefault();
                            onToggleSubTask(section.id, task.id, ""); // custom add
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
                        placeholder="Add subtask (e.g., 'check params for branch')..."
                        className="flex-1 px-2 py-1 text-[11px] font-mono rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
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
                        className="px-2 py-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white rounded font-mono"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setAddingSubtaskId(null)}
                        className="px-1.5 py-1 text-[10px] text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Quick Add Task Input in this section */}
          <form onSubmit={handleAddTaskSubmit} className="pt-2">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder={`+ Add item to ${section.title}...`}
                  className="w-full pl-3 pr-20 py-1.5 text-xs font-mono rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as Priority)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] bg-slate-900 text-slate-400 border border-slate-700 rounded px-1 py-0.5 cursor-pointer"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition shrink-0"
                title="Add task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
