import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Brain, Loader2, Sparkles } from "lucide-react";

interface DecisionFormProps {
  onSubmit: (decision: string, context: string) => void;
  isLoading: boolean;
}

export function DecisionForm({ onSubmit, isLoading }: DecisionFormProps) {
  const [decision, setDecision] = useState("");
  const [context, setContext] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (decision.trim()) {
      onSubmit(decision.trim(), context.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div className="glass rounded-xl p-8 glow-border space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Decision Input</h2>
            <p className="text-sm text-muted-foreground">Describe your decision for analysis</p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="decision" className="text-sm font-medium text-foreground">
            Describe a decision you made <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="decision"
            placeholder="e.g., I decided to accept a job offer at a startup instead of staying at my current stable corporate position..."
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="min-h-[140px]"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="context" className="text-sm font-medium text-foreground">
            Additional context <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            id="context"
            placeholder="e.g., I have 10 years of experience and a family to support..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button 
          type="submit" 
          variant="executive" 
          size="lg" 
          className="w-full"
          disabled={!decision.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Decision...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Decision Trace
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
