import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  console.log('CREATE THREAD started');
  if (req.method === 'POST') {
    try {
      const data = await req.json();
      const inputMessage = data.inputmessage;

      // Überprüfen, ob die Eingabemessage vorhanden und ein String ist
      if (!inputMessage || typeof inputMessage !== 'string') {
        throw new Error('inputmessage is missing or not a string');
      }

      // Thread erstellen
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: inputMessage,
          },
        ],
      });
      const threadId = thread.id;
      console.log('Thread ID:', threadId);

      return NextResponse.json({ threadId });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error: (error as Error).message });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' });
  }
}