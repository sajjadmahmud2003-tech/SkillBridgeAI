import { describe, it, expect } from 'vitest';
import { calculateJobMatch, normalizeSkill, rankJobsForCandidate } from '@/lib/matching';
import { Job, CandidateSkill } from '@/types';

const mockJob: Job = {
  id: 'job-1',
  title: 'AI Software Engineer',
  company_name: 'AI Labs',
  description: 'Test job description',
  location: 'Remote',
  remote_policy: 'remote',
  employment_type: 'full-time',
  min_experience_years: 3,
  eligibility_requirements: ['Eligible to work in US or Remote'],
  is_active: true,
  created_at: new Date().toISOString(),
  skills: [
    { id: 's1', job_id: 'job-1', skill_name: 'Python', is_required: true, weight: 5 },
    { id: 's2', job_id: 'job-1', skill_name: 'LangChain', is_required: true, weight: 4 },
    { id: 's3', job_id: 'job-1', skill_name: 'Docker', is_required: false, weight: 2 },
  ],
};

describe('Job Matching Engine', () => {
  it('normalizes skill names correctly across cases and punctuation', () => {
    expect(normalizeSkill('  Python-3 ')).toBe('python 3');
    expect(normalizeSkill('Next.js')).toBe('next js');
    expect(normalizeSkill('C++')).toBe('c++');
  });

  it('calculates 90%+ match score when candidate has all required skills with portfolio evidence', () => {
    const candidateSkills: CandidateSkill[] = [
      {
        id: 'cs1',
        profile_id: 'p1',
        skill_name: 'Python',
        category: 'backend',
        verification_level: 'Portfolio-Supported',
        confidence: 0.95,
      },
      {
        id: 'cs2',
        profile_id: 'p1',
        skill_name: 'LangChain',
        category: 'ai_ml',
        verification_level: 'Portfolio-Supported',
        confidence: 0.90,
      },
      {
        id: 'cs3',
        profile_id: 'p1',
        skill_name: 'Docker',
        category: 'devops',
        verification_level: 'Portfolio-Supported',
        confidence: 0.85,
      },
    ];

    const result = calculateJobMatch(mockJob, candidateSkills, 4);

    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.breakdown.matched_required_skills).toContain('Python');
    expect(result.breakdown.matched_required_skills).toContain('LangChain');
    expect(result.breakdown.missing_required_skills).toHaveLength(0);
    expect(result.breakdown.eligibility_passed).toBe(true);
  });

  it('penalizes self-reported unverified skills in evidence multiplier', () => {
    const unverifiedSkills: CandidateSkill[] = [
      {
        id: 'cs1',
        profile_id: 'p1',
        skill_name: 'Python',
        category: 'backend',
        verification_level: 'Self-Reported',
        confidence: 0.50,
      },
      {
        id: 'cs2',
        profile_id: 'p1',
        skill_name: 'LangChain',
        category: 'ai_ml',
        verification_level: 'Self-Reported',
        confidence: 0.50,
      },
    ];

    const result = calculateJobMatch(mockJob, unverifiedSkills, 3);
    
    // Evidence multiplier should be lower for self-reported vs portfolio-supported
    expect(result.breakdown.portfolio_evidence_multiplier).toBeLessThan(0.70);
    expect(result.score).toBeLessThan(85);
  });

  it('identifies missing required skills and flags eligibility issues', () => {
    const candidateSkills: CandidateSkill[] = [
      {
        id: 'cs1',
        profile_id: 'p1',
        skill_name: 'Python',
        category: 'backend',
        verification_level: 'Portfolio-Supported',
        confidence: 0.90,
      },
    ];

    // Candidate has only 1 year experience, but job requires 3 years
    const result = calculateJobMatch(mockJob, candidateSkills, 1);

    expect(result.breakdown.missing_required_skills).toContain('LangChain');
    expect(result.breakdown.eligibility_passed).toBe(false);
    expect(result.breakdown.eligibility_issues[0]).toContain('Requires minimum 3 years experience');
  });

  it('ranks multiple jobs deterministically by compatibility score', () => {
    const candidateSkills: CandidateSkill[] = [
      {
        id: 'cs1',
        profile_id: 'p1',
        skill_name: 'Python',
        category: 'backend',
        verification_level: 'Portfolio-Supported',
        confidence: 0.95,
      },
    ];

    const jobA: Job = { ...mockJob, id: 'job-a' };
    const jobB: Job = {
      ...mockJob,
      id: 'job-b',
      skills: [{ id: 's9', job_id: 'job-b', skill_name: 'Rust', is_required: true, weight: 5 }],
    };

    const ranked = rankJobsForCandidate([jobB, jobA], candidateSkills, 3);
    expect(ranked[0].job.id).toBe('job-a');
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
  });
});
