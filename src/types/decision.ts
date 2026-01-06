export interface DecisionAnalysis {
  decision_summary: string;
  assumptions: string[];
  hidden_biases: string[];
  missing_information: string[];
  alternative_decision_paths: string[];
  confidence_score: number;
  risk_level: "Low" | "Medium" | "High";
}

export interface DecisionInput {
  decision: string;
  context?: string;
}
