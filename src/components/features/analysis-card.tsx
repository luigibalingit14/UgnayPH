"use client";

import { VibeAnalysis, RedFlag } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { VibeMeter } from "./vibe-meter";
import {
  AlertTriangle,
  BookOpen,
  Flag,
  Lightbulb,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisCardProps {
  analysis: VibeAnalysis;
  content?: string;
}

export function AnalysisCard({ analysis, content }: AnalysisCardProps) {
  const severityColors = {
    low: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    medium: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    high: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const categoryLabels: Record<string, string> = {
    news: "Balita",
    social_media: "Social Media",
    advertisement: "Advertisement",
    government: "Government",
    scam: "Scam",
    satire: "Satire/Joke",
    opinion: "Opinion",
    unknown: "Unknown",
  };

  return (
    <Card className="glass-card border-0 bg-white/5 shadow-none pb-2">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Vibe Analysis
          </CardTitle>
          <Badge variant="outline">
            {categoryLabels[analysis.category] || analysis.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vibe Meter */}
        <VibeMeter score={analysis.score} />

        <Separator />

        {/* Explanation */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-secondary" />
            Analysis Explanation
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {analysis.explanation}
          </p>
        </div>

        {/* Red Flags */}
        {analysis.redFlags.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2 text-sm">
                <Flag className="h-4 w-4 text-destructive" />
                Red Flags Detected ({analysis.redFlags.length})
              </h4>
              <div className="space-y-2">
                {analysis.redFlags.map((flag, index) => (
                  <RedFlagItem key={index} flag={flag} severityColors={severityColors} />
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Literacy Tips */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2 text-sm">
            <Lightbulb className="h-4 w-4 text-primary" />
            Digital Literacy Tips
          </h4>
          <ul className="space-y-2">
            {analysis.literacyTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-primary font-bold">{index + 1}.</span>
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Confidence */}
        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>Analysis Confidence:</span>
          <Badge variant={analysis.confidence >= 80 ? "success" : analysis.confidence >= 50 ? "warning" : "outline"}>
            {analysis.confidence}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function RedFlagItem({
  flag,
  severityColors,
}: {
  flag: RedFlag;
  severityColors: Record<string, string>;
}) {
  const typeLabels: Record<string, string> = {
    clickbait: "Clickbait",
    emotional_manipulation: "Emotional Manipulation",
    unverified_source: "Unverified Source",
    suspicious_url: "Suspicious URL",
    fake_urgency: "Fake Urgency",
    missing_context: "Missing Context",
    impersonation: "Impersonation",
    scam_patterns: "Scam Patterns",
    misinformation: "Misinformation",
    outdated_info: "Outdated Info",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border",
        severityColors[flag.severity]
      )}
    >
      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {typeLabels[flag.type] || flag.type}
          </span>
          <Badge variant="outline" className="text-xs capitalize">
            {flag.severity}
          </Badge>
        </div>
        <p className="text-xs opacity-80">{flag.description}</p>
      </div>
    </div>
  );
}
