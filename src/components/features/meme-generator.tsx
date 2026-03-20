"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2, Loader2 } from "lucide-react";
import { getVibeLabel, truncateText, generateShareText } from "@/lib/utils";
import { MemeData } from "@/types";

interface MemeGeneratorProps {
  data: MemeData;
  onShare?: () => void;
}

export function MemeGenerator({ data, onShare }: MemeGeneratorProps) {
  const memeRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const vibeInfo = getVibeLabel(data.score);

  const downloadMeme = async () => {
    if (!memeRef.current) return;

    setDownloading(true);
    try {
      const dataUrl = await toPng(memeRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `vibecheck-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate meme:", error);
    } finally {
      setDownloading(false);
    }
  };

  const shareToSocial = async () => {
    const shareText = generateShareText(data.score, data.labelTagalog);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "VibeCheck PH Result",
          text: shareText,
          url: window.location.origin,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText + "\n" + window.location.origin);
      onShare?.();
    }
  };

  const getBgGradient = () => {
    if (data.score <= 40) {
      return "from-emerald-900 via-emerald-800 to-teal-900";
    } else if (data.score <= 60) {
      return "from-amber-900 via-yellow-800 to-orange-900";
    } else {
      return "from-red-900 via-rose-800 to-pink-900";
    }
  };

  return (
    <div className="space-y-4">
      {/* Meme Preview */}
      <Card className="overflow-hidden glass-card border-0 bg-black/20 group">
        <div
          ref={memeRef}
          className={`relative bg-gradient-to-br ${getBgGradient()} p-6 aspect-square max-w-md mx-auto`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full justify-between text-white">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <span className="font-display font-bold text-primary">VibeCheck</span>
                <span className="font-display font-bold">PH</span>
              </div>
            </div>

            {/* Main Score */}
            <div className="text-center space-y-4">
              <div className="text-8xl">{vibeInfo.emoji}</div>
              <div>
                <p className="text-5xl font-display font-bold">{data.score}</p>
                <p className="text-lg text-white/80">out of 100</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
                <p className="font-display font-bold text-2xl text-primary">
                  {data.labelTagalog}
                </p>
                <p className="text-sm text-white/70 mt-1">{data.label}</p>
              </div>
            </div>

            {/* Content Preview */}
            <div className="text-center">
              <p className="text-xs text-white/60 italic">
                &quot;{truncateText(data.content, 80)}&quot;
              </p>
              <p className="text-xs text-white/40 mt-2">{data.timestamp}</p>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs text-white/50">
                🇵🇭 Huwag maging sus! Check your vibe at vibecheck.ph
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={downloadMeme}
          disabled={downloading}
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          I-download
        </Button>
        <Button className="flex-1" onClick={shareToSocial}>
          <Share2 className="h-4 w-4 mr-2" />
          I-share
        </Button>
      </div>
    </div>
  );
}
