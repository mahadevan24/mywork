"use client";

import React, { useState } from "react";
import { FirebaseSettings } from "@/types/notes";
import {
  Cloud,
  X,
  CheckCircle,
  AlertTriangle,
  Lock,
  ExternalLink,
  Trash2,
} from "lucide-react";

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  currentSettings: FirebaseSettings | null;
  onSave: (settings: FirebaseSettings) => Promise<boolean>;
  onDisconnect: () => void;
  syncError: string | null;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  currentSettings,
  onSave,
  onDisconnect,
  syncError,
}) => {
  const [apiKey, setApiKey] = useState(currentSettings?.apiKey || "");
  const [authDomain, setAuthDomain] = useState(
    currentSettings?.authDomain || ""
  );
  const [projectId, setProjectId] = useState(currentSettings?.projectId || "");
  const [storageBucket, setStorageBucket] = useState(
    currentSettings?.storageBucket || ""
  );
  const [messagingSenderId, setMessagingSenderId] = useState(
    currentSettings?.messagingSenderId || ""
  );
  const [appId, setAppId] = useState(currentSettings?.appId || "");
  const [measurementId, setMeasurementId] = useState(
    currentSettings?.measurementId || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      setStatusMessage("API Key and Project ID are required.");
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    const success = await onSave({
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
      measurementId: measurementId.trim(),
    });

    setIsSaving(false);
    if (success) {
      setStatusMessage("Connected successfully!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setStatusMessage("Failed to connect. Please check credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">
                Firebase Cloud Sync Settings
              </h3>
              <p className="text-xs text-slate-400">
                Sync work notes in real time across any browser or phone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status alert */}
        <div className="p-5 space-y-4">
          <div
            className={`p-3 rounded-lg border text-xs font-mono flex items-start gap-2.5 ${
              isConnected
                ? "bg-emerald-950/30 border-emerald-800/60 text-emerald-300"
                : "bg-amber-950/30 border-amber-800/60 text-amber-300"
            }`}
          >
            {isConnected ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">
                {isConnected
                  ? `Active Cloud Sync (${projectId || "Connected"})`
                  : "Currently in Local Offline Mode"}
              </p>
              <p className="text-slate-400 mt-0.5 text-[11px]">
                {isConnected
                  ? "All updates persist immediately to your Firebase Firestore document and local cache."
                  : "Notes are currently stored securely in your browser's LocalStorage. Enter your Firebase web credentials below to enable cloud backup & live sync."}
              </p>
            </div>
          </div>

          {syncError && (
            <div className="p-2.5 bg-rose-950/40 border border-rose-900/80 rounded-lg text-xs font-mono text-rose-300">
              Sync Error: {syncError}
            </div>
          )}

          {statusMessage && (
            <div className="p-2.5 bg-indigo-950/40 border border-indigo-900/80 rounded-lg text-xs font-mono text-indigo-300">
              {statusMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Firebase Project ID *
              </label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="my-work-notes-app"
                required
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                API Key (Web API Key) *
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                required
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Auth Domain
                </label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="project.firebaseapp.com"
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  App ID
                </label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="1:123456:web:abcd"
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Measurement ID (Optional)
              </label>
              <input
                type="text"
                value={measurementId}
                onChange={(e) => setMeasurementId(e.target.value)}
                placeholder="G-XXXXXXX"
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {isConnected ? (
                <button
                  type="button"
                  onClick={() => {
                    onDisconnect();
                    setApiKey("");
                    setProjectId("");
                    setAuthDomain("");
                    setAppId("");
                    setMeasurementId("");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg border border-rose-900/50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono">
                  Configured via <code>.env</code>
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 text-xs font-mono font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
                >
                  {isSaving ? "Connecting..." : "Save & Sync"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
