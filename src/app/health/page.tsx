"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, MapPin, Phone, Search, Calendar, Loader2, Bot, Zap, Send, Clock, CheckCircle, XCircle } from "lucide-react";

type HealthCenter = {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  region: string;
  province?: string;
  phone?: string;
  services?: string[];
  is_24h: boolean;
  accepts_philhealth: boolean;
};

const centerTypes: Record<string, string> = {
  hospital: "🏥 Hospital",
  rural_health_unit: "🏠 Rural Health Unit",
  barangay_health_center: "🏡 Barangay Health Center",
  clinic: "🩺 Clinic",
  lying_in: "🤱 Lying-In",
};

const regions = ["NCR","CAR","Region I","Region II","Region III","Region IV-A","Region IV-B","Region V","Region VI","Region VII","Region VIII","Region IX","Region X","Region XI","Region XII","CARAGA","BARMM"];

export default function HealthPage() {
  const [centers, setCenters] = useState<HealthCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"centers"|"symptoms"|"appointment">("centers");
  const [filterRegion, setFilterRegion] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [apptForm, setApptForm] = useState({ patient_name: "", contact_number: "", concern: "", preferred_date: "", health_center_id: "" });

  const fetchCenters = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterRegion !== "all") params.set("region", filterRegion);
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/health?${params}`);
      const data = await res.json();
      if (data.success) setCenters(data.centers || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [filterRegion, searchQuery]);

  useEffect(() => { if (activeTab === "centers") fetchCenters(); }, [fetchCenters, activeTab]);

  const checkSymptoms = async () => {
    if (!symptoms.trim()) return;
    setAiLoading(true); setAiResult("");
    try {
      const res = await fetch("/api/health", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ symptoms }) });
      const data = await res.json();
      if (data.ai_result) setAiResult(data.ai_result);
    } catch { /* silent */ }
    finally { setAiLoading(false); }
  };

  const bookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await fetch("/api/health", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ appointment: true, ...apptForm }) });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Appointment request submitted! 🎉 You will be contacted to confirm your schedule.");
        setApptForm({ patient_name: "", contact_number: "", concern: "", preferred_date: "", health_center_id: "" });
        setTimeout(() => setSuccessMsg(""), 6000);
      }
    } catch { /* silent */ }
    finally { setSubmitLoading(false); }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/25 text-blue-300">
            <Heart className="h-3.5 w-3.5" /> Healthcare Access · SDG 3 & 10
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            <span style={{ color: "#3b82f6" }}>Health</span>Reach PH
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">Find health centers near you, get AI symptom advice, and book appointments — even in remote areas.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-1 mb-6 bg-white/03 border border-white/06 p-1 rounded-xl w-fit">
            {[{key:"centers",label:"Health Centers",icon:MapPin},{key:"symptoms",label:"Symptom Check",icon:Bot},{key:"appointment",label:"Book Appointment",icon:Calendar}].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key as "centers"|"symptoms"|"appointment")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab===t.key?"bg-white/08 text-white":"text-white/40 hover:text-white/70"}`}>
                <t.icon className="h-4 w-4" />{t.label}
              </button>
            ))}
          </div>

          {/* Health Centers */}
          {activeTab === "centers" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input className="glass-input pl-9" placeholder="Search health centers…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key==="Enter" && fetchCenters()} />
                </div>
                <select className="glass-select text-xs py-1.5 px-3 rounded-lg" value={filterRegion} onChange={e => setFilterRegion(e.target.value)}>
                  <option value="all">All Regions</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button onClick={fetchCenters} className="btn-secondary text-xs px-4 py-2">Search</button>
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="glass-card p-5 h-36 shimmer" />)}</div>
              ) : centers.length === 0 ? (
                <div className="glass-card p-12 text-center text-white/30">
                  <Heart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No health centers found for this region.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {centers.map(c => (
                    <div key={c.id} className="glass-card p-5 space-y-3 hover:border-blue-500/20 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-white/95 text-sm leading-tight">{c.name}</h3>
                          <p className="text-xs text-blue-400 mt-0.5">{centerTypes[c.type] || c.type}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {c.is_24h && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1"><Clock className="h-2.5 w-2.5" />24/7</span>}
                          {c.accepts_philhealth ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-1"><CheckCircle className="h-2.5 w-2.5" />PhilHealth</span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/05 border border-white/08 text-white/30 flex items-center gap-1"><XCircle className="h-2.5 w-2.5" />No PhilHealth</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-white/45 flex items-center gap-1.5"><MapPin className="h-3 w-3 shrink-0" />{c.address}, {c.city}, {c.region}</p>
                      {c.phone && <p className="text-xs text-white/45 flex items-center gap-1.5"><Phone className="h-3 w-3 shrink-0" />{c.phone}</p>}
                      {c.services && c.services.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {c.services.slice(0,5).map(s => <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/08 border border-blue-500/12 text-blue-300/70 capitalize">{s.replace("_"," ")}</span>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Symptom Checker */}
          {activeTab === "symptoms" && (
            <div className="max-w-2xl space-y-4">
              <div className="glass-card p-6 space-y-4">
                <h2 className="font-display font-bold text-white flex items-center gap-2"><Bot className="h-5 w-5 text-blue-400" />AI Symptom Checker</h2>
                <div className="text-xs text-amber-300/70 bg-amber-500/08 border border-amber-500/15 rounded-xl px-4 py-3">
                  ⚠️ This tool is for informational purposes only, hindi ito pamalit sa doktor. Pumunta sa pinakamalapit na health center para sa proper diagnosis.
                </div>
                <textarea className="glass-input resize-none" rows={5} placeholder="Describe your symptoms (e.g., lagnat, ubo, pananakit ng ulo, shortness of breath, for 3 days…)" value={symptoms} onChange={e => setSymptoms(e.target.value)} />
                <button onClick={checkSymptoms} disabled={aiLoading || !symptoms.trim()} className="btn-primary w-full" style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}>
                  {aiLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Analyzing...</> : <><Zap className="h-4 w-4" />Check Symptoms</>}
                </button>
                {aiResult && (
                  <div className="text-sm text-white/70 bg-blue-500/05 border border-blue-500/15 rounded-xl p-5 leading-relaxed whitespace-pre-line animate-slide-up">{aiResult}</div>
                )}
              </div>
            </div>
          )}

          {/* Book Appointment */}
          {activeTab === "appointment" && (
            <div className="max-w-xl glass-card p-6 space-y-4">
              <h2 className="font-display font-bold text-white flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-400" />Request Appointment</h2>
              {successMsg && <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">{successMsg}</div>}
              <form onSubmit={bookAppointment} className="space-y-3">
                <input className="glass-input" placeholder="Full Name *" value={apptForm.patient_name} onChange={e => setApptForm(f=>({...f,patient_name:e.target.value}))} required />
                <input className="glass-input" placeholder="Contact Number *" value={apptForm.contact_number} onChange={e => setApptForm(f=>({...f,contact_number:e.target.value}))} required />
                <textarea className="glass-input resize-none" rows={3} placeholder="Health concern / reason for visit *" value={apptForm.concern} onChange={e => setApptForm(f=>({...f,concern:e.target.value}))} required />
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Preferred Date *</label>
                  <input className="glass-input" type="date" value={apptForm.preferred_date} onChange={e => setApptForm(f=>({...f,preferred_date:e.target.value}))} required min={new Date().toISOString().split("T")[0]} />
                </div>
                <button type="submit" disabled={submitLoading} className="btn-primary w-full" style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}>
                  {submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" />Request Appointment</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
