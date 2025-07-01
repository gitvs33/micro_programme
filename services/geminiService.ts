/// <reference types="vite/client" />

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MicroGoal, GoalCategory, AnalysisQuestion, AnalysisFeedback } from '../types';

// Ensure the API key is available from environment variables
const apiKey = import.meta.env.VITE_API_KEY;
console.log("[GeminiService] API Key fetched:", apiKey ? "Yes" : "No");
if (!apiKey) {
    console.warn("VITE_API_KEY environment variable not set. Gemini API features will be disabled, but the UI will load.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const parseJsonResponse = <T>(text: string): T => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    try {
        return JSON.parse(jsonStr) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", e, "Original text:", text);
        throw new Error("Invalid JSON response from API.");
    }
};

export async function fetchCompletionMessage(goal: MicroGoal): Promise<string> {
    if (!ai) return "Great job! (API key not set, using fallback message)";
    const prompt = `
        Generate a single, short, humorous message in Malayalam based on a task the user just completed.
        The completed task was: "${goal.text}"
        The task category was: "${goal.category}"

        - If the category is "Movement" or "Reading", be extra playful and humorous.
        - If the category is "Self-Care" or "Engagement" and the task seems very easy (like breathing or thinking), be slightly teasing and dismissive. For example: "ഓ, അത് ചെയ്തോ. എന്തായാലും എളുപ്പമായിരുന്നല്ലോ. 😑" (Oh, you did that. It was easy anyway).
        
        The tone should be like a slightly sarcastic but ultimately supportive friend. Include one or two relevant, funny emojis. The message must be in Malayalam only. Just return the message string, nothing else.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        
        const text = response.text.trim().replace(/^"|"$/g, '');
        return text || "നന്നായിട്ടുണ്ട്! 👍"; // Fallback in case of empty response
    } catch (error) {
        console.error("Error fetching completion message from Gemini:", error);
        throw new Error("Failed to fetch completion message from Gemini API.");
    }
}

export async function fetchChillQuote(): Promise<string> {
    if (!ai) return "Take a deep breath and relax! (API key not set, using fallback quote)";
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: "Give me a single, short, humorous, and light-hearted quote or a funny one-liner in Malayalam. Just the quote, no extra text, no author, and no English translation.",
        });
        
        const text = response.text.trim().replace(/^"|"$/g, ''); // Remove surrounding quotes if any
        return text;

    } catch (error) {
        console.error("Error fetching chill quote from Gemini:", error);
        throw new Error("Failed to fetch quote from Gemini API.");
    }
}

export async function fetchMicroGoal(excludeText?: string): Promise<MicroGoal> {
    if (!ai) return { text: "Stand up and stretch for 10 seconds", category: GoalCategory.Movement };
    const prompt = `
        Generate a single, tiny, almost effortless micro-goal for someone feeling overwhelmed.
        Your response MUST be a single, valid JSON object with "text" and "category" keys, and no other text or markdown.
        - "text": A string for a simple, creative goal. Avoid clichés. Can be slightly silly.
        - "category": One of "Reading", "Movement", "Self-Care", "Engagement".
        ${excludeText ? `The previous goal was "${excludeText}". Please generate a different one.` : ''}

        Example: {"text": "Look out the window and find something blue", "category": "Engagement"}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const parsed = parseJsonResponse<MicroGoal>(response.text);

        if (typeof parsed.text === 'string' && Object.values(GoalCategory).some(cat => cat === parsed.category)) {
            return parsed;
        } else {
            console.error("Invalid goal format from API:", parsed);
            throw new Error("Invalid goal format from API");
        }
    } catch (error) {
        console.error("Error fetching micro goal from Gemini:", error);
        throw new Error("Failed to generate a new goal.");
    }
}

export async function fetchUltimateTask(): Promise<MicroGoal> {
    if (!ai) return { text: "Create a 3-song playlist that represents your ideal day", category: GoalCategory.Ultimate };
    const prompt = `
        Generate a "Final Challenge" task. This is a final task for a user who has built up momentum.
        Your response MUST be a single, valid JSON object with "text" and "category" keys, and no other text or markdown.
        - "text": A fun, positive, and slightly challenging task. Focus on connection, action, or creativity.
        - "category": Must be "Ultimate".

        Example: {"text": "Create a 3-song playlist that represents your ideal day", "category": "Ultimate"}
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const parsed = parseJsonResponse<MicroGoal>(response.text);

        if (parsed.category === 'Ultimate' && typeof parsed.text === 'string') {
            return parsed;
        } else {
             throw new Error("Invalid ultimate goal format from API");
        }
    } catch (error) {
        console.error("Error fetching ultimate task from Gemini:", error);
        throw new Error("Failed to generate an ultimate task.");
    }
}

export async function fetchUltimateCompletionMessage(goal: MicroGoal): Promise<string> {
    if (!ai) return "You are absolutely AWESOME! (API key not set, using fallback message)";
    const prompt = `
        Generate a single, short, VERY enthusiastic and celebratory message in Malayalam.
        The user just completed a special 'Ultimate Task'. The completed task was: "${goal.text}".
        The tone should be extremely positive and slightly over-the-top, like they just won a championship.
        Use lots of exciting emojis like 🎉🏆✨🔥.
        The message MUST be in Malayalam only. Just return the message string, nothing else.
    `;
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        const text = response.text.trim().replace(/^"|"$/g, '');
        return text || "കിടിലം! നിങ്ങൾ ഒരു സംഭവമാണ്! 🏆🔥"; // Fallback
    } catch (error) {
        console.error("Error fetching ultimate completion message from Gemini:", error);
        throw new Error("Failed to fetch ultimate completion message.");
    }
}

export async function fetchAnalysisQuestions(): Promise<AnalysisQuestion[]> {
    if (!ai) return [
        { question: "How are you feeling today?", options: ["Great", "Okay", "Not so good", "Prefer not to say"] }
    ];
    const prompt = `
        Generate a unique and short questionnaire as a valid JSON array. The array should contain 5 to 7 objects.
        Each object is a multiple-choice question and MUST have this exact structure:
        {
          "question": "A gentle, curious question about the user's current state of mind or energy.",
          "options": ["A short, relatable answer", "Another one", "A third option", "Maybe a fourth"]
        }
        The tone of the questions should be kind and curious.
        Do not include any other text, explanations, or markdown fences. The entire response must be a single, valid JSON array of objects.

        Example of the desired output format:
        [
          {"question": "How does your 'mental weather' feel right now?", "options": ["Sunny and clear", "A bit foggy", "Gentle rain", "Stormy"]},
          {"question": "What's your physical energy like?", "options": ["Ready to go!", "Could use a coffee", "Running on fumes", "Basically a sloth"]}
        ]
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        return parseJsonResponse<AnalysisQuestion[]>(response.text);
    } catch (error) {
        console.error("Error fetching analysis questions from Gemini:", error);
        throw new Error("Failed to generate analysis questions.");
    }
}

export async function fetchAnalysisFeedback(answers: { [key: string]: string }): Promise<AnalysisFeedback> {
    if (!ai) return { humorous: "Fallback roast! (API key not set)", serious: "Fallback advice. (API key not set)" };
    const prompt = `
        A user has answered a questionnaire. Here are their answers:
        ${JSON.stringify(answers, null, 2)}

        Analyze these to provide two pieces of feedback. Your response MUST be a single, valid JSON object with "humorous" and "serious" keys, and no other text or markdown.
        - "humorous": A short, witty, funny observation in MALAYALAM. Playful, sarcastic tone. Use funny emojis.
        - "serious": A single, concise, helpful piece of advice in ENGLISH. Encouraging and actionable.

        Example:
        {
          "humorous": "എല്ലാം കൂടി ഒരു അവിയൽ പരുവം ആണല്ലോ! 😂 തല്ക്കാലം ഒരു ചായ കുടിക്ക്.",
          "serious": "It sounds like you're a bit scattered. Try to focus on one small thing for the next 10 minutes, ignoring everything else."
        }
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        return parseJsonResponse<AnalysisFeedback>(response.text);
    } catch (error) {
        console.error("Error fetching analysis feedback from Gemini:", error);
        throw new Error("Failed to generate analysis feedback.");
    }
}
