import { DecisionAnalysis } from "@/types/decision";
import { AnalysisCard } from "./AnalysisCard";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { RiskBadge } from "./RiskBadge";
import { Button } from "@/components/ui/button";
import { generateDecisionPDF } from "@/utils/pdfExport";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Lightbulb, 
  Brain, 
  HelpCircle, 
  GitBranch,
  Gauge,
  Shield,
  Download
} from "lucide-react";

interface DecisionReportProps {
  analysis: DecisionAnalysis;
}

export function DecisionReport({ analysis }: DecisionReportProps) {
  const { toast } = useToast();

  const handleExportPDF = () => {
    try {
      generateDecisionPDF(analysis);
      toast({
        title: "PDF Exported",
        description: "Your decision trace report has been downloaded.",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8 opacity-0 fade-in-up">
        <h2 className="text-2xl font-bold text-foreground mb-2">Decision Trace Report</h2>
        <p className="text-muted-foreground mb-4">Analysis complete • {new Date().toLocaleDateString()}</p>
        <Button 
          variant="outline" 
          onClick={handleExportPDF}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export as PDF
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid md:grid-cols-2 gap-6 opacity-0 fade-in-up stagger-1">
        <div className="glass rounded-xl p-6 glow-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Gauge className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Confidence Score</h3>
          </div>
          <ConfidenceMeter score={analysis.confidence_score} />
        </div>

        <div className="glass rounded-xl p-6 glow-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-secondary">
              <Shield className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">Risk Assessment</h3>
          </div>
          <div className="flex items-center justify-center h-[calc(100%-3rem)]">
            <RiskBadge level={analysis.risk_level} />
          </div>
        </div>
      </div>

      {/* Decision Summary */}
      <div className="opacity-0 fade-in-up stagger-2">
        <AnalysisCard
          title="Decision Summary"
          icon={FileText}
          content={analysis.decision_summary}
          variant="info"
        />
      </div>

      {/* Two Column Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="opacity-0 fade-in-up stagger-3">
          <AnalysisCard
            title="Assumptions"
            icon={Lightbulb}
            items={analysis.assumptions}
          />
        </div>

        <div className="opacity-0 fade-in-up stagger-4">
          <AnalysisCard
            title="Hidden Cognitive Biases"
            icon={Brain}
            items={analysis.hidden_biases}
            variant="warning"
          />
        </div>

        <div className="opacity-0 fade-in-up stagger-5">
          <AnalysisCard
            title="Missing Information"
            icon={HelpCircle}
            items={analysis.missing_information}
          />
        </div>

        <div className="opacity-0 fade-in-up stagger-6">
          <AnalysisCard
            title="Alternative Decision Paths"
            icon={GitBranch}
            items={analysis.alternative_decision_paths}
            variant="info"
          />
        </div>
      </div>
    </div>
  );
}
