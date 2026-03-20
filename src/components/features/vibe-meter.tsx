"use client";

import { cn, getVibeLabel } from "@/lib/utils";
import { useEffect, useState } from "react";

interface VibeMeterProps {
  score: number;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function VibeMeter({
  score,
  animated = true,
  size = "md",
  showLabel = true,
}: VibeMeterProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const vibeInfo = getVibeLabel(score);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [score, animated]);

  const sizeClasses = {
    sm: "h-3",
    md: "h-5",
    lg: "h-8",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="w-full space-y-3">
      {/* Score Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{vibeInfo.emoji}</span>
          <div>
            {showLabel && (
              <>
                <p className={cn("font-display font-bold", vibeInfo.color, textSizeClasses[size])}>
                  {vibeInfo.labelTagalog}
                </p>
                <p className="text-xs text-muted-foreground">{vibeInfo.label}</p>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className={cn("font-display font-bold text-4xl", vibeInfo.color)}>
            {displayScore}
          </span>
          <span className="text-muted-foreground text-sm">/100</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={cn("relative w-full rounded-full overflow-hidden bg-muted", sizeClasses[size])}>
        {/* Gradient Background */}
        <div className="absolute inset-0 vibe-gradient opacity-30" />

        {/* Active Fill */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 transition-all duration-500 ease-out rounded-full",
            score <= 20 && "bg-vibe-safe glow-safe",
            score > 20 && score <= 40 && "bg-green-400",
            score > 40 && score <= 60 && "bg-vibe-caution",
            score > 60 && score <= 80 && "bg-orange-400",
            score > 80 && "bg-vibe-danger glow-danger"
          )}
          style={{ width: `${displayScore}%` }}
        />

        {/* Indicator Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-500 ease-out"
          style={{ left: `${displayScore}%`, transform: "translateX(-50%)" }}
        />
      </div>

      {/* Scale Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>LEGIT ✅</span>
        <span>NEUTRAL 🤔</span>
        <span>SUS 🚨</span>
      </div>
    </div>
  );
}
