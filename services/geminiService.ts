
import { GoogleGenAI, Type } from "@google/genai";
import { RubricCriterion, ValidationResponse } from "../types";

export const validateGrading = async (
  criterion: RubricCriterion,
  submissionText: string,
  score: number,
  justification: string
): Promise<ValidationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const prompt = `
    You are an expert academic grading assistant. 
    Review the following:
    - RUBRIC CRITERION: ${criterion.name} (${criterion.description}). Max Points: ${criterion.maxPoints}.
    - STUDENT SUBMISSION: "${submissionText}"
    - PROFESSOR'S GRADE: ${score}/${criterion.maxPoints}
    - PROFESSOR'S JUSTIFICATION: "${justification}"

    Evaluate if the professor's justification and score are supported by the student's text based on the rubric.
    Return your evaluation in JSON format with:
    1. "status": "Supported" (fully aligns), "Partially Supported" (some evidence but flaws), or "Not Supported" (justification contradicts text or lacks any evidence).
    2. "reason": A 1-sentence explanation of why you chose this status.
    3. "excerpt": A short snippet from the student submission that supports or contradicts the grading.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            reason: { type: Type.STRING },
            excerpt: { type: Type.STRING }
          },
          required: ["status", "reason"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      status: data.status as any || "Partially Supported",
      reason: data.reason || "Validation check complete.",
      excerpt: data.excerpt
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      status: "Partially Supported",
      reason: "An error occurred during AI validation."
    };
  }
};

export const validateComment = async (
  selection: string,
  feedback: string
): Promise<{ guidance: string; status: 'Validated' | 'Challenged' }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const prompt = `
    Context: A professor is providing feedback on a specific selection from a student's paper.
    TEXT SELECTION: "${selection}"
    PROFESSOR'S FEEDBACK: "${feedback}"

    Your Task: Evaluate if the feedback is accurate and helpful based on the selection.
    Return your evaluation in JSON format with:
    1. "status": "Validated" (if feedback is accurate/helpful) or "Challenged" (if feedback is potentially unfair, inaccurate, or vague).
    2. "guidance": A 1-sentence response to the professor. If Validated, reinforce why. If Challenged, provide a better suggestion.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            guidance: { type: Type.STRING }
          },
          required: ["status", "guidance"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      status: data.status as any || "Validated",
      guidance: data.guidance || "Feedback logged."
    };
  } catch (error) {
    console.error("Gemini Comment Error:", error);
    return {
      status: "Validated",
      guidance: "Unable to reach AI for guidance, but feedback is saved."
    };
  }
};
