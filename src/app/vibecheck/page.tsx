"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalysisCard } from "@/components/features/analysis-card";
import { MemeGenerator } from "@/components/features/meme-generator";
import { ExampleGrid } from "@/components/features/example-card";
import { ShareDialog } from "@/components/features/share-dialog";
import { ImageUpload } from "@/components/features/image-upload";
import { EXAMPLES } from "@/lib/examples";
import { VibeAnalysis, Example } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import {
  Zap, Loader2, Shield, BookOpen, TrendingUp, Bot, Save, Check, Type, Camera, ScanSearch,
} from "lucide-react";

export default function VibeCheckPage() {
  const [content, setContent] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "image">("text");
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<VibeAnalysis | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleImageSelect = (data: string, mimeType: string) => {
    setImageData(data); setImageMimeType(mimeType); setAnalysis(null); setSaved(false);
  };
  const handleImageClear = () => {
    setImageData(null); setImageMimeType(null); setAnalysis(null); setSaved(false);
  };

  const analyzeContent = async () => {
    const isImg = inputMode === "image";
    if (isImg && !imageData) { toast({ title: "Upload an image first!", variant: "warning" }); return; }
    if (!isImg && !content.trim()) { toast({ title: "Paste some content first!", variant: "warning" }); return; }
    setLoading(true); setAnalysis(null); setSaved(false);
    try {
      const body = isImg
        ? { contentType: "image", imageData, imageMimeType }
        : { content: content.trim(), contentType: content.startsWith("http") ? "url" : "text" };
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        toast({ title: "Analysis Complete!", description: `Vibe Score: ${data.analysis.score}/100`, variant: data.analysis.score <= 40 ? "success" : data.analysis.score <= 60 ? "warning" : "destructive" });
      } else throw new Error(data.error || "Analysis failed");
    } catch {
      toast({ title: "Error!", description: "Could not analyze content. Try again.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const saveReport = async () => {
    if (!user || !analysis) return;
    setSaving(true);
    try {
      const res = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: inputMode === "image" ? "[Image Analysis]" : content.trim(), content_type: inputMode === "image" ? "image" : content.startsWith("http") ? "url" : "text", score: analysis.score, label: analysis.label, label_tagalog: analysis.labelTagalog, explanation: analysis.explanation, red_flags: analysis.redFlags, literacy_tips: analysis.literacyTips, category: analysis.category }) });
      const data = await res.json();
      if (data.success) { setSaved(true); toast({ title: "Saved!", description: "Check your Dashboard.", variant: "success" }); }
      else throw new Error(data.error);
    } catch { toast({ title: "Could not save", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleExampleSelect = (ex: Example) => {
    setContent(ex.content); setAnalysis(null); setSaved(false);
    toast({ title: `Loaded: ${ex.title}`, description: "Click 'CHECK VIBE' to analyze!" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 badge-pill">
              <Bot className="h-3 w-3" /> Powered by Google Gemini AI
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold">
              <span className="gradient-text">VibeCheck</span>{" "}
              <span className="text-white">PH</span>
            </h1>
            <p className="text-lg text-white/55">
              Paste anywhere. Get the real Vibe.{" "}
              <span className="text-indigo-400 font-semibold">Huwag maging sus!</span> 🇵🇭
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-2 text-sm text-white/50">
              <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-400" /> AI-Powered Analysis</span>
              <span className="flex items-center gap-2"><Camera className="h-4 w-4 text-indigo-400" /> Image Scanning</span>
              <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-amber-400" /> PH-Focused Detection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-4 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white/90">
                  <ScanSearch className="h-5 w-5 text-indigo-400" />
                  I-check ang suspicious content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "text"|"image")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text" className="flex items-center gap-2"><Type className="h-4 w-4" />Text / URL</TabsTrigger>
                    <TabsTrigger value="image" className="flex items-center gap-2"><Camera className="h-4 w-4" />Scan Image</TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-4">
                    <Textarea placeholder="Paste text, news article, URL, or social media post…" value={content} onChange={(e) => { setContent(e.target.value); setSaved(false); }} className="min-h-[140px] text-base glass-input border-0 resize-none" aria-label="Content to analyze" />
                  </TabsContent>
                  <TabsContent value="image" className="mt-4">
                    <ImageUpload onImageSelect={handleImageSelect} onClear={handleImageClear} disabled={loading} />
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="flex-1 text-lg font-display btn-primary border-0" onClick={analyzeContent} disabled={loading || (inputMode==="text" ? !content.trim() : !imageData)}>
                    {loading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />{inputMode==="image"?"Scanning...":"Checking..."}</> : <><Zap className="h-5 w-5 mr-2" />{inputMode==="image"?"SCAN IMAGE":"CHECK VIBE"}</>}
                  </Button>
                  {analysis && (
                    <div className="flex gap-2">
                      {user && (
                        <Button variant="outline" size="lg" onClick={saveReport} disabled={saving||saved} className="border-white/10">
                          {saved ? <><Check className="h-4 w-4 mr-2 text-emerald-400" />Saved!</> : saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" />Save</>}
                        </Button>
                      )}
                      <ShareDialog score={analysis.score} label={analysis.labelTagalog} content={inputMode==="image" ? "[Image]" : content} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {analysis && (
              <div className="animate-slide-up space-y-4">
                <Tabs defaultValue="analysis" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="meme">Meme Generator</TabsTrigger>
                  </TabsList>
                  <TabsContent value="analysis"><AnalysisCard analysis={analysis} content={content} /></TabsContent>
                  <TabsContent value="meme">
                    <Card className="glass-card border-0">
                      <CardHeader><CardTitle>Generate Shareable Meme</CardTitle></CardHeader>
                      <CardContent>
                        <MemeGenerator data={{ score: analysis.score, label: analysis.label, labelTagalog: analysis.labelTagalog, content, timestamp: formatDate(new Date()) }} onShare={() => toast({ title: "Copied!", description: "Caption copied.", variant: "success" })} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white/80">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                  Try These Examples (PH-Specific)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExampleGrid examples={EXAMPLES} onSelect={handleExampleSelect} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
