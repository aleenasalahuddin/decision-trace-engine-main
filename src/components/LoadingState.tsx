import { Brain } from "lucide-react";

export function LoadingState() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass rounded-xl p-12 glow-border text-center space-y-6">
        <div className="relative inline-flex">
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 pulse-glow">
            <Brain className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Analyzing Decision</h3>
          <p className="text-muted-foreground">
            Examining assumptions, biases, and alternative paths...
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              style={{
                animation: "pulse 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
