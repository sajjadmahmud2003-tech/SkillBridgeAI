import { NextRequest, NextResponse } from 'next/server';
import { calculateJobMatch } from '@/lib/matching';
import { DEMO_JOBS } from '@/lib/demo-data';
import { Job, CandidateSkill } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, job: customJob, candidateSkills, experienceYears = 0 } = body;

    const targetJob: Job | undefined = customJob || DEMO_JOBS.find((j) => j.id === jobId);

    if (!targetJob) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
    }

    if (!Array.isArray(candidateSkills)) {
      return NextResponse.json({ error: 'candidateSkills must be an array.' }, { status: 400 });
    }

    const matchResult = calculateJobMatch(targetJob, candidateSkills, experienceYears);
    return NextResponse.json(matchResult);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An error occurred while calculating job match.' },
      { status: 500 }
    );
  }
}
