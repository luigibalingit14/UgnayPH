"use client";

import { Example } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

interface ExampleCardProps {
  example: Example;
  onClick: (example: Example) => void;
  selected?: boolean;
}

export function ExampleCard({ example, onClick, selected }: ExampleCardProps) {
  const categoryConfig = {
    fake: {
      icon: AlertTriangle,
      color: "text-vibe-danger",
      bgColor: "bg-vibe-danger/10",
      borderColor: "border-vibe-danger/30",
      badge: "destructive" as const,
    },
    real: {
      icon: CheckCircle,
      color: "text-vibe-safe",
      bgColor: "bg-vibe-safe/10",
      borderColor: "border-vibe-safe/30",
      badge: "success" as const,
    },
    scam: {
      icon: ShieldAlert,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      badge: "warning" as const,
    },
  };

  const config = categoryConfig[example.category];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 hover:-translate-y-1 glass-card border-[0.5px]",
        selected
          ? "ring-1 ring-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] bg-white/10"
          : "hover:bg-white/10 box-shadow-none",
        config.borderColor
      )}
      onClick={() => onClick(example)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(example);
        }
      }}
      aria-label={`Select example: ${example.title}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg", config.bgColor)}>
            <Icon className={cn("h-5 w-5", config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="font-semibold text-sm truncate">{example.title}</h4>
              <Badge variant={config.badge} className="text-xs">
                {example.category.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {example.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ExampleGridProps {
  examples: Example[];
  onSelect: (example: Example) => void;
  selectedId?: string;
}

export function ExampleGrid({ examples, onSelect, selectedId }: ExampleGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {examples.map((example) => (
        <ExampleCard
          key={example.id}
          example={example}
          onClick={onSelect}
          selected={selectedId === example.id}
        />
      ))}
    </div>
  );
}
