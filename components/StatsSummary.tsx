"use client";

import React from "react";
import { WorkpadState } from "@/types/notes";
import { CheckCircle, Clock, AlertTriangle, Layers, Flame } from "lucide-react";

interface StatsSummaryProps {
  state: WorkpadState;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ state }) => {
  // Aggregate stats
  const allQuickTasks = state.quickTodos || [];
  const allSectionTasks = state.sections.flatMap((s) => s.tasks) || [];
  const allTasks = [...allQuickTasks, ...allSectionTasks];

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const urgentTasks = allTasks.filter((t) => !t.completed && (t.priority === "urgent" || t.priority === "high")).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {/* Total Sections / Topics */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-mono uppercase text-slate-400">Work Streams</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-white">
              {state.sections.length}
            </span>
            <span className="text-xs text-slate-500 font-mono">topics</span>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-mono uppercase text-slate-400">Completed</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-emerald-400">
              {completedTasks}/{totalTasks}
            </span>
            <span className="text-xs text-slate-500 font-mono">({progressPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Urgent / Priority items */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-mono uppercase text-slate-400">High Priority</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-rose-400">
              {urgentTasks}
            </span>
            <span className="text-xs text-slate-500 font-mono">pending</span>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-center">
        <div className="flex justify-between items-center text-[11px] font-mono uppercase text-slate-400 mb-1">
          <span>Sprint Pace</span>
          <span className="text-indigo-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
