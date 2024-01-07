import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });



  export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
      try {
          const {assistantModel, assistantDescription, fileIds } = await req.json();
  
          // Log the fileIds
          console.log('File IDs:', fileIds);
  
          if (!assistantModel || !assistantDescription) {
              throw new Error('Missing required assistant parameters');
          }
  
          const assistantOptions: any = {
              instructions: assistantDescription,
              model: assistantModel,
              tools: [{ "type": "retrieval" }],
          };
          if (fileIds) {
              assistantOptions.file_ids = fileIds;
          }
  
          // Log the assistantOptions
          console.log('Assistant Options:', assistantOptions);
  
          const assistant = await openai.beta.assistants.create(assistantOptions);
          const assistantId = assistant.id;
  
          return NextResponse.json({ 
              message: 'Assistant created successfully', 
              assistantId: assistantId 
          });
      } catch (error) {
          if (error instanceof Error) {
              console.error('Error:', error);
              return NextResponse.json({ error: error.message });
          } else {
              console.error('Unknown error:', error);
              return NextResponse.json({ error: 'An unknown error occurred' });
          }
      }
    } else {
      return NextResponse.json({ error: 'Method Not Allowed' });
    }
  };