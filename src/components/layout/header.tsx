"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Menu, X, User, LogOut, LayoutDashboard,
  Car, Shield, Briefcase, Heart, Leaf, ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { UgnayLogo } from "@/components/ui/ugnay-logo";

const modules = [
  { href: "/mobility",   label: "Mobility",    icon: Car,         color: "text-amber-400",   desc: "Traffic & Transport" },
  { href: "/vibecheck",  label: "VibeCheck",   icon: Shield,      color: "text-indigo-400",  desc: "Fight Disinformation" },
  { href: "/governance", label: "Governance",  icon: ShieldCheck, color: "text-rose-400",    desc: "Transparency & Accountability" },
  { href: "/jobs",       label: "Jobs",        icon: Briefcase,   color: "text-emerald-400", desc: "Employment & Opportunities" },
  { href: "/health",     label: "Health",      icon: Heart,       color: "text-blue-400",    desc: "Healthcare Access" },
  { href: "/agri",       label: "Agri",        icon: Leaf,        color: "text-lime-400",    desc: "Sustainable Agriculture" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, signOut, loading } = useAuth();
  
  const headerRef = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.from(headerRef.current, { y: -80, opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.1 });
  });

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full glass-nav">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative shrink-0 flex items-center justify-center">
              <UgnayLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-300 drop-shadow-md" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-base text-white group-hover:text-ph-yellow transition-colors">
                Ugnay<span className="text-ph-yellow">PH</span>
              </span>
              <span className="text-[10px] text-white/50 font-medium hidden sm:block">Connecting Filipinos</span>
            </div>
          </Link>

          {/* Desktop Nav - Modules Dropdown */}
          <nav className="hidden md:flex items-center gap-1">
            <div className="relative" onMouseLeave={() => setModulesOpen(false)}>
              <button
                onMouseEnter={() => setModulesOpen(true)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                Modules
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", modulesOpen && "rotate-180")} />
              </button>

              {/* Mega dropdown */}
              {modulesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] glass-card-strong p-3 grid grid-cols-2 gap-1.5 animate-fade-in">
                  {modules.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      onClick={() => setModulesOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                        "hover:bg-white/06",
                        pathname === m.href ? "bg-white/08" : ""
                      )}
                    >
                      <m.icon className={cn("h-4 w-4 shrink-0", m.color)} />
                      <div>
                        <div className="text-sm font-medium text-white/90">{m.label}</div>
                        <div className="text-[11px] text-white/40">{m.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick pills */}
            {modules.slice(0, 3).map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === m.href
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/05"
                )}
              >
                <m.icon className={cn("h-4 w-4", m.color)} />
                {m.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 shrink-0">
            {!loading && (
              user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/05 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {profile?.username || "Dashboard"}
                  </Link>
                  <button
                    onClick={signOut}
                    className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/auth/login" className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/05 transition-colors">
                    Log In
                  </Link>
                  <Link href="/auth/signup" className="btn-primary text-sm py-2 px-4">
                    Sign Up
                  </Link>
                </div>
              )
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/05 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn("md:hidden overflow-hidden transition-all duration-300", mobileMenuOpen ? "max-h-[500px] pb-4" : "max-h-0")}>
          <div className="pt-3 space-y-1">
            <p className="px-3 text-[11px] font-semibold text-white/30 uppercase tracking-wider pb-1">Modules</p>
            {modules.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                  pathname === m.href ? "bg-white/10" : "hover:bg-white/05"
                )}
              >
                <m.icon className={cn("h-5 w-5", m.color)} />
                <div>
                  <div className="text-sm font-semibold text-white/90">{m.label}</div>
                  <div className="text-xs text-white/40">{m.desc}</div>
                </div>
              </Link>
            ))}

            <hr className="glass-divider my-2" />

            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/05 transition-all">
                  <User className="h-5 w-5 text-indigo-400" />
                  <span className="text-sm font-medium text-white/80">My Dashboard</span>
                </Link>
                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-all text-left">
                  <LogOut className="h-5 w-5 text-red-400" />
                  <span className="text-sm font-medium text-red-400">Log Out</span>
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-1 pt-1">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium text-white/70 border border-white/10 hover:bg-white/05 transition-all">
                  Log In
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1 btn-primary text-center py-2.5 rounded-xl text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
