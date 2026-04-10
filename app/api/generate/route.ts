import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export const dynamic = 'force-dynamic';


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { topic, tone, length } = await req.json();
  const lengthMap: any = { short: '100-150', medium: '200-300', long: '400-500' };
  const words = lengthMap[length] || '200-300';

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a LinkedIn content expert. Write engaging, professional LinkedIn posts that drive engagement. Always use relevant emojis, line breaks for readability, and end with 3-5 relevant hashtags.`,
      },
      {
        role: 'user',
        content: `Write a ${tone} LinkedIn post about: ${topic}. Target length: ${words} words. Make it authentic, insightful, and shareable.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 600,
  });

  const text = completion.choices[0].message.content;
  return NextResponse.json({ text });
}
