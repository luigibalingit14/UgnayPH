"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VibeMeter } from "@/components/features/vibe-meter";
import { VibeAnalysis } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  Swords,
  Loader2,
  Zap,
  Trophy,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BattlePage() {
  const [content1, setContent1] = useState("");
  const [content2, setContent2] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis1, setAnalysis1] = useState<VibeAnalysis | null>(null);
  const [analysis2, setAnalysis2] = useState<VibeAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeContent = async (content: string): Promise<VibeAnalysis | null> => {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          contentType: content.startsWith("http") ? "url" : "text",
        }),
      });

      const data = await response.json();
      return data.success ? data.analysis : null;
    } catch {
      return null;
    }
  };

  const startBattle = async () => {
    if (!content1.trim() || !content2.trim()) {
      toast({
        title: "Kulang ang content!",
        description: "Pareho dapat may content ang dalawang posts.",
        variant: "warning",
      });
      return;
    }

    setLoading(true);
    setAnalysis1(null);
    setAnalysis2(null);

    try {
      const [result1, result2] = await Promise.all([
        analyzeContent(content1),
        analyzeContent(content2),
      ]);

      if (result1 && result2) {
        setAnalysis1(result1);
        setAnalysis2(result2);
        toast({
          title: "Battle Complete! ⚔️",
          description: "Check mo ang results below!",
          variant: "success",
        });
      } else {
        throw new Error("One or both analyses failed");
      }
    } catch {
      toast({
        title: "Battle Failed",
        description: "Di ma-analyze ang isa o pareho sa content. Try ulit.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetBattle = () => {
    setContent1("");
    setContent2("");
    setAnalysis1(null);
    setAnalysis2(null);
  };

  const getWinner = () => {
    if (!analysis1 || !analysis2) return null;
    if (analysis1.score < analysis2.score) return 1;
    if (analysis2.score < analysis1.score) return 2;
    return "tie";
  };

  const winner = getWinner();

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <Badge variant="secondary" className="gap-2">
            <Swords className="h-4 w-4" />
            Vibe Battle Mode
          </Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            <span className="text-primary">Vibe</span> Battle ⚔️
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare dalawang posts side-by-side! Alin ang mas trustworthy? Let the AI decide!
          </p>
        </div>

        {/* Battle Arena */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Post 1 */}
            <Card className={cn(
              "glass-card",
              winner === 1 && "ring-2 ring-vibe-safe shadow-lg shadow-vibe-safe/20"
            )}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded">POST 1</span>
                    {winner === 1 && (
                      <Badge variant="success" className="gap-1">
                        <Trophy className="h-3 w-3" />
                        Winner!
                      </Badge>
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste first post here..."
                  value={content1}
                  onChange={(e) => setContent1(e.target.value)}
                  className="min-h-[150px]"
                  disabled={loading}
                />
                {analysis1 && (
                  <div className="animate-slide-up space-y-4">
                    <VibeMeter score={analysis1.score} size="sm" />
                    <p className="text-sm text-muted-foreground">
                      {analysis1.explanation}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis1.redFlags.slice(0, 3).map((flag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {flag.type.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* VS Divider (Mobile) */}
            <div className="md:hidden flex items-center justify-center">
              <div className="bg-secondary text-secondary-foreground font-display font-bold px-4 py-2 rounded-full">
                VS
              </div>
            </div>

            {/* Post 2 */}
            <Card className={cn(
              "glass-card",
              winner === 2 && "ring-2 ring-vibe-safe shadow-lg shadow-vibe-safe/20"
            )}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="bg-purple-500 text-white text-sm px-2 py-1 rounded">POST 2</span>
                    {winner === 2 && (
                      <Badge variant="success" className="gap-1">
                        <Trophy className="h-3 w-3" />
                        Winner!
                      </Badge>
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste second post here..."
                  value={content2}
                  onChange={(e) => setContent2(e.target.value)}
                  className="min-h-[150px]"
                  disabled={loading}
                />
                {analysis2 && (
                  <div className="animate-slide-up space-y-4">
                    <VibeMeter score={analysis2.score} size="sm" />
                    <p className="text-sm text-muted-foreground">
                      {analysis2.explanation}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis2.redFlags.slice(0, 3).map((flag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {flag.type.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="text-lg font-display min-w-[200px]"
              onClick={startBattle}
              disabled={loading || !content1.trim() || !content2.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Swords className="h-5 w-5 mr-2" />
                  START BATTLE
                </>
              )}
            </Button>

            {(analysis1 || analysis2) && (
              <Button variant="outline" size="lg" onClick={resetBattle}>
                <RefreshCw className="h-4 w-4 mr-2" />
                New Battle
              </Button>
            )}
          </div>

          {/* Winner Announcement */}
          {winner && (
            <Card className="mt-8 text-center p-8 animate-slide-up">
              <div className="text-6xl mb-4">
                {winner === "tie" ? "🤝" : "🏆"}
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">
                {winner === "tie" ? (
                  "It's a Tie!"
                ) : (
                  <>
                    Post {winner} wins!{" "}
                    <span className="text-vibe-safe">Mas Legit!</span>
                  </>
                )}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {winner === "tie"
                  ? "Pareho lang ang vibe score! Mag-ingat ka pa rin sa pareho."
                  : `Post ${winner} ay mas trustworthy based sa AI analysis. Pero always verify pa rin from official sources!`}
              </p>

              {winner !== "tie" && (
                <div className="mt-6 flex items-center justify-center gap-4 text-sm">
                  <div className="text-center">
                    <div className={cn(
                      "text-3xl font-bold",
                      winner === 1 ? "text-vibe-safe" : "text-muted-foreground"
                    )}>
                      {analysis1?.score}
                    </div>
                    <div className="text-xs text-muted-foreground">Post 1</div>
                  </div>
                  <ArrowRight className="text-muted-foreground" />
                  <div className="text-center">
                    <div className={cn(
                      "text-3xl font-bold",
                      winner === 2 ? "text-vibe-safe" : "text-muted-foreground"
                    )}>
                      {analysis2?.score}
                    </div>
                    <div className="text-xs text-muted-foreground">Post 2</div>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
