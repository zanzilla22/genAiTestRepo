import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const assistantId = data.assistantId;
    const threadId = data.threadId;
    console.log(`Inside -runAssistant --> assistantId: ${assistantId}`);
    console.log(`Inside -runAssistant --> threadId: ${threadId}`);
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
    console.log(`run: ${JSON.stringify(run)}`);
    return NextResponse.json({ runId: run.id });
  } catch (error) {
    console.error(`Error in -runAssistant: ${error}`);
    return NextResponse.json({ error: 'Failed to run assistant' }, { status: 500 });
  }
}
