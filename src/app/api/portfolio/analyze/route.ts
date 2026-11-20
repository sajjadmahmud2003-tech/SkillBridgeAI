import { NextRequest, NextResponse } from 'next/server';
import { analyzeRepository, validateGitHubUrl } from '@/lib/portfolio';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, githubToken, geminiApiKey } = body;

    if (!url) {
      return NextResponse.json({ error: 'GitHub repository or profile URL is required.' }, { status: 400 });
    }

    const validation = validateGitHubUrl(url);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const analysis = await analyzeRepository(url, githubToken, geminiApiKey);
    return NextResponse.json(analysis);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An error occurred during portfolio analysis.' },
      { status: 500 }
    );
  }
}
