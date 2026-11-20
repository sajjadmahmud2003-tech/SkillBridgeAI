// ====================================================================
// SKILLBRIDGE AI — COMPREHENSIVE TYPE DEFINITIONS
// ====================================================================

export type UserRole = 'candidate' | 'employer' | 'admin';

export type VerificationLevel = 'Self-Reported' | 'Portfolio-Supported' | 'Independently Verified';

export type ApplicationStage = 
  | 'Matched'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export type RemotePolicy = 'remote' | 'hybrid' | 'onsite';

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
  headline?: string;
  bio?: string;
  location?: string;
  github_url?: string;
  portfolio_url?: string;
  target_roles: string[];
  experience_years: number;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface CandidateSkill {
  id: string;
  profile_id: string;
  skill_name: string;
  category: 'frontend' | 'backend' | 'ai_ml' | 'devops' | 'database' | 'general';
  verification_level: VerificationLevel;
  confidence: number; // 0.00 to 1.00
  verified_at?: string;
  evidence_count?: number;
}

export interface PortfolioEvidence {
  id: string;
  analysis_id: string;
  skill_name: string;
  evidence_quote: string;
  file_path?: string;
  category: string;
  confidence: number;
  verification_level: VerificationLevel;
}

export interface PortfolioAnalysis {
  id: string;
  profile_id: string;
  repo_url: string;
  repo_name: string;
  stars: number;
  language?: string;
  summary: string;
  evidence: PortfolioEvidence[];
  created_at: string;
}

export interface JobSkill {
  id: string;
  job_id: string;
  skill_name: string;
  is_required: boolean;
  weight: number; // 1 to 5
}

export interface Job {
  id: string;
  employer_id?: string;
  title: string;
  company_name: string;
  company_logo?: string;
  description: string;
  location: string;
  remote_policy: RemotePolicy;
  employment_type: EmploymentType;
  min_experience_years: number;
  salary_range?: string;
  eligibility_requirements: string[];
  skills: JobSkill[];
  is_active: boolean;
  is_demo?: boolean;
  source_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface MatchBreakdown {
  required_skills_match_ratio: number;
  portfolio_evidence_multiplier: number;
  preferred_skills_match_ratio: number;
  experience_alignment_score: number;
  matched_required_skills: string[];
  missing_required_skills: string[];
  matched_preferred_skills: string[];
  missing_preferred_skills: string[];
  evidence_details: Array<{
    skill: string;
    quote: string;
    source: string;
    level: VerificationLevel;
  }>;
  eligibility_passed: boolean;
  eligibility_issues: string[];
  explanation: string;
}

export interface MatchResult {
  job: Job;
  score: number; // 0 to 100
  breakdown: MatchBreakdown;
}

export interface JobApplication {
  id: string;
  job_id: string;
  candidate_id: string;
  status: ApplicationStage;
  match_score: number;
  match_breakdown?: MatchBreakdown;
  notes?: string;
  created_at: string;
  updated_at: string;
  job?: Job;
  candidate?: UserProfile;
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
  url: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  rating: number;
  is_free: boolean;
  skills_covered: string[];
}

export interface LearningProgress {
  id: string;
  candidate_id: string;
  resource_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at?: string;
  notes?: string;
  resource?: LearningResource;
}

export interface RAGCitation {
  source_id: string;
  title: string;
  url?: string;
  source_type: string;
  relevant_excerpt: string;
}

export interface RAGCareerResponse {
  answer: string;
  missing_skills: string[];
  recommended_projects: Array<{
    title: string;
    description: string;
    skills_demonstrated: string[];
    difficulty: string;
  }>;
  learning_resources: Array<{
    title: string;
    provider: string;
    url: string;
    reason: string;
  }>;
  citations: RAGCitation[];
  grounded_in_rag: boolean;
}
