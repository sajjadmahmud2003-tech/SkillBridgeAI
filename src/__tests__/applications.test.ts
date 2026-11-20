import { describe, it, expect } from 'vitest';
import { ApplicationStage } from '@/types';

// Valid progression stages according to requirements:
// Matched -> Applied -> Assessment -> Interview -> Offer, plus Rejected and Withdrawn
const ALLOWED_STAGES: ApplicationStage[] = [
  'Matched',
  'Applied',
  'Assessment',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
];

const VALID_TRANSITIONS: Record<ApplicationStage, ApplicationStage[]> = {
  Matched: ['Applied', 'Withdrawn'],
  Applied: ['Assessment', 'Interview', 'Rejected', 'Withdrawn'],
  Assessment: ['Interview', 'Rejected', 'Withdrawn'],
  Interview: ['Offer', 'Assessment', 'Rejected', 'Withdrawn'],
  Offer: ['Withdrawn', 'Rejected'],
  Rejected: [],
  Withdrawn: [],
};

export function canTransitionStatus(
  current: ApplicationStage,
  next: ApplicationStage,
  role: 'candidate' | 'employer'
): boolean {
  if (current === next) return true;
  if (!ALLOWED_STAGES.includes(next)) return false;

  // Candidates can only Withdraw their application or move from Matched to Applied
  if (role === 'candidate') {
    if (next === 'Withdrawn') return true;
    if (current === 'Matched' && next === 'Applied') return true;
    return false;
  }

  // Employers can move through Assessment, Interview, Offer, Rejected
  if (role === 'employer') {
    if (next === 'Withdrawn') return false; // candidate prerogative
    return VALID_TRANSITIONS[current]?.includes(next) ?? false;
  }

  return false;
}

describe('Application Lifecycle & Access Boundaries', () => {
  it('allows candidate to apply from Matched stage or withdraw', () => {
    expect(canTransitionStatus('Matched', 'Applied', 'candidate')).toBe(true);
    expect(canTransitionStatus('Applied', 'Withdrawn', 'candidate')).toBe(true);
    expect(canTransitionStatus('Assessment', 'Withdrawn', 'candidate')).toBe(true);
  });

  it('prevents candidates from self-granting interviews or offers', () => {
    expect(canTransitionStatus('Applied', 'Interview', 'candidate')).toBe(false);
    expect(canTransitionStatus('Applied', 'Offer', 'candidate')).toBe(false);
  });

  it('allows employers to advance candidates through the pipeline stages', () => {
    expect(canTransitionStatus('Applied', 'Assessment', 'employer')).toBe(true);
    expect(canTransitionStatus('Assessment', 'Interview', 'employer')).toBe(true);
    expect(canTransitionStatus('Interview', 'Offer', 'employer')).toBe(true);
    expect(canTransitionStatus('Interview', 'Rejected', 'employer')).toBe(true);
  });

  it('prevents employers from marking application as Withdrawn', () => {
    expect(canTransitionStatus('Applied', 'Withdrawn', 'employer')).toBe(false);
  });
});
