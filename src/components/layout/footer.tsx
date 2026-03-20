"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Car, Shield, ShieldCheck, Briefcase, Heart, Leaf, Github, Mail } from "lucide-react";
import { UgnayLogo } from "@/components/ui/ugnay-logo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const modules = [
  { href: "/mobility",   label: "Smart Mobility",   icon: Car },
  { href: "/vibecheck",  label: "VibeCheck PH",     icon: Shield },
  { href: "/governance", label: "Governance",        icon: ShieldCheck },
  { href: "/jobs",       label: "Jobs & Skills",     icon: Briefcase },
  { href: "/health",     label: "Healthcare",        icon: Heart },
  { href: "/agri",       label: "Agriculture",       icon: Leaf },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!footerRef.current) return;
    gsap.fromTo(
      footerRef.current,
      { y: 50, autoAlpha: 0 },
      { scrollTrigger: { trigger: footerRef.current, start: "top 95%" }, y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }
    );
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="border-t border-white/06 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0 flex items-center justify-center">
                <UgnayLogo className="w-9 h-9 opacity-90 hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Ugnay<span className="text-ph-yellow">PH</span>
              </span>
            </div>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed">
              One platform connecting Filipinos to AI-powered solutions for mobility, literacy, governance, employment, healthcare, and agriculture.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30">Powered by</span>
              <span className="text-xs font-semibold text-indigo-400">Google Gemini AI</span>
              <span className="text-white/20">·</span>
              <span className="text-xs font-semibold text-emerald-400">Supabase</span>
            </div>
          </div>

          {/* Modules */}
          <div>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Modules</p>
            <div className="grid grid-cols-2 gap-2">
              {modules.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors"
                >
                  <m.icon className="h-3.5 w-3.5 shrink-0" />
                  {m.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Hackathon Note */}
          <div>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">About</p>
            <div className="space-y-3 text-sm text-white/45 leading-relaxed">
              <p>
                Built for <span className="text-indigo-400 font-semibold">InterCICSkwela Hackathon 2026</span> — addressing all 6 SDG challenges for the Philippines.
              </p>
              <p>
                Aligned with SDGs: 2, 3, 4, 8, 9, 10, 11, 12, 16 🇵🇭
              </p>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/05 hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                <Github className="h-4 w-4" />
              </a>
              <a href="mailto:team@ugnayph.dev" className="p-2 rounded-lg bg-white/05 hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <hr className="glass-divider mt-10 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <p>© 2026 UgnayPH. Built with ❤️ for the Filipino people.</p>
          <p>InterCICSkwela Hackathon Challenge · All 6 SDG Challenges</p>
        </div>
      </div>
    </footer>
  );
}
