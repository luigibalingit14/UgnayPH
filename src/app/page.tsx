"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Car, Shield, ShieldCheck, Briefcase, Heart, Leaf,
  ArrowRight, Zap, Globe, Users, Database,
} from "lucide-react";
import { SyncButton } from "@/components/features/sync-button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const modules = [
  {
    href: "/mobility",
    label: "Smart Mobility",
    tagline: "Beat the Traffic",
    description: "Report traffic jams, accidents, and get AI-powered alternate route suggestions for Filipino commuters.",
    icon: Car,
    sdg: "SDG 9 & 11",
    color: "module-mobility",
    accent: "#fbbf24",
    glow: "rgba(251,191,36,0.3)",
    gradient: "from-amber-500/20 to-orange-600/5",
    border: "group-hover:border-amber-500/30",
    cta: "Report & Route",
  },
  {
    href: "/vibecheck",
    label: "VibeCheck PH",
    tagline: "Fight Fake News",
    description: "Paste any text, URL, or image to instantly detect disinformation and scams using Gemini AI.",
    icon: Shield,
    sdg: "SDG 4 & 16",
    color: "module-vibecheck",
    accent: "#6366f1",
    glow: "rgba(99,102,241,0.3)",
    gradient: "from-indigo-500/20 to-violet-600/5",
    border: "group-hover:border-indigo-500/30",
    cta: "Check Vibe",
    featured: true,
  },
  {
    href: "/governance",
    label: "Governance Watch",
    tagline: "Hold Power Accountable",
    description: "Submit citizen complaints, track government projects, and upvote community concerns.",
    icon: ShieldCheck,
    sdg: "SDG 16",
    color: "module-governance",
    accent: "#f43f5e",
    glow: "rgba(244,63,94,0.3)",
    gradient: "from-rose-500/20 to-pink-600/5",
    border: "group-hover:border-rose-500/30",
    cta: "View Reports",
  },
  {
    href: "/jobs",
    label: "Jobs & Skills",
    tagline: "Find Your Opportunity",
    description: "Browse job listings, post opportunities, and use AI to match your skills to ideal roles nationwide.",
    icon: Briefcase,
    sdg: "SDG 8",
    color: "module-jobs",
    accent: "#10b981",
    glow: "rgba(16,185,129,0.3)",
    gradient: "from-emerald-500/20 to-teal-600/5",
    border: "group-hover:border-emerald-500/30",
    cta: "Find Jobs",
  },
  {
    href: "/health",
    label: "HealthReach",
    tagline: "Healthcare for Everyone",
    description: "Find nearby health centers, get AI symptom triage, and book appointments — even in rural areas.",
    icon: Heart,
    sdg: "SDG 3 & 10",
    color: "module-health",
    accent: "#3b82f6",
    glow: "rgba(59,130,246,0.3)",
    gradient: "from-blue-500/20 to-cyan-600/5",
    border: "group-hover:border-blue-500/30",
    cta: "Get Help",
  },
  {
    href: "/agri",
    label: "AgriLink PH",
    tagline: "Empower Farmers",
    description: "Get AI crop advisories, track real-time market prices, and connect with the farmer community.",
    icon: Leaf,
    sdg: "SDG 2 & 12",
    color: "module-agri",
    accent: "#84cc16",
    glow: "rgba(132,204,22,0.3)",
    gradient: "from-lime-500/20 to-green-600/5",
    border: "group-hover:border-lime-500/30",
    cta: "Explore",
  },
];

const stats = [
  { label: "SDG Challenges", value: "6", icon: Globe, color: "text-ph-blue" },
  { label: "AI-Powered Tools", value: "6", icon: Zap, color: "text-ph-yellow" },
  { label: "For All Filipinos", value: "∞", icon: Users, color: "text-ph-red" },
  { label: "Backed by Supabase", value: "✓", icon: Database, color: "text-blue-400" },
];

export default function HomePage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.fromTo(".hero-blob", { scale: 0.6 }, { scale: 1, duration: 2, stagger: 0.3 }, 0);
    tl.fromTo(".hero-badge", { y: -30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.2);
    tl.fromTo(".hero-title", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.4);
    tl.fromTo(".hero-desc", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.6);
    tl.fromTo(".hero-cta", { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" }, 0.7);
    tl.fromTo(".stat-card", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 }, 0.8);

    gsap.fromTo(".modules-header", 
      { y: 50, autoAlpha: 0 },
      { scrollTrigger: { trigger: ".modules-section", start: "top 85%" }, y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(".module-card-anim", 
      { y: 50, autoAlpha: 0 },
      { scrollTrigger: { trigger: ".modules-grid", start: "top 85%" }, y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );

    gsap.fromTo(".bottom-cta-card", 
      { scale: 0.9, y: 30, autoAlpha: 0 },
      { scrollTrigger: { trigger: ".bottom-cta-section", start: "top 85%" }, scale: 1, y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
    );
  }, { scope: container });

  return (
    <div className="min-h-screen" ref={container}>
      {/* ── HERO ── */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div className="absolute inset-0 hero-mesh" />

        {/* Floating blobs */}
        <div className="hero-blob absolute top-20 left-10 w-72 h-72 bg-ph-blue/30 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="hero-blob absolute bottom-10 right-10 w-80 h-80 bg-ph-red/20 rounded-full blur-3xl pointer-events-none animate-float-medium" />
        <div className="hero-blob absolute inset-0 ph-sunburst opacity-40 animate-spin-slow pointer-events-none mix-blend-screen" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-ph-blue/20 border border-ph-blue/40 text-blue-200 animate-pulse-glow">
              <span className="w-1.5 h-1.5 rounded-full bg-ph-yellow animate-ping" />
              InterCICSkwela Hackathon 2026 · All 6 SDG Challenges
            </div>

            {/* Headline */}
            <h1 className="hero-title text-5xl md:text-7xl font-display font-bold leading-[1.08] tracking-tight hover:scale-[1.02] transition-transform duration-500">
              <span className="pinoy-gradient-text drop-shadow-[0_0_15px_rgba(252,209,22,0.4)]">Ugnay</span>
              <span className="text-white">PH</span>
              <br />
              <span className="text-white/50 text-3xl md:text-4xl font-medium">
                One platform. Six solutions.
              </span>
            </h1>

            <p className="hero-desc text-lg md:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed">
              Connecting every Filipino to AI-powered tools for safer roads, truth online, transparent government, 
              better jobs, accessible healthcare, and sustainable farming.
            </p>

            {/* CTAs */}
            <div className="hero-cta flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/vibecheck" className="btn-primary text-base px-8 py-3.5">
                <Shield className="h-5 w-5" />
                Try VibeCheck PH
              </Link>
              <Link href="#modules" className="btn-secondary text-base px-8 py-3.5">
                Explore All Modules
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="hero-cta">
              <SyncButton />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-2xl mx-auto">
              {stats.map((s) => (
                <div key={s.label} className="stat-card glass-card p-4 text-center">
                  <s.icon className={`h-5 w-5 mx-auto mb-1.5 ${s.color}`} />
                  <div className="text-2xl font-display font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULE GRID ── */}
      <section id="modules" className="modules-section py-20 relative">
        <div className="container mx-auto px-4">
          <div className="modules-header text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Six Modules, One Mission
            </h2>
            <p className="text-white/45 max-w-xl mx-auto">
              Each module is a fully functional AI-powered tool addressing a critical Philippine challenge.
            </p>
          </div>

          <div className="modules-grid grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {modules.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className={`module-card-anim module-card group ${m.color} relative`}
                style={{ ["--glow" as string]: m.glow }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 rounded-[1.25rem] bg-gradient-to-br ${m.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Featured tag */}
                {m.featured && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                    FEATURED
                  </div>
                )}

                <div className="relative z-10 space-y-4">
                  {/* Icon + SDG */}
                  <div className="flex items-start justify-between">
                    <div
                      className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${m.accent}18`, border: `1px solid ${m.accent}28` }}
                    >
                      <m.icon className="h-6 w-6" style={{ color: m.accent }} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: `${m.accent}12`, color: `${m.accent}`, border: `1px solid ${m.accent}25` }}>
                      {m.sdg}
                    </span>
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-xs font-medium text-white/40 mb-0.5">{m.tagline}</p>
                    <h3 className="text-xl font-display font-bold text-white mb-2">{m.label}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{m.description}</p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3" style={{ color: m.accent }}>
                    {m.cta}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUILT FOR PH ── */}
      <section className="bottom-cta-section py-16">
        <div className="container mx-auto px-4">
          <div className="bottom-cta-card max-w-3xl mx-auto glass-card-strong p-10 text-center space-y-6">
            <span className="text-4xl">🇵🇭</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
              Built for Every Filipino
            </h2>
            <p className="text-white/50 leading-relaxed">
              From the bustling streets of Manila to the rice fields of Nueva Ecija and the barangay health centers 
              of Mindanao — UgnayPH connects communities to technology that matters.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {["Mobility", "Digital Literacy", "Transparency", "Employment", "Healthcare", "Agriculture"].map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-white/06 border border-white/08 text-white/60">
                  {t}
                </span>
              ))}
            </div>
            <Link href="/vibecheck" className="btn-primary inline-flex mx-auto px-8 py-3.5 mt-2">
              Get Started — It&apos;s Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
