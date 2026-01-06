import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AnalysisCardProps {
  title: string;
  icon: LucideIcon;
  items?: string[];
  content?: string;
  variant?: "default" | "warning" | "info";
  className?: string;
}

export function AnalysisCard({ 
  title, 
  icon: Icon, 
  items, 
  content,
  variant = "default",
  className 
}: AnalysisCardProps) {
  const variantStyles = {
    default: "border-border/50",
    warning: "border-warning/30 bg-warning/5",
    info: "border-primary/30 bg-primary/5",
  };

  return (
    <div className={cn(
      "glass rounded-xl p-6 glow-border",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "p-2 rounded-lg",
          variant === "warning" ? "bg-warning/10" : variant === "info" ? "bg-primary/10" : "bg-secondary"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            variant === "warning" ? "text-warning" : variant === "info" ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>

      {content && (
        <p className="text-secondary-foreground leading-relaxed">{content}</p>
      )}

      {items && items.length > 0 && (
        <ul className="space-y-2.5">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className={cn(
                "mt-2 w-1.5 h-1.5 rounded-full shrink-0",
                variant === "warning" ? "bg-warning" : variant === "info" ? "bg-primary" : "bg-muted-foreground"
              )} />
              <span className="text-secondary-foreground leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {items && items.length === 0 && (
        <p className="text-muted-foreground italic">No items identified</p>
      )}
    </div>
  );
}
