"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Report } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VibeMeter } from "@/components/features/vibe-meter";
import { formatDate, truncateText, getVibeLabel } from "@/lib/utils";
import {
  LayoutDashboard,
  Flame,
  FileText,
  Trophy,
  ChevronDown,
  Loader2,
  Shield,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      redirect("/auth/login");
    }
  }, [user, authLoading]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/reports?limit=10&offset=0`);
        const data = await response.json();

        if (data.success) {
          setReports(data.reports);
          setTotal(data.total || 0);
          setOffset(10);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReports();
    }
  }, [user]);

  const loadMore = async () => {
    if (loadingMore || reports.length >= total) return;

    setLoadingMore(true);
    try {
      const response = await fetch(`/api/reports?limit=10&offset=${offset}`);
      const data = await response.json();

      if (data.success) {
        setReports((prev) => [...prev, ...data.reports]);
        setOffset((prev) => prev + 10);
      }
    } catch (error) {
      console.error("Failed to load more:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 text-center p-8">
          <Shield className="h-12 w-12 mx-auto mb-4 text-secondary" />
          <h2 className="text-xl font-semibold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            Kailangan mag-login para makita ang dashboard mo.
          </p>
          <Button asChild>
            <Link href="/auth/login">
              <LogIn className="h-4 w-4 mr-2" />
              Log In
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const avgScore =
    reports.length > 0
      ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length)
      : 0;

  const legitChecks = reports.filter((r) => r.score <= 40).length;

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome back, <span className="text-foreground font-medium">{profile?.username || "Kaibigan"}</span>!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <Flame className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{profile?.streak_count || 0}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/20 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{profile?.total_checks || 0}</p>
                <p className="text-xs text-muted-foreground">Total Checks</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-vibe-safe/20 p-2 rounded-lg">
                <Trophy className="h-5 w-5 text-vibe-safe" />
              </div>
              <div>
                <p className="text-2xl font-bold">{legitChecks}</p>
                <p className="text-xs text-muted-foreground">Legit Found</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgScore || "-"}</p>
                <p className="text-xs text-muted-foreground">Avg. Score</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Streak Message */}
        {profile && profile.streak_count > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/30">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="text-5xl">🔥</div>
              <div>
                <h3 className="font-display font-bold text-lg">
                  {profile.streak_count} days na walang na-scam!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Keep checking suspicious content para mapanatili ang streak mo!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>My Reports ({total})</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">New Check</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No reports yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Wala ka pang na-check na content. Start na!
                </p>
                <Button asChild>
                  <Link href="/">Check Content Now</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}

                {reports.length < total && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={loadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    )}
                    Load More
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportCard({ report }: { report: Report }) {
  const vibeInfo = getVibeLabel(report.score);

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-2xl">{vibeInfo.emoji}</span>
            <Badge
              variant={
                report.score <= 40
                  ? "success"
                  : report.score <= 60
                  ? "warning"
                  : "destructive"
              }
            >
              Score: {report.score}
            </Badge>
            <Badge variant="outline">{report.label_tagalog}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {truncateText(report.content, 150)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(report.created_at)}
          </p>
        </div>
        <div className="w-full md:w-32">
          <VibeMeter score={report.score} size="sm" showLabel={false} animated={false} />
        </div>
      </div>
    </Card>
  );
}
