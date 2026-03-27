import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export interface ValidatorResponse {
  nodeId: string;
  vote: "APPROVE" | "REJECT";
  reasoning: string;
  confidence: number;
}

export interface ConsensusResult {
  finalDecision: "APPROVE" | "REJECT" | "DISPUTE";
  validators: ValidatorResponse[];
  summary: string;
}

export async function simulateConsensus(contractLogic: string, inputData: string): Promise<ConsensusResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are simulating SafeIdentity, a decentralized AI consensus mechanism for GenLayer's Bradbury Testnet.
    SafeIdentity is an AI-Powered Decentralized Identity Validator.
    
    CORE PRINCIPLES:
    1. Optimistic Democracy: Consensus is reached optimistically unless challenged by conflicting validator outputs.
    2. Equivalence Principle: All AI outputs are structured and deterministic to ensure consistent consensus across validators.
    
    CONTRACT LOGIC (SafeIdentity Intelligent Logic):
    ${contractLogic}
    
    IDENTITY CLAIM DATA:
    ${inputData}
    
    TASK:
    Simulate 3 AI validator nodes (Node-A, Node-B, Node-C) performing "Optimistic Democracy" consensus.
    
    STRICT REQUIREMENTS:
    1. Each node MUST perform an internal AI evaluation of the identity claim.
    2. Analyze: data consistency, anomaly patterns, and fraud probability.
    3. Each node MUST have DIFFERENT confidence scores and reasoning (Node Variability).
    4. If the IDENTITY CLAIM DATA contains suspicious elements (e.g., "Shadow Network", "IP spoofing", "reputationScore < 20"), the nodes MUST reflect this in their evaluation.
    5. For suspicious data, Node-A might be more lenient (e.g., confidence 0.92 but REJECT), Node-B might be skeptical (confidence 0.65), and Node-C might be very cautious (confidence 0.58).
    6. Provide a structured "AI Evaluation" output for each node.
    
    Return the result in JSON format:
    {
      "finalDecision": "APPROVE" | "REJECT" | "DISPUTE",
      "validators": [
        { 
          "nodeId": "Node-A", 
          "vote": "APPROVE" | "REJECT", 
          "reasoning": "Overall summary of the decision...", 
          "confidence": 0.91,
          "aiEvaluation": {
            "validity_score": 0.87,
            "risk_flag": false,
            "status": "valid" | "invalid" | "suspicious",
            "riskLevel": "low" | "medium" | "high",
            "findings": ["finding 1", "finding 2"],
            "reasoning": "Detailed AI-specific interpretation of the identity claim..."
          }
        },
        ...
      ],
      "summary": "Consensus summary explaining the SafeIdentity validation outcome."
    }

    If the CONTRACT LOGIC is malformed or impossible to evaluate, return a JSON with an "error" field explaining the issue.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    
    if (parsed.error) {
      throw new Error(`Contract Logic Error: ${parsed.error}`);
    }

    if (parsed.validators) {
      parsed.validators = parsed.validators.map((v: any) => {
        let conf = Number(v.confidence);
        if (conf > 1) conf = conf / 100;
        return {
          ...v,
          confidence: conf
        };
      });
    }

    return parsed;
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error("AI Evaluation Error: The model returned an invalid response format.");
    }
    console.error("Consensus simulation failed:", error);
    throw error;
  }
}
