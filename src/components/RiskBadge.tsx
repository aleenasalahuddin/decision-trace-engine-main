import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface RiskBadgeProps {
  level: "Low" | "Medium" | "High";
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const config = {
    Low: {
      icon: CheckCircle,
      bg: "bg-success/10 border-success/30",
      text: "text-success",
      glow: "shadow-success/20",
    },
    Medium: {
      icon: AlertTriangle,
      bg: "bg-warning/10 border-warning/30",
      text: "text-warning",
      glow: "shadow-warning/20",
    },
    High: {
      icon: XCircle,
      bg: "bg-destructive/10 border-destructive/30",
      text: "text-destructive",
      glow: "shadow-destructive/20",
    },
  };

  const { icon: Icon, bg, text, glow } = config[level];

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-lg border shadow-lg",
      bg,
      glow
    )}>
      <Icon className={cn("w-5 h-5", text)} />
      <span className={cn("font-semibold", text)}>{level} Risk</span>
    </div>
  );
}
