import jsPDF from "jspdf";
import { DecisionAnalysis } from "@/types/decision";

export function generateDecisionPDF(analysis: DecisionAnalysis): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;

  // Helper function to add text with word wrap
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 6): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  // Helper function to check page break
  const checkPageBreak = (requiredSpace: number): void => {
    if (yPos + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 80, 80);
  doc.text("Decision Trace Report", margin, yPos);
  yPos += 12;

  // Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, yPos);
  yPos += 15;

  // Metrics bar
  doc.setFillColor(240, 245, 245);
  doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, "F");
  
  // Confidence Score
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("Confidence Score:", margin + 5, yPos + 10);
  doc.setFont("helvetica", "normal");
  
  const scoreColor = analysis.confidence_score >= 70 
    ? [34, 139, 34] // green
    : analysis.confidence_score >= 40 
      ? [218, 165, 32] // gold
      : [178, 34, 34]; // red
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(`${analysis.confidence_score}/100`, margin + 50, yPos + 10);
  
  // Risk Level
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "bold");
  doc.text("Risk Level:", margin + 80, yPos + 10);
  doc.setFont("helvetica", "normal");
  
  const riskColor = analysis.risk_level === "Low" 
    ? [34, 139, 34] 
    : analysis.risk_level === "Medium" 
      ? [218, 165, 32] 
      : [178, 34, 34];
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(analysis.risk_level, margin + 110, yPos + 10);
  
  yPos += 35;

  // Section helper
  const addSection = (title: string, items: string[] | string, iconColor: number[] = [20, 80, 80]) => {
    checkPageBreak(30);
    
    // Section header
    doc.setFillColor(iconColor[0], iconColor[1], iconColor[2]);
    doc.circle(margin + 3, yPos + 3, 3, "F");
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(title, margin + 10, yPos + 5);
    yPos += 12;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    
    if (typeof items === "string") {
      yPos = addWrappedText(items, margin, yPos, contentWidth);
      yPos += 5;
    } else if (items.length > 0) {
      items.forEach((item) => {
        checkPageBreak(15);
        doc.text("•", margin + 2, yPos);
        yPos = addWrappedText(item, margin + 8, yPos, contentWidth - 8);
        yPos += 2;
      });
    } else {
      doc.setTextColor(150, 150, 150);
      doc.text("No items identified", margin, yPos);
      yPos += 6;
    }
    
    yPos += 8;
  };

  // Add sections
  addSection("Decision Summary", analysis.decision_summary, [20, 100, 100]);
  addSection("Assumptions", analysis.assumptions, [100, 100, 100]);
  addSection("Hidden Cognitive Biases", analysis.hidden_biases, [180, 120, 40]);
  addSection("Missing Information", analysis.missing_information, [100, 100, 100]);
  addSection("Alternative Decision Paths", analysis.alternative_decision_paths, [20, 100, 100]);

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Decision Trace Engine • Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Save
  const fileName = `decision-trace-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
