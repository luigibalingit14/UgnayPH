"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Report } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VibeMeter } from "@/components/features/vibe-meter";
import { formatDate, truncateText, getVibeLabel } from "@/lib/utils";
import {
  LayoutDashboard, Flame, FileText, Trophy, Loader2, Shield, LogIn,
  Car, ShieldCheck, Briefcase, Heart, Leaf, MapPin, Building2, TrendingUp, Calendar, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const supabase = createClient();
  
  const [activeTab, setActiveTab] = useState<"vibecheck"|"mobility"|"governance"|"jobs"|"health"|"agri">("vibecheck");
  const [loading, setLoading] = useState(true);

  // States for all modules
  const [reports, setReports] = useState<Report[]>([]);
  const [mobility, setMobility] = useState<any[]>([]);
  const [governance, setGovernance] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [healthMsgs, setHealthMsgs] = useState<any[]>([]); // Assuming health appointments
  const [agri, setAgri] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      redirect("/auth/login");
    }
  }, [user, authLoading]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user) return;
      setLoading(true);

      try {
        // Fetch VibeCheck
        const vcRes = await fetch(`/api/reports?limit=10&offset=0`);
        const vcData = await vcRes.json();
        if (vcData.success) setReports(vcData.reports);

        // Fetch Mobility
        const { data: mobData } = await supabase.from("mobility_reports").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        if (mobData) setMobility(mobData);

        // Fetch Governance
        const { data: govData } = await supabase.from("governance_complaints").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        if (govData) setGovernance(govData);

        // Fetch Jobs
        const { data: jobData } = await supabase.from("job_listings").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        if (jobData) setJobs(jobData);

        // Fetch Health Appointments (and join health_centers if possible)
        const { data: healthData } = await supabase.from("health_appointments").select("*, health_centers(name, address)").eq("user_id", user.id).order("created_at", { ascending: false });
        if (healthData) setHealthMsgs(healthData);

        // Fetch Agri
        const { data: agriData } = await supabase.from("agri_prices").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        if (agriData) setAgri(agriData);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAllData();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full mx-4 text-center p-8">
          <Shield className="h-12 w-12 mx-auto mb-4 text-indigo-400" />
          <h2 className="text-xl font-display font-semibold mb-2 text-white">Login Required</h2>
          <p className="text-white/50 mb-6">
            Kailangan mag-login para makita ang Universal Citizen Dashboard mo.
          </p>
          <Button asChild className="btn-primary w-full border-0">
            <Link href="/auth/login">
              <LogIn className="h-4 w-4 mr-2" />
              Log In
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate VC stats
  const avgScore = reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length) : 0;
  const legitChecks = reports.filter((r) => r.score <= 40).length;

  const tabs = [
    { key: "vibecheck", label: "VibeCheck", icon: Shield, count: reports.length, color: "text-indigo-400" },
    { key: "mobility", label: "Mobility", icon: Car, count: mobility.length, color: "text-amber-400" },
    { key: "governance", label: "Governance", icon: ShieldCheck, count: governance.length, color: "text-rose-400" },
    { key: "jobs", label: "Jobs", icon: Briefcase, count: jobs.length, color: "text-emerald-400" },
    { key: "health", label: "Health", icon: Heart, count: healthMsgs.length, color: "text-blue-400" },
    { key: "agri", label: "Agriculture", icon: Leaf, count: agri.length, color: "text-lime-400" },
  ];

  return (
    <div className="min-h-screen py-8 md:py-14 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-full h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 80% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-8 p-6 glass-card-strong border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-white/05 border border-white/10 flex items-center justify-center shrink-0">
              <LayoutDashboard className="h-7 w-7 text-white/80" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Citizen <span className="text-indigo-400">Dashboard</span></h1>
              <p className="text-white/60">
                Welcome back, <span className="text-white font-medium">{profile?.username || "Kaibigan"}</span>!
              </p>
            </div>
          </div>
          <Button asChild className="btn-primary w-full md:w-auto text-sm py-2 px-5">
            <Link href="/">Check Feed</Link>
          </Button>
        </div>

        {/* Universal Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0 border ${
                activeTab === t.key 
                  ? "bg-white/10 border-white/20 text-white shadow-lg shadow-black/20" 
                  : "bg-white/03 border-white/05 text-white/50 hover:text-white/80 hover:bg-white/05"
              }`}
            >
              <t.icon className={`h-4 w-4 ${t.color}`} />
              {t.label}
              <Badge variant="outline" className={`ml-1 text-[10px] px-1.5 py-0 h-4 ${activeTab === t.key ? "border-white/20" : "border-white/10 text-white/40"}`}>
                {t.count}
              </Badge>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-card p-6 min-h-[400px]">

          {/* VIBECHECK */}
          {activeTab === "vibecheck" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/03 border border-white/05 p-4 rounded-xl flex items-center gap-3">
                  <Flame className="h-6 w-6 text-orange-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{profile?.streak_count || 0}</p>
                    <p className="text-xs text-white/50">Day Streak</p>
                  </div>
                </div>
                <div className="bg-white/03 border border-white/05 p-4 rounded-xl flex items-center gap-3">
                  <FileText className="h-6 w-6 text-indigo-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{profile?.total_checks || 0}</p>
                    <p className="text-xs text-white/50">Total Checks</p>
                  </div>
                </div>
                <div className="bg-white/03 border border-white/05 p-4 rounded-xl flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-emerald-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{legitChecks}</p>
                    <p className="text-xs text-white/50">Legit Found</p>
                  </div>
                </div>
                <div className="bg-white/03 border border-white/05 p-4 rounded-xl flex items-center gap-3">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{avgScore || "-"}</p>
                    <p className="text-xs text-white/50">Avg Score</p>
                  </div>
                </div>
              </div>

              {profile && profile.streak_count > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 flex items-center gap-4">
                  <div className="text-4xl">🔥</div>
                  <div>
                    <h3 className="font-display font-bold text-white">{profile.streak_count} days na walang na-scam!</h3>
                    <p className="text-sm text-white/60">Keep checking suspicious content para mapanatili ang streak mo!</p>
                  </div>
                </div>
              )}

              <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-8 mb-4 border-b border-white/10 pb-2">
                <FileText className="h-5 w-5 text-indigo-400" /> My Fact Checks
              </h3>
              
              {reports.length === 0 ? (
                <EmptyState icon={Shield} msg="Wala ka pang na-check na content. Start na!" link="/vibecheck" btn="Check Content" />
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => {
                    const vibeInfo = getVibeLabel(report.score);
                    return (
                      <div key={report.id} className="bg-white/03 border border-white/05 hover:border-white/10 hover:bg-white/05 transition-colors rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-xl">{vibeInfo.emoji}</span>
                            <Badge className="bg-white/10 hover:bg-white/20 text-white border-0">Score: {report.score}</Badge>
                            <Badge variant="outline" className="border-white/10 text-white/70">{report.label_tagalog}</Badge>
                          </div>
                          <p className="text-sm text-white/60 line-clamp-2 mb-2">{truncateText(report.content, 150)}</p>
                          <p className="text-xs text-white/40">{formatDate(report.created_at)}</p>
                        </div>
                        <div className="w-full md:w-32"><VibeMeter score={report.score} size="sm" showLabel={false} animated={false} /></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* MOBILITY */}
          {activeTab === "mobility" && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <Car className="h-5 w-5 text-amber-400" /> My Traffic Reports
              </h3>
              {mobility.length === 0 ? (
                <EmptyState icon={Car} msg="Wala ka pang nai-report na traffic incident." link="/mobility" btn="Report Incident" />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {mobility.map(m => (
                    <div key={m.id} className="bg-white/03 border border-white/05 hover:border-white/10 rounded-xl p-4 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-amber-500/20 text-amber-300 border-0">{m.incident_type.replace('_', ' ')}</Badge>
                        <Badge variant="outline" className={m.is_resolved ? 'border-emerald-500/50 text-emerald-400' : 'border-rose-500/50 text-rose-400'}>
                          {m.is_resolved ? 'Resolved' : 'Active'}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-white mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {m.location}</h4>
                      <p className="text-sm text-white/60 mb-3">{m.description || "No description provided."}</p>
                      <p className="text-xs text-white/40">{formatDate(m.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GOVERNANCE */}
          {activeTab === "governance" && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <ShieldCheck className="h-5 w-5 text-rose-400" /> My Governance Complaints
              </h3>
              {governance.length === 0 ? (
                <EmptyState icon={Building2} msg="Wala ka pang nai-file na reklamo o report." link="/governance" btn="File a Complaint" />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {governance.map(g => (
                    <div key={g.id} className="bg-white/03 border border-white/05 hover:border-white/10 rounded-xl p-4 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-rose-500/20 text-rose-300 border-0 capitalize">{g.category}</Badge>
                        <Badge variant="outline" className="border-white/10 text-white/60 capitalize">{g.status.replace('_', ' ')}</Badge>
                      </div>
                      <h4 className="font-semibold text-white mb-2">{g.title}</h4>
                      <p className="text-sm text-white/60 line-clamp-2 mb-3">{g.description}</p>
                      <div className="flex items-center justify-between text-xs text-white/40">
                        <span>{g.agency || "General"}</span>
                        <span>{formatDate(g.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* JOBS */}
          {activeTab === "jobs" && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <Briefcase className="h-5 w-5 text-emerald-400" /> My Job Postings
              </h3>
              {jobs.length === 0 ? (
                <EmptyState icon={Briefcase} msg="Wala ka pang na-post na trabaho." link="/jobs" btn="Post a Job" />
              ) : (
                <div className="space-y-3">
                  {jobs.map(j => (
                    <div key={j.id} className="bg-white/03 border border-white/05 hover:border-white/10 rounded-xl p-4 transition-colors flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-white mb-1">{j.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-white/60">
                          <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{j.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={j.is_active ? 'bg-emerald-500/20 text-emerald-300 border-0' : 'bg-white/10 text-white/50 border-0'}>
                          {j.is_active ? 'Active' : 'Closed'}
                        </Badge>
                        <p className="text-xs text-white/40 mt-2">{formatDate(j.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HEALTH */}
          {activeTab === "health" && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <Calendar className="h-5 w-5 text-blue-400" /> My Health Appointments
              </h3>
              {healthMsgs.length === 0 ? (
                <EmptyState icon={Heart} msg="Wala ka pang naka-book na appointment." link="/health" btn="Book Appointment" />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {healthMsgs.map(h => (
                    <div key={h.id} className="bg-white/03 border border-white/05 hover:border-white/10 rounded-xl p-4 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className="bg-blue-500/20 text-blue-300 border-0 capitalize">{h.status}</Badge>
                        <span className="text-sm font-semibold text-blue-300">{h.preferred_date}</span>
                      </div>
                      <h4 className="font-semibold text-white mb-1">{h.health_centers?.name || "Unknown Center"}</h4>
                      <p className="text-xs text-white/50 mb-3">{h.health_centers?.address || "No address"}</p>
                      <div className="p-3 bg-white/02 rounded-lg border border-white/05 text-sm text-white/70">
                        <span className="text-white/40 block text-xs mb-1">Concern:</span>
                        {h.concern}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AGRI */}
          {activeTab === "agri" && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <TrendingUp className="h-5 w-5 text-lime-400" /> My Crop Prices
              </h3>
              {agri.length === 0 ? (
                <EmptyState icon={Leaf} msg="Wala ka pang nai-post na presyo." link="/agri" btn="Post Price" />
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {agri.map(a => (
                    <div key={a.id} className="bg-white/03 border border-white/05 hover:border-white/10 rounded-xl p-4 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white">{a.crop}</h4>
                        <Badge className={a.is_available ? 'bg-lime-500/20 text-lime-300 border-0' : 'bg-rose-500/20 text-rose-300 border-0'}>
                          {a.is_available ? 'Avail' : 'Sold Out'}
                        </Badge>
                      </div>
                      <p className="text-2xl font-display font-bold text-lime-400 mb-1">
                        ₱{a.price_per_kg} <span className="text-sm text-lime-400/50 font-sans">/ {a.unit}</span>
                      </p>
                      <p className="text-xs text-white/50 flex items-center gap-1 mb-2"><MapPin className="h-3 w-3" /> {a.location}</p>
                      <p className="text-xs text-white/40">{formatDate(a.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Helper component for Empty States
function EmptyState({ icon: Icon, msg, link, btn }: { icon: any, msg: string, link: string, btn: string }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/05 border border-white/10 mb-4">
        <Icon className="h-8 w-8 text-white/50" />
      </div>
      <p className="text-lg text-white/70 mb-6">{msg}</p>
      <Button asChild className="opacity-90 hover:opacity-100">
        <Link href={link}>{btn}</Link>
      </Button>
    </div>
  );
}

