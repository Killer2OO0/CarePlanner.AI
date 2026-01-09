'use server';
import { z } from 'zod';
import { ai } from '@/lib/ai';
import { Patient, LogEntry, Article } from '@/lib/models';

const PlanSchema = z.object({
    plan: z.object({
        message: z.string(),
        tasks: z.array(z.object({
            task: z.string(),
            time: z.string()
        })),
        targets: z.object({
            glucose_min: z.number().optional(),
            glucose_max: z.number().optional(),
            bp_systolic_max: z.number().optional(),
            weight_target: z.number().optional()
        }),
        citations: z.array(z.object({
            id: z.number(),
            title: z.string(),
            category: z.string(),
            summary: z.string(),
            content: z.string()
        })).optional()
    }),
    trends: z.object({
        insight: z.string(),
        stats: z.object({
            tir: z.number().optional(),
            bp_control: z.number().optional(),
            streak: z.number().optional()
        })
    })
});

/**
 * Generates a personalized health plan based on patient data and logs.
 */
export async function generateAIPlan(
    patient: Patient,
    logs: LogEntry[],
    articles: Article[],
    language: string = "English"
) {
    try {
        const prompt = `
      You are an expert Medical AI Assistant.
      
      Patient Profile:
      - Name: ${patient.name}
      - Age: ${patient.age}
      - Condition: ${patient.condition}
      - Medications: ${patient.medications.join(", ")}
      
      Recent Vitals Logs (Last 7 days):
      ${JSON.stringify(logs.slice(0, 20))} 
      
      Available Guidelines (Articles):
      ${JSON.stringify(articles.map(a => ({ id: a.id, title: a.title, summary: a.summary })))}
      
      Task:
      - Analyze the logs.
      - Generate a daily plan with specific tasks.
      - Determine the targets.
      - Provide a trend insight.
      - Select RELEVANT articles as citations if applicable.

      CRITICAL SAFETY RULES:
      - If Glucose > 250 mg/dL OR BP > 180/120:
        - YOU MUST ADD A TASK: "Contact Clinician IMMEDIATELY".
        - The Insight MUST start with "WARNING: CRITICAL VITALS DETECTED."
      
      LANGUAGE REQUIREMENT:
      - Perform all analysis in English but OUTPUT the final JSON content (message, tasks, insight) in ${language}.
      
      Return ONLY a JSON object matching this schema:
      {
        "plan": {
          "message": "encouraging message with specific insight",
          "tasks": [{ "task": "Task Name", "time": "HH:MM AM/PM" }],
          "targets": { "glucose_min": number, "glucose_max": number },
          "citations": [ { ...article object... } ]
        },
        "trends": {
          "insight": "trend analysis",
          "stats": { "tir": number (0-100), "bp_control": number (0-100), "streak": number }
        }
      }
    `;
        // @ts-expect-error 
        const { output } = await ai.generate({
            prompt: prompt,
            output: { schema: PlanSchema }
        });

        return output;
    } catch (error) {
        console.error("AI Generation Failed:", error);
        return null;
    }
}

const FactsSchema = z.object({
    facts: z.array(z.object({
        id: z.number().optional(), // AI might not generate unique IDs well, we can assign index
        title: z.string(),
        content: z.string(),
        tags: z.array(z.string())
    }))
});

export async function generateHealthFacts(
    patient: any,
    language: string,
    offset: number
) {
    try {
        const prompt = `
      You are a Medical Knowledge Assistant.
      
      Patient: ${patient.name}, ${patient.age} years old.
      Condition: ${patient.condition}.
      
      Task:
      - Generate 5 distinct, interesting, and scientifically accurate health facts or tips relevant to the patient's condition.
      - Ensure they are diverse (Nutrition, Exercise, Mental Health, Medical).
      - REQUIRED LANGUAGE: ${language}.
      - This is page ${offset} of facts. Ensure variety.

      Return ONLY a JSON object:
      {
        "facts": [
          { "title": "Fact Title", "content": "1-2 sentence fact", "tags": ["Tag1", "Tag2"] }
        ]
      }
    `;
        // @ts-expect-error 
        const response = await ai.generate({
            prompt: prompt,
            output: { schema: FactsSchema }
        });

        const output = response.output;

        if (!output || !output.facts) return [];

        if (!output || !output.facts) return [];

        // Assign unique IDs to facts
        return output.facts.map((f: { title: string; content: string; tags: string[] }, i: number) => ({
            ...f,
            id: offset * 10 + i
        }));
    } catch (error) {
        console.error("AI Facts Generation Failed:", error);
        return [];
    }
}

const ArticlesSchema = z.object({
    articles: z.array(z.object({
        title: z.string(),
        category: z.string(),
        summary: z.string(),
        content: z.string()
    }))
});

export async function generateNewArticles(
    condition: string,
    existingTitles: string[],
    language: string
) {
    try {
        const prompt = `
      You are a Medical Content Writer.
      
      Topic: "${condition}" Management and Lifestyle.
      Language: ${language}.
      
      Task:
      - Write 3 detailed educational articles for a patient.
      - Topics should be unique and NOT cover these existing titles: ${existingTitles.join(", ")}.
      - Categories examples: Nutrition, Mental Health, Medication, Exercise, Complications.
      
      Return ONLY a JSON object:
      {
        "articles": [
          { 
            "title": "Clear Title", 
            "category": "Category", 
            "summary": "Short 2 sentence summary", 
            "content": "Detailed content paragraph (approx 100 words)." 
          }
        ]
      }
    `;
        // @ts-expect-error 
        const response = await ai.generate({
            prompt: prompt,
            output: { schema: ArticlesSchema }
        });

        const output = response.output;

        if (!output || !output.articles) return [];
        return output.articles;
    } catch (error) {
        console.error("AI Article Generation Failed:", error);
        return [];
    }
}

const ChatResponseSchema = z.object({
    response: z.string()
});

export async function chatWithHealthAssistant(
    message: string,
    history: { role: string, content: string }[],
    patientContext: { name: string, condition: string, recentLogs: LogEntry[] }
) {
    try {
        const logSummary = patientContext.recentLogs.map(l =>
            `- ${l.timestamp.split('T')[0]}: ${l.type} = ${l.value} ${l.unit}`
        ).join('\n');

        const prompt = `
      You are Dr. AI, a compassionate and knowledgeable health assistant.
      
      Patient: ${patientContext.name} (${patientContext.condition})
      Recent Vitals:
      ${logSummary}
      
      Conversation History:
      ${history.map(h => `${h.role}: ${h.content}`).join('\n')}
      
      User: ${message}
      
      Task: Answer the user's question briefly and helpfully based ONLY on their data and general medical knowledge. 
      If the values are critical, advise seeing a doctor. Keep it under 50 words unless asked for more.
      
      Return ONLY a JSON object: { "response": "Your answer here" }
    `;
        // @ts-expect-error 
        const response = await ai.generate({
            prompt: prompt,
            output: { schema: ChatResponseSchema }
        });

        return response.output?.response || "I'm having trouble thinking right now.";
    } catch (error) {
        console.error("Chatbot Error:", error);
        return "Sorry, I couldn't process that. Please try again.";
    }
}
