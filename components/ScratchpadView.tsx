"use client";

import React, { useState, useEffect } from "react";
import { WorkpadState } from "@/types/notes";
import {
  parseNotepadToWorkpad,
  serializeWorkpadToNotepad,
} from "@/lib/notepadParser";
import {
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Download,
} from "lucide-react";

interface ScratchpadViewProps {
  state: WorkpadState;
  onApplyState: (newState: WorkpadState) => void;
  onSwitchToBoard: () => void;
  className?: string;
}

export const ScratchpadView: React.FC<ScratchpadViewProps> = ({
  state,
  onApplyState,
  onSwitchToBoard,
  className = "",
}) => {
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Sync content when state changes or on mount
  useEffect(() => {
    setContent(serializeWorkpadToNotepad(state));
    setIsDirty(false);
  }, [state]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToBoard = () => {
    const parsed = parseNotepadToWorkpad(content);
    onApplyState(parsed);
    setIsDirty(false);
    onSwitchToBoard();
  };

  const handleResetToBoard = () => {
    setContent(serializeWorkpadToNotepad(state));
    setIsDirty(false);
  };

  const lines = content.split("\n");

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden flex flex-col h-full ${className}`}>
      {/* Scratchpad Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
              Notepad Scratchpad Mode
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            {lines.length} lines • {content.length} characters
          </span>
          {isDirty && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              Unsaved edits in scratchpad
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded transition flex items-center gap-1 font-mono"
            title="Formatting syntax guide"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden md:inline">Syntax Guide</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 text-xs font-mono rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 shadow-sm"
            title="Copy plain text to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          {isDirty && (
            <button
              onClick={handleResetToBoard}
              className="px-2.5 py-1.5 text-xs font-mono rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 transition shadow-sm"
              title="Discard changes and pull from board"
            >
              Reset
            </button>
          )}

          <button
            onClick={handleApplyToBoard}
            className="px-3 py-1.5 text-xs font-mono font-medium rounded bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 shadow"
            title="Parse text and update all cards"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply to Board</span>
          </button>
        </div>
      </div>

      {/* Optional Syntax Help Drawer */}
      {showHelp && (
        <div className="p-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Sections / Headers</p>
            <code>Project Title</code>
            <br />
            <code>----------------</code>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Underline any title with dashes or equals.
            </p>
          </div>
          <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-1">Tasks & Subtasks</p>
            <code>- task title (done)</code>
            <br />
            <code>&nbsp;&nbsp;&nbsp;* subtask detail</code>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Add (done) to complete. Indent with * for subtask.
            </p>
          </div>
          <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-rose-600 dark:text-rose-400 font-semibold mb-1">Urgent & Milestones</p>
            <code>## Milestone / Urgent</code>
            <br />
            <code>Merge changes ###########</code>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Use ## or multiple hashes to flag urgent tasks.
            </p>
          </div>
        </div>
      )}

      {/* Editor with Line Numbers */}
      <div className="flex-1 flex overflow-hidden bg-white dark:bg-slate-950">
        {/* Line Numbers column */}
        <div className="w-12 bg-slate-50 dark:bg-slate-900/60 py-4 px-2 select-none border-r border-slate-200 dark:border-slate-800/80 text-right font-mono text-xs text-slate-400 dark:text-slate-600 overflow-hidden">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <div className="flex-1 relative overflow-hidden">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Type or paste your notes here..."
            className="w-full h-full p-4 font-mono text-xs sm:text-sm leading-6 bg-transparent text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-700 resize-none focus:outline-none selection:bg-indigo-500/20 dark:selection:bg-indigo-900/80 selection:text-slate-900 dark:selection:text-white"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
