"use client";

import { useState } from "react";
import { Zap, Loader2, CheckCircle2 } from "lucide-react";

export function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      setMsg(data.message || "Sync error.");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 6000);
    } catch (e) {
      setMsg("Failed to connect API.");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 6000);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <button 
        onClick={handleSync} 
        disabled={loading}
        className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-ph-blue/10 border border-ph-blue/30 text-blue-300 hover:bg-ph-blue/20 transition-all font-medium text-sm drop-shadow-md"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-ph-blue" />
        ) : (
          <Zap className="h-4 w-4 text-ph-yellow group-hover:scale-110 transition-transform" />
        )}
        {loading ? "AI is reading the news..." : "Trigger AI Autonomous Live Sync"}
      </button>
      {success && (
        <div className="mt-3 text-xs flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4" />
          {msg}
        </div>
      )}
    </div>
  );
}
