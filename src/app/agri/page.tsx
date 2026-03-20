"use client";

import { useState, useEffect, useCallback } from "react";
import { Leaf, Bot, Zap, Send, Loader2, TrendingUp, MapPin, Phone, Clock, Filter } from "lucide-react";

type AgriPrice = {
  id: string;
  crop: string;
  price_per_kg: number;
  unit: string;
  location: string;
  region: string;
  farmer_name?: string;
  contact?: string;
  is_available: boolean;
  created_at: string;
};

const crops = ["Palay (Rice)","Mais (Corn)","Kamatis (Tomato)","Sibuyas (Onion)","Bawang (Garlic)","Kamote (Sweet Potato)","Kangkong","Pechay","Ampalaya (Bitter Gourd)","Saging (Banana)","Mangga (Mango)","Langka (Jackfruit)","Niyog (Coconut)","Kape (Coffee)","Other"];

const regions = ["NCR","CAR","Region I","Region II","Region III","Region IV-A","Region IV-B","Region V","Region VI","Region VII","Region VIII","Region IX","Region X","Region XI","Region XII","CARAGA","BARMM"];

const advisoryCrops = ["Rice","Corn","Tomato","Onion","Garlic","Sweet Potato","Kangkong","Pechay","Bitter Gourd","Banana","Mango","Coconut","Coffee"];

export default function AgriPage() {
  const [prices, setPrices] = useState<AgriPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"prices"|"advisory"|"post">("prices");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterCrop, setFilterCrop] = useState("all");
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [selectedRegion, setSelectedRegion] = useState("Region IV-A");
  const [aiAdvice, setAiAdvice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({ crop: "Palay (Rice)", price_per_kg: "", unit: "kg", location: "", region: "Region IV-A", farmer_name: "", contact: "" });

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterRegion !== "all") params.set("region", filterRegion);
      if (filterCrop !== "all") params.set("crop", filterCrop);
      const res = await fetch(`/api/agri?${params}`);
      const data = await res.json();
      if (data.success) setPrices(data.prices || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [filterRegion, filterCrop]);

  useEffect(() => { if (activeTab === "prices") fetchPrices(); }, [fetchPrices, activeTab]);

  const getCropAdvice = async () => {
    setAiLoading(true); setAiAdvice("");
    try {
      const res = await fetch("/api/agri", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ advisory: true, crop: selectedCrop, region: selectedRegion }) });
      const data = await res.json();
      if (data.ai_advice) setAiAdvice(data.ai_advice);
    } catch { /* silent */ }
    finally { setAiLoading(false); }
  };

  const postPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.price_per_kg || !form.location) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/agri", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, price_per_kg: Number(form.price_per_kg) }) });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Price posted! Maraming salamat sa pag-share. 🌾");
        setForm({ crop: "Palay (Rice)", price_per_kg: "", unit: "kg", location: "", region: "Region IV-A", farmer_name: "", contact: "" });
        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  const cropNames = [...new Set(["all", ...prices.map(p => p.crop)])];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(132,204,22,0.15) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-lime-500/10 border border-lime-500/25 text-lime-300">
            <Leaf className="h-3.5 w-3.5" /> Sustainable Agriculture · SDG 2 & 12
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            <span style={{ color: "#84cc16" }}>AgriLink</span> PH
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">Real-time market prices, AI crop advisories, and a direct link between farmers and communities.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-1 mb-6 bg-white/03 border border-white/06 p-1 rounded-xl w-fit flex-wrap">
            {[{key:"prices",label:"Market Prices",icon:TrendingUp},{key:"advisory",label:"AI Crop Advisory",icon:Bot},{key:"post",label:"Post Price",icon:Send}].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key as "prices"|"advisory"|"post")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab===t.key?"bg-white/08 text-white":"text-white/40 hover:text-white/70"}`}>
                <t.icon className="h-4 w-4" />{t.label}
              </button>
            ))}
          </div>

          {/* Market Prices */}
          {activeTab === "prices" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Filter className="h-4 w-4 text-white/30" />
                <select className="glass-select text-xs py-1.5 px-3 rounded-lg" value={filterRegion} onChange={e => setFilterRegion(e.target.value)}>
                  <option value="all">All Regions</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select className="glass-select text-xs py-1.5 px-3 rounded-lg" value={filterCrop} onChange={e => setFilterCrop(e.target.value)}>
                  {cropNames.map(c => <option key={c} value={c}>{c==="all"?"All Crops":c}</option>)}
                </select>
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_,i) => <div key={i} className="glass-card p-4 h-28 shimmer" />)}</div>
              ) : prices.length === 0 ? (
                <div className="glass-card p-12 text-center text-white/30">
                  <Leaf className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No prices posted yet. Be the first farmer to post!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prices.map(p => (
                    <div key={p.id} className={`glass-card p-4 space-y-3 transition-all hover:border-lime-500/20 ${!p.is_available ? "opacity-50" : ""}`}>
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-white/95">{p.crop}</h3>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${p.is_available ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-white/05 border border-white/08 text-white/30"}`}>
                          {p.is_available ? "Available" : "Sold"}
                        </span>
                      </div>
                      <div className="text-2xl font-display font-bold" style={{ color: "#84cc16" }}>
                        ₱{Number(p.price_per_kg).toFixed(2)} <span className="text-sm font-normal text-white/40">/ {p.unit}</span>
                      </div>
                      <div className="space-y-1 text-xs text-white/40">
                        <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{p.location}, {p.region}</div>
                        {p.farmer_name && <div className="flex items-center gap-1.5">👨‍🌾 {p.farmer_name}</div>}
                        {p.contact && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{p.contact}</div>}
                        <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{new Date(p.created_at).toLocaleDateString("en-PH")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI Advisory */}
          {activeTab === "advisory" && (
            <div className="max-w-2xl space-y-4">
              <div className="glass-card p-6 space-y-4">
                <h2 className="font-display font-bold text-white flex items-center gap-2"><Bot className="h-5 w-5 text-lime-400" />AI Crop Advisory</h2>
                <p className="text-sm text-white/50">Get personalized planting tips, pest management, and harvest advice powered by Gemini AI.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Select Crop</label>
                    <select className="glass-select" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
                      {advisoryCrops.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Your Region</label>
                    <select className="glass-select" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
                      {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={getCropAdvice} disabled={aiLoading} className="btn-primary w-full" style={{ background: "linear-gradient(135deg,#84cc16,#65a30d)" }}>
                  {aiLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Getting advice...</> : <><Zap className="h-4 w-4" />Get Crop Advisory</>}
                </button>
                {aiAdvice && (
                  <div className="text-sm text-white/70 bg-lime-500/05 border border-lime-500/15 rounded-xl p-5 leading-relaxed whitespace-pre-line animate-slide-up">{aiAdvice}</div>
                )}
              </div>
            </div>
          )}

          {/* Post Price */}
          {activeTab === "post" && (
            <div className="max-w-xl glass-card p-6 space-y-4">
              <h2 className="font-display font-bold text-white flex items-center gap-2"><Send className="h-5 w-5 text-lime-400" />Post Market Price</h2>
              {successMsg && <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">{successMsg}</div>}
              <form onSubmit={postPrice} className="space-y-3">
                <select className="glass-select" value={form.crop} onChange={e => setForm(f=>({...f,crop:e.target.value}))}>
                  {crops.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input className="glass-input" placeholder="Price (per unit) *" type="number" step="0.01" min="0" value={form.price_per_kg} onChange={e => setForm(f=>({...f,price_per_kg:e.target.value}))} required />
                  <select className="glass-select" value={form.unit} onChange={e => setForm(f=>({...f,unit:e.target.value}))}>
                    {["kg","sack","bundle","piece","ton"].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <input className="glass-input" placeholder="Location (e.g., Tanauan City, Batangas) *" value={form.location} onChange={e => setForm(f=>({...f,location:e.target.value}))} required />
                <select className="glass-select" value={form.region} onChange={e => setForm(f=>({...f,region:e.target.value}))}>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input className="glass-input" placeholder="Your name (optional)" value={form.farmer_name} onChange={e => setForm(f=>({...f,farmer_name:e.target.value}))} />
                <input className="glass-input" placeholder="Contact number (optional)" value={form.contact} onChange={e => setForm(f=>({...f,contact:e.target.value}))} />
                <button type="submit" disabled={submitting || !form.price_per_kg || !form.location} className="btn-primary w-full" style={{ background: "linear-gradient(135deg,#84cc16,#65a30d)" }}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" />Post Price</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
