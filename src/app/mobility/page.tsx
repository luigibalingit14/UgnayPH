"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Car, MapPin, AlertTriangle, Clock, ThumbsUp, Loader2, Send, ChevronDown, Bot, Zap } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

type Report = {
  id: string;
  location: string;
  city: string;
  incident_type: string;
  severity: "low" | "medium" | "high";
  description: string;
  upvotes: number;
  created_at: string;
};

const incidentTypes = [
  { value: "traffic_jam", label: "🚦 Traffic Jam" },
  { value: "accident", label: "💥 Accident" },
  { value: "road_closure", label: "🚧 Road Closure" },
  { value: "flooding", label: "🌊 Flooding" },
  { value: "construction", label: "🏗️ Construction" },
  { value: "other", label: "❓ Other" },
];

const cities = ["Manila", "Quezon City", "Makati", "Pasig", "Taguig", "Batangas City", "Lipa City", "Cebu City", "Davao City", "Iloilo City", "Cagayan de Oro", "Zamboanga City", "Other"];

export default function MobilityPage() {
  const container = useRef<HTMLDivElement>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [form, setForm] = useState({ location: "", city: "Manila", incident_type: "traffic_jam", severity: "medium" as "low"|"medium"|"high", description: "" });
  const [successMsg, setSuccessMsg] = useState("");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mobility");
      const data = await res.json();
      if (data.success) setReports(data.reports || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  useGSAP(() => {
    if (!container.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero-badge", { y: -30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.2);
    tl.fromTo(".hero-title", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.4);
    tl.fromTo(".hero-desc", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.6);

    gsap.fromTo(".module-anim",
      { y: 40, autoAlpha: 0 },
      { scrollTrigger: { trigger: ".module-content", start: "top 85%" }, y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }, { scope: container });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/mobility", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Report submitted! Salamat sa pag-ulat. 🙏");
        setForm({ location: "", city: "Manila", incident_type: "traffic_jam", severity: "medium", description: "" });
        fetchReports();
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  const getAiAdvice = async () => {
    setAiLoading(true);
    setAiSuggestion("");
    try {
      const res = await fetch("/api/mobility", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ai_advice: true, city: form.city, incident_type: form.incident_type }) });
      const data = await res.json();
      if (data.ai_suggestion) setAiSuggestion(data.ai_suggestion);
    } catch { /* silent */ }
    finally { setAiLoading(false); }
  };

  const upvote = async (id: string) => {
    await fetch("/api/mobility", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ upvote: true, report_id: id }) });
    fetchReports();
  };

  const severityBadge = (s: string) => {
    if (s === "low") return <span className="badge-low text-xs px-2 py-0.5 rounded-full font-medium">● Low</span>;
    if (s === "medium") return <span className="badge-medium text-xs px-2 py-0.5 rounded-full font-medium">● Medium</span>;
    return <span className="badge-high text-xs px-2 py-0.5 rounded-full font-medium">● High</span>;
  };

  return (
    <div className="min-h-screen" ref={container}>
      {/* Hero */}
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(251,191,36,0.15) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-4">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-300">
            <Car className="h-3.5 w-3.5" /> Smart Mobility & Transportation · SDG 9 & 11
          </div>
          <h1 className="hero-title text-4xl md:text-5xl font-display font-bold text-white">
            Real-time <span style={{ color: "#fbbf24" }}>Traffic Alerts</span>
          </h1>
          <p className="hero-desc text-white/50 max-w-xl mx-auto">Report incidents, get AI route suggestions, and help fellow commuters navigate smarter.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20 module-content">
        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-1 space-y-4 module-anim">
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-display font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" /> Report an Incident
              </h2>

              {successMsg && (
                <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  {successMsg}
                </div>
              )}

              <form onSubmit={submit} className="space-y-3">
                <input className="glass-input" placeholder="Location (e.g., EDSA near SM North)" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />

                <div className="relative">
                  <select className="glass-select" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="relative">
                  <select className="glass-select" value={form.incident_type} onChange={e => setForm(f => ({ ...f, incident_type: e.target.value }))}>
                    {incidentTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(["low","medium","high"] as const).map(s => (
                    <button type="button" key={s} onClick={() => setForm(f => ({ ...f, severity: s }))}
                      className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all ${form.severity === s ? (s==="low"?"bg-emerald-500/20 border border-emerald-500/40 text-emerald-300":s==="medium"?"bg-amber-500/20 border border-amber-500/40 text-amber-300":"bg-red-500/20 border border-red-500/40 text-red-300") : "bg-white/05 border border-white/08 text-white/40 hover:bg-white/08"}`}>
                      {s}
                    </button>
                  ))}
                </div>

                <textarea className="glass-input resize-none" rows={3} placeholder="Describe the situation (optional)…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

                <button type="submit" disabled={submitting||!form.location.trim()} className="btn-primary w-full" style={{ background: "linear-gradient(135deg,#d97706,#b45309)" }}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" />Submit Report</>}
                </button>
              </form>
            </div>

            {/* AI Route Advisor */}
            <div className="glass-card p-5 space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Bot className="h-4 w-4 text-amber-400" /> AI Route Advisor
              </h3>
              <p className="text-xs text-white/40">Get AI-powered alternate route tips for current traffic.</p>
              <button onClick={getAiAdvice} disabled={aiLoading} className="btn-secondary w-full text-sm">
                {aiLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Thinking...</> : <><Zap className="h-4 w-4 text-amber-400" />Get Route Tips</>}
              </button>
              {aiSuggestion && (
                <div className="text-sm text-white/70 bg-amber-500/05 border border-amber-500/15 rounded-xl p-4 leading-relaxed whitespace-pre-line">
                  {aiSuggestion}
                </div>
              )}
            </div>
          </div>

          {/* Live Feed */}
          <div className="lg:col-span-2 space-y-4 module-anim">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-amber-400" /> Live Traffic Feed
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h2>
              <button onClick={fetchReports} className="text-xs text-white/40 hover:text-white transition-colors">Refresh</button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_,i) => <div key={i} className="glass-card p-4 h-24 shimmer" />)}
              </div>
            ) : reports.length === 0 ? (
              <div className="glass-card p-10 text-center text-white/30">
                <Car className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No reports yet. Be the first to report!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map(r => (
                  <div key={r.id} className="feed-item">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {severityBadge(r.severity)}
                          <span className="text-xs text-white/30">{incidentTypes.find(t=>t.value===r.incident_type)?.label || r.incident_type}</span>
                        </div>
                        <p className="font-semibold text-white/90 text-sm">{r.location}</p>
                        <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" />{r.city}
                          <span>·</span>
                          <Clock className="h-3 w-3" />{new Date(r.created_at).toLocaleTimeString("en-PH", {hour:"2-digit",minute:"2-digit"})}
                        </p>
                        {r.description && <p className="text-xs text-white/50 mt-2 line-clamp-2">{r.description}</p>}
                      </div>
                      <button onClick={() => upvote(r.id)} className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-white/05 hover:bg-amber-500/10 hover:text-amber-400 text-white/40 transition-all text-xs font-medium shrink-0">
                        <ThumbsUp className="h-3.5 w-3.5" />{r.upvotes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
