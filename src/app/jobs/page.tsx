"use client";

import { useState, useEffect, useCallback } from "react";
import { Briefcase, MapPin, Send, Loader2, Bot, Filter, Clock, Building2, DollarSign, Zap, Search } from "lucide-react";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements?: string;
  skills?: string[];
  region: string;
  contact_email?: string;
  created_at: string;
};

const jobTypes = [
  { value: "full_time", label: "⏰ Full Time" },
  { value: "part_time", label: "🕐 Part Time" },
  { value: "freelance", label: "💻 Freelance" },
  { value: "internship", label: "🎓 Internship" },
  { value: "apprenticeship", label: "🔨 Apprenticeship" },
];

const regions = ["NCR","CAR","Region I","Region II","Region III","Region IV-A","Region IV-B","Region V","Region VI","Region VII","Region VIII","Region IX","Region X","Region XI","Region XII","CARAGA","BARMM"];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"browse"|"post"|"ai">("browse");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [skills, setSkills] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({ title: "", company: "", location: "", job_type: "full_time", salary_min: "", salary_max: "", description: "", requirements: "", skills: "", region: "NCR", contact_email: "" });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterRegion !== "all") params.set("region", filterRegion);
      if (filterType !== "all") params.set("job_type", filterType);
      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      if (data.success) setJobs(data.jobs || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [filterRegion, filterType]);

  useEffect(() => { if (activeTab === "browse") fetchJobs(); }, [fetchJobs, activeTab]);

  const postJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, salary_min: form.salary_min ? Number(form.salary_min) : null, salary_max: form.salary_max ? Number(form.salary_max) : null, skills: form.skills.split(",").map(s => s.trim()).filter(Boolean) };
      const res = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Job posted successfully! 🎉");
        setForm({ title: "", company: "", location: "", job_type: "full_time", salary_min: "", salary_max: "", description: "", requirements: "", skills: "", region: "NCR", contact_email: "" });
        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  const matchSkills = async () => {
    if (!skills.trim()) return;
    setAiLoading(true);
    setAiResult("");
    try {
      const res = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ai_match: true, skills }) });
      const data = await res.json();
      if (data.ai_result) setAiResult(data.ai_result);
    } catch { /* silent */ }
    finally { setAiLoading(false); }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    const fmt = (n: number) => `₱${n.toLocaleString()}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.15) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
            <Briefcase className="h-3.5 w-3.5" /> Employment & Economic Opportunities · SDG 8
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            Find Your <span style={{ color: "#10b981" }}>Opportunity</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">Browse job listings, post vacancies, and let AI match your skills to your dream role.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white/03 border border-white/06 p-1 rounded-xl w-fit">
            {[{key:"browse",label:"Browse Jobs",icon:Search},{key:"post",label:"Post a Job",icon:Send},{key:"ai",label:"AI Skill Match",icon:Bot}].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key as "browse"|"post"|"ai")} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab===t.key ? "bg-white/08 text-white shadow" : "text-white/40 hover:text-white/70"}`}>
                <t.icon className="h-4 w-4" />{t.label}
              </button>
            ))}
          </div>

          {/* Browse */}
          {activeTab === "browse" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Filter className="h-4 w-4 text-white/30" />
                <select className="glass-select text-xs py-1.5 px-3 rounded-lg" value={filterRegion} onChange={e => setFilterRegion(e.target.value)}>
                  <option value="all">All Regions</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select className="glass-select text-xs py-1.5 px-3 rounded-lg" value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="all">All Types</option>
                  {jobTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {loading ? (
                <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="glass-card p-5 h-28 shimmer" />)}</div>
              ) : jobs.length === 0 ? (
                <div className="glass-card p-12 text-center text-white/30">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No jobs found. Be the first to post!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {jobs.map(j => (
                    <div key={j.id} className="glass-card p-5 space-y-3 hover:border-emerald-500/20 transition-all duration-200 cursor-pointer group">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-white/95 group-hover:text-emerald-300 transition-colors">{j.title}</h3>
                          <p className="text-sm text-white/50 flex items-center gap-1.5 mt-0.5">
                            <Building2 className="h-3.5 w-3.5" />{j.company}
                          </p>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                          {jobTypes.find(t=>t.value===j.job_type)?.label.split(" ").slice(1).join(" ") || j.job_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{j.location}</span>
                        <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{j.region}</span>
                        {formatSalary(j.salary_min, j.salary_max) && (
                          <span className="flex items-center gap-1 text-emerald-400"><DollarSign className="h-3 w-3" />{formatSalary(j.salary_min, j.salary_max)}</span>
                        )}
                      </div>
                      <p className="text-xs text-white/45 line-clamp-2 leading-relaxed">{j.description}</p>
                      {j.skills && j.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {j.skills.slice(0,4).map(s => <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-white/05 border border-white/08 text-white/50">{s}</span>)}
                        </div>
                      )}
                      {j.contact_email && (
                        <a href={`mailto:${j.contact_email}`} className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors mt-1">
                          Apply → {j.contact_email}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Post Job */}
          {activeTab === "post" && (
            <div className="glass-card p-6 max-w-2xl">
              <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2"><Send className="h-5 w-5 text-emerald-400" />Post a Job Listing</h2>
              {successMsg && <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-4">{successMsg}</div>}
              <form onSubmit={postJob} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className="glass-input" placeholder="Job Title *" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required />
                  <input className="glass-input" placeholder="Company Name *" value={form.company} onChange={e => setForm(f=>({...f,company:e.target.value}))} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className="glass-input" placeholder="Location *" value={form.location} onChange={e => setForm(f=>({...f,location:e.target.value}))} required />
                  <select className="glass-select" value={form.region} onChange={e => setForm(f=>({...f,region:e.target.value}))}>
                    {regions.map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <select className="glass-select" value={form.job_type} onChange={e => setForm(f=>({...f,job_type:e.target.value}))}>
                    {jobTypes.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <input className="glass-input" placeholder="Min Salary" type="number" value={form.salary_min} onChange={e => setForm(f=>({...f,salary_min:e.target.value}))} />
                  <input className="glass-input" placeholder="Max Salary" type="number" value={form.salary_max} onChange={e => setForm(f=>({...f,salary_max:e.target.value}))} />
                </div>
                <textarea className="glass-input resize-none" rows={4} placeholder="Job Description *" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} required />
                <textarea className="glass-input resize-none" rows={2} placeholder="Requirements (optional)" value={form.requirements} onChange={e => setForm(f=>({...f,requirements:e.target.value}))} />
                <input className="glass-input" placeholder="Skills (comma-separated, e.g. React, Node.js, Excel)" value={form.skills} onChange={e => setForm(f=>({...f,skills:e.target.value}))} />
                <input className="glass-input" placeholder="Contact Email" type="email" value={form.contact_email} onChange={e => setForm(f=>({...f,contact_email:e.target.value}))} />
                <button type="submit" disabled={submitting} className="btn-primary w-full" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" />Post Job Listing</>}
                </button>
              </form>
            </div>
          )}

          {/* AI Match */}
          {activeTab === "ai" && (
            <div className="max-w-2xl space-y-4">
              <div className="glass-card p-6 space-y-4">
                <h2 className="font-display font-bold text-white flex items-center gap-2"><Bot className="h-5 w-5 text-emerald-400" />AI Skill Matcher</h2>
                <p className="text-sm text-white/50">List your skills and let Gemini AI suggest the best job roles and industries for you in the Philippines.</p>
                <textarea className="glass-input resize-none" rows={4} placeholder="Paste your skills here (e.g., React, project management, customer service, Tagalog, Excel, carpentry…)" value={skills} onChange={e => setSkills(e.target.value)} />
                <button onClick={matchSkills} disabled={aiLoading || !skills.trim()} className="btn-primary w-full" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
                  {aiLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Analyzing...</> : <><Zap className="h-4 w-4" />Match My Skills</>}
                </button>
                {aiResult && (
                  <div className="text-sm text-white/70 bg-emerald-500/05 border border-emerald-500/15 rounded-xl p-5 leading-relaxed whitespace-pre-line animate-slide-up">
                    {aiResult}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
