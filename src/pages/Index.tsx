import { useState } from "react";
import { DecisionForm } from "@/components/DecisionForm";
import { DecisionReport } from "@/components/DecisionReport";
import { LoadingState } from "@/components/LoadingState";
import { DecisionAnalysis } from "@/types/decision";
import { useToast } from "@/hooks/use-toast";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (decision: string, context: string) => {
    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ decision, context }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Analysis failed");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to analyze decision. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Activity className="w-4 h-4" />
            Executive Decision Analysis
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Decision Trace <span className="text-gradient">Engine</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Expose reasoning quality, surface hidden biases, and identify blind spots in your decision-making process.
          </p>
        </header>

        {/* Main Content */}
        <main>
          {analysis ? (
            <div className="space-y-8">
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Analyze Another Decision
                </Button>
              </div>
              <DecisionReport analysis={analysis} />
            </div>
          ) : isLoading ? (
            <LoadingState />
          ) : (
            <DecisionForm onSubmit={handleAnalyze} isLoading={isLoading} />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <p>Decision Trace Engine • Structured Decision Analysis</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
