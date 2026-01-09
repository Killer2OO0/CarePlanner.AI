import { ai } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, history, context } = await req.json();

    // Optimized Prompt: Last 5 logs only
    const recentLogs = context.recentLogs.slice(0, 5).map((l: any) =>
      `${l.timestamp.split('T')[0]}: ${l.type} ${l.value}`
    ).join(', ');

    const prompt = `
      Data: ${context.name}, ${context.condition}.
      Logs: ${recentLogs}.
      History: ${history.slice(-3).map((h: any) => h.content).join(' | ')}
      User: ${message}
      
      Answer briefly as Dr. AI. Use data.
    `;

    // Generate streamed response using Genkit
    const { stream } = await ai.generateStream({
      prompt: prompt,
    });

    const encoder = new TextEncoder();

    const customStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          // Normalize chunk content from different Genkit response formats
          let text = "";

          // @ts-ignore - Dynamic check for chunk format
          if (typeof chunk.text === 'function') {
            // @ts-ignore
            text = chunk.text();
          } else if (chunk.text && typeof chunk.text === 'string') {
            text = chunk.text;
          } else if (chunk.content && Array.isArray(chunk.content)) {
            text = chunk.content.map((c: any) => c.text || "").join("");
          }

          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      }
    });

    return new Response(customStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
