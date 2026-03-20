"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Send, ThumbsUp, Clock, Tag, Loader2, Building2, MapPin, Bot, Zap, Filter } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  agency: string;
  status: string;
  upvotes: number;
  is_anonymous: boolean;
  created_at: string;
};

const categories = [
  { value: "infrastructure", label: "🏗️ Infrastructure" },
  { value: "corruption", label: "💰 Corruption" },
  { value: "public_service", label: "🏢 Public Service" },
  { value: "environment", label: "🌿 Environment" },
  { value: "health", label: "🏥 Health" },
  { value: "education", label: "📚 Education" },
  { value: "other", label: "❓ Other" },
];

const statusColors: Record<string, string> = {
  pending: "badge-pending",
  under_review: "badge-medium",
  resolved: "badge-resolved",
  dismissed: "badge-high",
};

export default function GovernancePage() {
  const container = useRef<HTMLDivElement>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({ title: "", description: "", category: "infrastructure", location: "", agency: "", is_anonymous: false });

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterCat === "all" ? "/api/governance" : `/api/governance?category=${filterCat}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setComplaints(data.complaints || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [filterCat]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

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
    if (!form.title.trim() || !form.description.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/governance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Complaint submitted! Salamat sa iyong pakikilahok. 🙏");
        setForm({ title: "", description: "", category: "infrastructure", location: "", agency: "", is_anonymous: false });
        fetchComplaints();
        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  const getDraftFromAI = async () => {
    if (!form.title) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/governance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ai_draft: true, title: form.title, category: form.category }) });
      const data = await res.json();
      if (data.ai_draft) { setAiDraft(data.ai_draft); setForm(f => ({ ...f, description: data.ai_draft })); }
    } catch { /* silent */ }
    finally { setAiLoading(false); }
  };

  const upvote = async (id: string) => {
    await fetch("/api/governance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ upvote: true, complaint_id: id }) });
    fetchComplaints();
  };

  return (
    <div className="min-h-screen" ref={container}>
      {/* Hero */}
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(244,63,94,0.15) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-4">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/25 text-rose-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Transparency & Good Governance · SDG 16
          </div>
          <h1 className="hero-title text-4xl md:text-5xl font-display font-bold text-white">
            Citizen <span style={{ color: "#f43f5e" }}>Governance</span> Watch
          </h1>
          <p className="hero-desc text-white/50 max-w-xl mx-auto">Submit complaints, track government issues, and hold institutions accountable together.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20 module-content">
        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-1 space-y-4 module-anim">
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-display font-bold text-white flex items-center gap-2">
                <Send className="h-5 w-5 text-rose-400" /> File a Complaint
              </h2>

              {successMsg && (
                <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">{successMsg}</div>
              )}

              <form onSubmit={submit} className="space-y-3">
                <input className="glass-input" placeholder="Title / Issue (e.g., Potholed road on…)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                <select className="glass-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <input className="glass-input" placeholder="Location (optional)" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                <input className="glass-input" placeholder="Concerned Agency (optional)" value={form.agency} onChange={e => setForm(f => ({ ...f, agency: e.target.value }))} />

                <div className="flex items-center gap-2">
                  <button type="button" onClick={getDraftFromAI} disabled={aiLoading || !form.title.trim()} className="flex items-center gap-2 text-xs text-rose-300 hover:text-rose-200 bg-rose-500/05 hover:bg-rose-500/10 border border-rose-500/15 px-3 py-2 rounded-lg transition-all">
                    {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bot className="h-3.5 w-3.5" />} AI Draft
                  </button>
                  <span className="text-xs text-white/30">Let AI draft your complaint</span>
                </div>

                <textarea className="glass-input resize-none" rows={4} placeholder="Describe the issue clearly and in detail…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.is_anonymous} onChange={e => setForm(f => ({ ...f, is_anonymous: e.target.checked }))} className="accent-rose-500 w-4 h-4 rounded" />
                  <span className="text-sm text-white/60">Submit anonymously</span>
                </label>

                <button type="submit" disabled={submitting || !form.title.trim() || !form.description.trim()} className="btn-primary w-full" style={{ background: "linear-gradient(135deg,#f43f5e,#e11d48)" }}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" />Submit Complaint</>}
                </button>
              </form>
            </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-2 space-y-4 module-anim">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-display font-bold text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-rose-400" /> Public Issues Board
              </h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-white/30" />
                <select className="glass-select text-xs py-1.5 px-3 rounded-lg" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="glass-card p-4 h-28 shimmer" />)}</div>
            ) : complaints.length === 0 ? (
              <div className="glass-card p-10 text-center text-white/30">
                <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No complaints yet in this category.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {complaints.map(c => (
                  <div key={c.id} className="feed-item">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className={`${statusColors[c.status] || "badge-pending"} text-[11px] px-2 py-0.5 rounded-full font-medium capitalize`}>{c.status.replace("_"," ")}</span>
                          <span className="text-xs text-white/30 flex items-center gap-1"><Tag className="h-3 w-3" />{categories.find(x=>x.value===c.category)?.label || c.category}</span>
                        </div>
                        <h3 className="font-semibold text-white/90 text-sm">{c.title}</h3>
                        <p className="text-xs text-white/45 mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
                          {c.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.location}</span>}
                          {c.agency && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{c.agency}</span>}
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(c.created_at).toLocaleDateString("en-PH")}</span>
                        </div>
                      </div>
                      <button onClick={() => upvote(c.id)} className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-white/05 hover:bg-rose-500/10 hover:text-rose-400 text-white/40 transition-all text-xs font-medium shrink-0">
                        <ThumbsUp className="h-3.5 w-3.5" />{c.upvotes}
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
