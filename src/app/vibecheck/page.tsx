"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function VibeCheckPage() {
  const container = useRef<HTMLDivElement>(null);
  
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

  useGSAP(() => {
    if (!container.current) return;
    
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.fromTo(".hero-blob", { scale: 0.6 }, { scale: 1, duration: 2, stagger: 0.3 }, 0);
    tl.fromTo(".hero-badge", { y: -30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.2);
    tl.fromTo(".hero-title", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.4);
    tl.fromTo(".hero-desc", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.6);
    tl.fromTo(".hero-stats", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 }, 0.7);

    gsap.fromTo(".vibe-card-anim", 
      { y: 50, autoAlpha: 0 },
      { scrollTrigger: { trigger: ".vibe-section", start: "top 85%" }, y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, { scope: container });

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
    <div className="min-h-screen" ref={container}>
      {/* Hero */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div className="absolute inset-0 hero-mesh" />

        {/* Floating blobs */}
        <div className="hero-blob absolute top-20 left-10 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="hero-blob absolute bottom-10 right-10 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none animate-float-medium" />
        <div className="hero-blob absolute inset-0 ph-sunburst opacity-40 animate-spin-slow pointer-events-none mix-blend-screen" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 animate-pulse-glow">
              <span className="w-1.5 h-1.5 rounded-full bg-ph-yellow animate-ping" />
              Powered by Google Gemini AI
            </div>
            
            <h1 className="hero-title text-5xl md:text-7xl font-display font-bold leading-[1.08] tracking-tight">
              <span className="pinoy-gradient-text drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">VibeCheck</span>{" "}
              <span className="text-white">PH</span>
            </h1>
            
            <p className="hero-desc text-lg md:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed">
              Paste anywhere. Get the real Vibe.{" "}
              <span className="text-indigo-400 font-semibold">Huwag maging sus!</span> 🇵🇭
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-white/50">
              <span className="hero-stats flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-400" /> AI-Powered Analysis</span>
              <span className="hero-stats flex items-center gap-2"><Camera className="h-4 w-4 text-indigo-400" /> Image Scanning</span>
              <span className="hero-stats flex items-center gap-2"><TrendingUp className="h-4 w-4 text-amber-400" /> PH-Focused Detection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="vibe-section py-4 pb-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <Card className="vibe-card-anim glass-card-strong border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-xl">
                  <ScanSearch className="h-6 w-6 text-indigo-400" />
                  I-check ang suspicious content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "text"|"image")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 p-1 bg-white/05 rounded-xl border border-white/10">
                    <TabsTrigger value="text" className="flex items-center gap-2 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300 rounded-lg transition-all"><Type className="h-4 w-4" />Text / URL</TabsTrigger>
                    <TabsTrigger value="image" className="flex items-center gap-2 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300 rounded-lg transition-all"><Camera className="h-4 w-4" />Scan Image</TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-4">
                    <Textarea placeholder="Paste text, news article, URL, or social media post…" value={content} onChange={(e) => { setContent(e.target.value); setSaved(false); }} className="min-h-[160px] text-base glass-input border-0 resize-none rounded-xl focus:ring-indigo-500/50" aria-label="Content to analyze" />
                  </TabsContent>
                  <TabsContent value="image" className="mt-4">
                    <ImageUpload onImageSelect={handleImageSelect} onClear={handleImageClear} disabled={loading} />
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="flex-1 text-lg font-display btn-primary border-0 py-6" onClick={analyzeContent} disabled={loading || (inputMode==="text" ? !content.trim() : !imageData)}>
                    {loading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />{inputMode==="image"?"Scanning...":"Checking..."}</> : <><Zap className="h-5 w-5 mr-2" />{inputMode==="image"?"SCAN IMAGE":"CHECK VIBE"}</>}
                  </Button>
                  {analysis && (
                    <div className="flex gap-2">
                       {user && (
                        <Button variant="outline" size="lg" onClick={saveReport} disabled={saving||saved} className="border-white/10 hover:bg-white/10 py-6">
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
              <div className="vibe-card-anim space-y-4">
                <Tabs defaultValue="analysis" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 p-1 bg-white/05 rounded-xl border border-white/10">
                    <TabsTrigger value="analysis" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300 rounded-lg">Analysis</TabsTrigger>
                    <TabsTrigger value="meme" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300 rounded-lg">Meme Generator</TabsTrigger>
                  </TabsList>
                  <TabsContent value="analysis" className="mt-4"><AnalysisCard analysis={analysis} content={content} /></TabsContent>
                  <TabsContent value="meme" className="mt-4">
                    <Card className="glass-card-strong border-0 shadow-xl">
                      <CardHeader><CardTitle className="text-white">Generate Shareable Meme</CardTitle></CardHeader>
                      <CardContent>
                        <MemeGenerator data={{ score: analysis.score, label: analysis.label, labelTagalog: analysis.labelTagalog, content, timestamp: formatDate(new Date()) }} onShare={() => toast({ title: "Copied!", description: "Caption copied.", variant: "success" })} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <Card className="vibe-card-anim glass-card border-0 shadow-lg">
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
