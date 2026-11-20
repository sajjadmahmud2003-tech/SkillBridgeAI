import { Job, CandidateSkill, MatchResult, MatchBreakdown, VerificationLevel } from '@/types';

/**
 * Normalizes a skill string for case-insensitive and punctuation-tolerant matching.
 */
export function normalizeSkill(skill: string): string {
  return skill
    .toLowerCase()
    .trim()
    .replace(/[-_.]/g, ' ')
    .replace(/\s+/g, ' ');
}

export interface MatchingWeights {
  requiredWeight: number;    // default 0.55
  evidenceWeight: number;    // default 0.25
  preferredWeight: number;   // default 0.15
  experienceWeight: number;  // default 0.05
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  requiredWeight: 0.55,
  evidenceWeight: 0.25,
  preferredWeight: 0.15,
  experienceWeight: 0.05,
};

/**
 * Calculates a deterministic, explainable compatibility score between a candidate and a job.
 * 
 * Formula:
 * Raw Score = (RequiredRatio * 0.55) + (EvidenceMultiplier * 0.25) + (PreferredRatio * 0.15) + (ExperienceScore * 0.05)
 * Final Normalized Score = Math.round(RawScore * 100)
 */
export function calculateJobMatch(
  job: Job,
  candidateSkills: CandidateSkill[],
  candidateExperienceYears: number = 0,
  weights: MatchingWeights = DEFAULT_WEIGHTS
): MatchResult {
  const candidateSkillMap = new Map<string, CandidateSkill>();
  for (const sk of candidateSkills) {
    candidateSkillMap.set(normalizeSkill(sk.skill_name), sk);
  }

  const requiredJobSkills = job.skills.filter((s) => s.is_required);
  const preferredJobSkills = job.skills.filter((s) => !s.is_required);

  const matchedRequired: string[] = [];
  const missingRequired: string[] = [];
  let totalRequiredWeight = 0;
  let earnedRequiredWeight = 0;

  for (const req of requiredJobSkills) {
    const norm = normalizeSkill(req.skill_name);
    const weight = req.weight || 1;
    totalRequiredWeight += weight;

    if (candidateSkillMap.has(norm)) {
      matchedRequired.push(req.skill_name);
      earnedRequiredWeight += weight;
    } else {
      missingRequired.push(req.skill_name);
    }
  }

  const requiredRatio = totalRequiredWeight > 0 
    ? earnedRequiredWeight / totalRequiredWeight 
    : 1.0;

  const matchedPreferred: string[] = [];
  const missingPreferred: string[] = [];
  let totalPreferredWeight = 0;
  let earnedPreferredWeight = 0;

  for (const pref of preferredJobSkills) {
    const norm = normalizeSkill(pref.skill_name);
    const weight = pref.weight || 1;
    totalPreferredWeight += weight;

    if (candidateSkillMap.has(norm)) {
      matchedPreferred.push(pref.skill_name);
      earnedPreferredWeight += weight;
    } else {
      missingPreferred.push(pref.skill_name);
    }
  }

  const preferredRatio = totalPreferredWeight > 0 
    ? earnedPreferredWeight / totalPreferredWeight 
    : 1.0;

  // Calculate portfolio evidence multiplier
  // Skills verified through code portfolio get full verification weight; self-reported get partial
  let evidenceSum = 0;
  let evaluatedSkillCount = 0;
  const evidenceDetails: MatchBreakdown['evidence_details'] = [];

  for (const matchedSkillName of [...matchedRequired, ...matchedPreferred]) {
    const norm = normalizeSkill(matchedSkillName);
    const candidateSkill = candidateSkillMap.get(norm);
    if (!candidateSkill) continue;

    evaluatedSkillCount++;
    let skillEvidenceScore = 0.40; // baseline for self-reported

    if (candidateSkill.verification_level === 'Independently Verified') {
      skillEvidenceScore = 1.00;
    } else if (candidateSkill.verification_level === 'Portfolio-Supported') {
      skillEvidenceScore = Math.min(1.0, 0.70 + (candidateSkill.confidence * 0.30));
    } else {
      skillEvidenceScore = Math.max(0.20, candidateSkill.confidence * 0.50);
    }

    evidenceSum += skillEvidenceScore;

    evidenceDetails.push({
      skill: candidateSkill.skill_name,
      quote: candidateSkill.verification_level === 'Portfolio-Supported'
        ? `Supported by analyzed codebase repositories (Confidence: ${Math.round(candidateSkill.confidence * 100)}%)`
        : 'Self-reported by candidate (No automated code verification found)',
      source: candidateSkill.verification_level === 'Portfolio-Supported' ? 'GitHub Analysis' : 'Candidate Profile',
      level: candidateSkill.verification_level,
    });
  }

  const evidenceMultiplier = evaluatedSkillCount > 0 
    ? evidenceSum / evaluatedSkillCount 
    : 0.30;

  // Experience alignment calculation
  const minRequiredExp = job.min_experience_years || 0;
  let experienceScore = 1.0;
  if (minRequiredExp > 0) {
    experienceScore = Math.min(1.0, candidateExperienceYears / minRequiredExp);
  }

  // Raw weighted combination
  const rawScore = 
    (requiredRatio * weights.requiredWeight) +
    (evidenceMultiplier * weights.evidenceWeight) +
    (preferredRatio * weights.preferredWeight) +
    (experienceScore * weights.experienceWeight);

  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore * 100)));

  // Separate mandatory eligibility check
  const eligibilityIssues: string[] = [];
  if (minRequiredExp > 0 && candidateExperienceYears < minRequiredExp) {
    eligibilityIssues.push(`Requires minimum ${minRequiredExp} years experience (Candidate has ${candidateExperienceYears} years)`);
  }

  const eligibilityPassed = eligibilityIssues.length === 0;

  // Human-readable explanation
  let explanation = '';
  if (requiredRatio >= 0.9 && evidenceMultiplier >= 0.8) {
    explanation = `Outstanding alignment. The candidate demonstrates ${matchedRequired.length} of ${requiredJobSkills.length} required skills, backed by strong portfolio codebase evidence.`;
  } else if (requiredRatio >= 0.7) {
    explanation = `Strong foundational match. Meets most required technical capabilities with ${missingRequired.length > 0 ? `gaps in: ${missingRequired.join(', ')}` : 'full coverage'}.`;
  } else if (requiredRatio >= 0.4) {
    explanation = `Moderate match. Candidate has partial overlap (${matchedRequired.join(', ')}), but lacks core competencies: ${missingRequired.join(', ')}.`;
  } else {
    explanation = `Low match. Significant technical skill gaps identified: ${missingRequired.join(', ')}. Recommend targeted learning roadmap.`;
  }

  return {
    job,
    score: finalScore,
    breakdown: {
      required_skills_match_ratio: Number(requiredRatio.toFixed(2)),
      portfolio_evidence_multiplier: Number(evidenceMultiplier.toFixed(2)),
      preferred_skills_match_ratio: Number(preferredRatio.toFixed(2)),
      experience_alignment_score: Number(experienceScore.toFixed(2)),
      matched_required_skills: matchedRequired,
      missing_required_skills: missingRequired,
      matched_preferred_skills: matchedPreferred,
      missing_preferred_skills: missingPreferred,
      evidence_details: evidenceDetails,
      eligibility_passed: eligibilityPassed,
      eligibility_issues: eligibilityIssues,
      explanation,
    },
  };
}

/**
 * Ranks a list of jobs for a given candidate profile and skills.
 */
export function rankJobsForCandidate(
  jobs: Job[],
  candidateSkills: CandidateSkill[],
  candidateExperienceYears: number = 0
): MatchResult[] {
  return jobs
    .map((job) => calculateJobMatch(job, candidateSkills, candidateExperienceYears))
    .sort((a, b) => b.score - a.score);
}
