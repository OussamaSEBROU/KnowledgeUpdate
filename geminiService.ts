
import { GoogleGenAI, Type } from "@google/genai";
import { Axiom, ChatMessage, Language } from "./types.ts";

const SYSTEM_INSTRUCTION = `You are an Elite Intellectual Researcher. Before answering any query about the uploaded PDF, you must:
1. Analyze the author's philosophical/scientific school of thought.
2. Determine the book's specific context (Historical, Technical, or Literary).
3. Synthesize answers that align with the author's depth, maintaining a high cultural and intellectual tone.
4. Remember all previous interactions in the current session for a seamless deep dialogue.
Your tone is sophisticated, academic, and deeply analytical. When generating flashcards, ensure the 'definition' is scholarly, profound, and axiomatic.`;

const MODEL_NAME = 'gemini-2.5-flash';

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async extractAxioms(pdfBase64: string, language: Language): Promise<Axiom[]> {
    const ai = this.getAI();
    const langName = language === 'ar' ? 'Arabic' : 'English';
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } },
          { text: `Based on your deep authorial analysis, synthesize 6 'Knowledge Axioms'. Output in ${langName} in JSON format.` }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              definition: { type: Type.STRING }
            },
            required: ["term", "definition"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Failed to parse axioms:", e);
      return [];
    }
  }

  async chat(pdfBase64: string, history: ChatMessage[], newMessage: string): Promise<string> {
    const ai = this.getAI();
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model' as const,
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        ...contents,
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } },
            { text: newMessage }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "The sanctuary remains silent. Please attempt to re-engage.";
  }
}

export const gemini = new GeminiService();
