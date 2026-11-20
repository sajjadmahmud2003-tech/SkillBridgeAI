import { NextResponse } from 'next/server';
import { DEMO_JOBS, DEMO_APPLICATIONS, DEMO_CANDIDATE_SKILLS } from '@/lib/demo-data';

export async function GET() {
  try {
    // Pipeline counts
    const stageCounts: Record<string, number> = {
      Matched: 0,
      Applied: 0,
      Assessment: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    for (const app of DEMO_APPLICATIONS) {
      if (stageCounts[app.status] !== undefined) {
        stageCounts[app.status]++;
      }
    }

    // Skill distribution
    const skillCounts: Record<string, number> = {};
    for (const skill of DEMO_CANDIDATE_SKILLS) {
      skillCounts[skill.skill_name] = (skillCounts[skill.skill_name] || 0) + 1;
    }

    // Required skills in jobs (Market Demand)
    const demandCounts: Record<string, number> = {};
    for (const job of DEMO_JOBS) {
      for (const skill of job.skills) {
        demandCounts[skill.skill_name] = (demandCounts[skill.skill_name] || 0) + (skill.is_required ? 2 : 1);
      }
    }

    return NextResponse.json({
      total_jobs: DEMO_JOBS.length,
      total_applications: DEMO_APPLICATIONS.length,
      stage_distribution: Object.entries(stageCounts).map(([stage, count]) => ({ stage, count })),
      skill_demand: Object.entries(demandCounts).map(([name, demand]) => ({
        skill: name,
        demand,
        supply: skillCounts[name] || 0,
      })),
      average_match_score: 87.5,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error generating analytics.' },
      { status: 500 }
    );
  }
}
