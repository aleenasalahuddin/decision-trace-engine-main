import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a neutral, analytical decision auditor. Your role is to critically examine human decisions and expose their reasoning quality.

Guidelines:
- Be analytical, skeptical, and concise
- Penalize overconfidence in your scoring
- Identify cognitive biases explicitly by name (e.g., confirmation bias, sunk cost fallacy, availability heuristic)
- Avoid emotional, supportive, or validating language
- Focus on gaps in reasoning, not on reassurance
- Be direct about risks and missing information

You must return ONLY valid JSON matching this exact structure:
{
  "decision_summary": "A neutral 1-2 sentence summary of the decision made",
  "assumptions": ["List of unstated assumptions underlying this decision"],
  "hidden_biases": ["List of cognitive biases that may have influenced this decision, named specifically"],
  "missing_information": ["List of critical information that was not considered or is unknown"],
  "alternative_decision_paths": ["List of alternative approaches that could have been considered"],
  "confidence_score": <number 0-100 representing how well-reasoned this decision is>,
  "risk_level": "Low | Medium | High"
}

Scoring guidelines for confidence_score:
- 0-30: Poorly reasoned, significant biases, major gaps
- 31-50: Some valid reasoning but notable weaknesses
- 51-70: Reasonably sound with moderate concerns
- 71-85: Well-reasoned with minor gaps
- 86-100: Exceptionally thorough (rare - require extraordinary evidence)

Risk level guidelines:
- Low: Decision is easily reversible, limited downside
- Medium: Moderate consequences, some reversibility
- High: Significant stakes, difficult to reverse, major potential impact

Return ONLY the JSON object, no additional text or markdown.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { decision, context } = await req.json();
    
    if (!decision || typeof decision !== "string" || decision.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Decision description is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userMessage = context 
      ? `Decision: ${decision}\n\nAdditional Context: ${context}`
      : `Decision: ${decision}`;

    console.log("Analyzing decision:", userMessage.substring(0, 100) + "...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to analyze decision" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response:", data);
      return new Response(
        JSON.stringify({ error: "Invalid response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response
    let analysis;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis result" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate the response structure
    const requiredFields = [
      "decision_summary",
      "assumptions", 
      "hidden_biases",
      "missing_information",
      "alternative_decision_paths",
      "confidence_score",
      "risk_level"
    ];

    for (const field of requiredFields) {
      if (!(field in analysis)) {
        console.error(`Missing field in analysis: ${field}`);
        return new Response(
          JSON.stringify({ error: "Incomplete analysis result" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Ensure confidence_score is within bounds
    analysis.confidence_score = Math.max(0, Math.min(100, Math.round(analysis.confidence_score)));

    // Ensure risk_level is valid
    if (!["Low", "Medium", "High"].includes(analysis.risk_level)) {
      analysis.risk_level = "Medium";
    }

    console.log("Analysis complete:", {
      confidence: analysis.confidence_score,
      risk: analysis.risk_level
    });

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-decision function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
