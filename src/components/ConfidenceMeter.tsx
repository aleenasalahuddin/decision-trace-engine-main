import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
  score: number;
}

export function ConfidenceMeter({ score }: ConfidenceMeterProps) {
  const getScoreColor = () => {
    if (score >= 70) return "from-success to-success/70";
    if (score >= 40) return "from-warning to-warning/70";
    return "from-destructive to-destructive/70";
  };

  const getScoreLabel = () => {
    if (score >= 70) return "High Confidence";
    if (score >= 40) return "Moderate Confidence";
    return "Low Confidence";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-4xl font-bold text-foreground tabular-nums">{score}</span>
        <span className="text-sm text-muted-foreground">{getScoreLabel()}</span>
      </div>
      
      <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-all duration-1000 ease-out",
            getScoreColor()
          )}
          style={{ width: `${score}%` }}
        />
        <div 
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white/20 to-transparent"
          style={{ width: `${score}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}
