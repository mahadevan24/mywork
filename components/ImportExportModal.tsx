"use client";

import React, { useState } from "react";
import { WorkpadState } from "@/types/notes";
import {
  parseNotepadToWorkpad,
  serializeWorkpadToNotepad,
} from "@/lib/notepadParser";
import { INITIAL_DATA } from "@/lib/initialData";
import {
  Download,
  Upload,
  Copy,
  Check,
  RotateCcw,
  X,
  FileText,
} from "lucide-react";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: WorkpadState;
  onApplyState: (newState: WorkpadState) => void;
  onResetDemo: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  state,
  onApplyState,
  onResetDemo,
}) => {
  const [activeTab, setActiveTab] = useState<"export" | "import">("export");
  const [importText, setImportText] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportText = serializeWorkpadToNotepad(state);

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devnotes_backup_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const parsed = parseNotepadToWorkpad(importText);
    onApplyState(parsed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                Notepad Import & Export
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Move notes freely between DevNotes and your desktop Notepad
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 px-5 pt-3">
          <button
            onClick={() => setActiveTab("export")}
            className={`pb-3 px-3 text-xs font-mono font-medium border-b-2 transition ${
              activeTab === "export"
                ? "border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Export to Text
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`pb-3 px-3 text-xs font-mono font-medium border-b-2 transition ${
              activeTab === "import"
                ? "border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Import from Notepad
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {activeTab === "export" ? (
            <div className="space-y-3">
              <textarea
                readOnly
                value={exportText}
                className="w-full h-64 p-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-300 resize-none focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm("Reset notes back to the screenshot defaults?")) {
                      onResetDemo();
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                  title="Reset to initial screenshot notes"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Initial Notes</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadFile}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .txt</span>
                  </button>
                  <button
                    onClick={handleCopyExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy to Clipboard</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Paste your existing notepad content below. It will automatically parse section headers (underlined with dashes), tasks (`- item`), sub-bullets (`* detail`), and `(done)` markers:
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste your notepad text here..."
                className="w-full h-64 p-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-700 resize-none focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportSubmit}
                  disabled={!importText.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg transition shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Parse & Import</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
