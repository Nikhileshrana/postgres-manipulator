import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { streamText } from 'ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { connectionString, naturalLanguage } = await request.json();

    if (!naturalLanguage) {
      return NextResponse.json(
        { error: 'Natural language query is required' },
        { status: 400 }
      );
    }

    // Create a prompt that instructs the model to convert natural language to SQL
    const prompt = `
      You are an expert PostgreSQL database engineer. 
      Convert the following natural language request into a valid PostgreSQL query.
      Only return the SQL query without any explanations or markdown formatting.
      
      Natural language request: "${naturalLanguage}"
      
      PostgreSQL Query:
    `;

    // Get the Gemini model (using Gemini 2.0 Flash)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Stream the response
    const stream = await model.generateContentStream(prompt);

    // Process the stream and collect the SQL query
    let sqlQuery = '';
    for await (const chunk of stream.stream) {
      const chunkText = chunk.text();
      sqlQuery += chunkText;
    }

    // Clean up the SQL query (remove any potential markdown formatting or extra quotes)
    sqlQuery = sqlQuery.trim();
    if (sqlQuery.startsWith('```sql')) {
      sqlQuery = sqlQuery.replace(/```sql\n/, '').replace(/```$/, '').trim();
    }
    if (sqlQuery.startsWith('`') && sqlQuery.endsWith('`')) {
      sqlQuery = sqlQuery.slice(1, -1).trim();
    }

    return NextResponse.json({
      sqlQuery,
      success: true
    });
  } catch (error: any) {
    console.error('AI SQL generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}