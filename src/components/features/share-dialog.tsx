"use client";

import { Share2, Facebook, Twitter, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { generateShareText, copyToClipboard } from "@/lib/utils";
import { useState } from "react";

interface ShareDialogProps {
  score: number;
  label: string;
  content: string;
  children?: React.ReactNode;
}

export function ShareDialog({ score, label, content, children }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareText = generateShareText(score, label);
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleCopy = async () => {
    await copyToClipboard(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToTikTok = () => {
    // TikTok doesn't have a direct share URL, so we copy the text
    handleCopy();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md glass-card-strong border-white/10 !bg-black/80 shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white">I-share ang Vibe Check!</DialogTitle>
          <DialogDescription className="text-white/60">
            Tulungan mo rin ang iba na maging informed. Share na!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Text */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-sm text-white/90">
            <p className="whitespace-pre-wrap">{shareText}</p>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={shareToFacebook}
              className="flex items-center gap-2"
            >
              <Facebook className="h-4 w-4 text-blue-500" />
              Facebook
            </Button>

            <Button
              variant="outline"
              onClick={shareToTwitter}
              className="flex items-center gap-2"
            >
              <Twitter className="h-4 w-4 text-sky-500" />
              Twitter/X
            </Button>

            <Button
              variant="outline"
              onClick={shareToTikTok}
              className="flex items-center gap-2"
            >
              <span className="text-lg">📱</span>
              TikTok
            </Button>

            <Button
              variant="outline"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-vibe-safe" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Text
                </>
              )}
            </Button>
          </div>

          {/* Native Share (Mobile) */}
          {typeof navigator !== "undefined" && navigator.share && (
            <Button
              className="w-full"
              onClick={async () => {
                try {
                  await navigator.share({
                    title: "VibeCheck PH Result",
                    text: shareText,
                    url: shareUrl,
                  });
                } catch {
                  // User cancelled
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              I-share (More Options)
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
