import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface MatchGlowCardProps {
  reason: string;
  className?: string;
}

export function MatchGlowCard({ reason, className }: MatchGlowCardProps) {
  return (
    <div className={cn("match-glow-outer", className)}>
      <div className="match-glow-dot" />
      <div className="match-glow-card px-4 py-3.5">
        <div className="match-glow-ray" />
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
              Why it's a match
            </span>
          </div>
          <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">{reason}</p>
        </div>
        <div className="match-glow-line topl" />
        <div className="match-glow-line leftl" />
        <div className="match-glow-line bottoml" />
        <div className="match-glow-line rightl" />
      </div>
    </div>
  );
}
