import { NextRequest, NextResponse } from 'next/server';
import { generateCareerAdvice } from '@/lib/rag';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, targetRole, candidateSkills, experienceYears, geminiApiKey } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    const advice = await generateCareerAdvice({
      question,
      targetRole: targetRole || 'Junior AI Engineer',
      candidateSkills: Array.isArray(candidateSkills) ? candidateSkills : [],
      candidateExperienceYears: Number(experienceYears) || 2,
      geminiApiKey,
    });

    return NextResponse.json(advice);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An error occurred during career advice generation.' },
      { status: 500 }
    );
  }
}
