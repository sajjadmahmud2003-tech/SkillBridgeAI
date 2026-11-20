'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  CandidateSkill, 
  Job, 
  JobApplication, 
  LearningResource, 
  LearningProgress,
  PortfolioAnalysis,
  ApplicationStage 
} from '@/types';
import { 
  DEMO_PROFILES, 
  DEMO_CANDIDATE_SKILLS, 
  DEMO_JOBS, 
  DEMO_APPLICATIONS, 
  DEMO_LEARNING_RESOURCES,
  DEMO_PORTFOLIO_ANALYSIS 
} from '@/lib/demo-data';

interface AppContextType {
  currentUser: UserProfile;
  allProfiles: UserProfile[];
  setCurrentUser: (user: UserProfile) => void;
  switchUserRole: (role: 'candidate' | 'employer') => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;

  // Skills
  candidateSkills: CandidateSkill[];
  addCandidateSkill: (skill: Omit<CandidateSkill, 'id'>) => void;
  removeCandidateSkill: (id: string) => void;

  // Portfolio
  portfolioAnalyses: PortfolioAnalysis[];
  addPortfolioAnalysis: (analysis: PortfolioAnalysis) => void;

  // Jobs
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'created_at'>) => void;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;

  // Applications
  applications: JobApplication[];
  submitApplication: (jobId: string, notes?: string) => void;
  updateApplicationStatus: (applicationId: string, newStatus: ApplicationStage) => boolean;

  // Learning Progress
  learningResources: LearningResource[];
  learningProgress: Record<string, 'not_started' | 'in_progress' | 'completed'>;
  updateLearningStatus: (resourceId: string, status: 'not_started' | 'in_progress' | 'completed') => void;

  // Profile update
  updateCurrentUser: (updated: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(DEMO_PROFILES);
  const [currentUser, setCurrentUserState] = useState<UserProfile>(DEMO_PROFILES[0]); // Alex Chen
  const [candidateSkills, setCandidateSkills] = useState<CandidateSkill[]>(DEMO_CANDIDATE_SKILLS);
  const [portfolioAnalyses, setPortfolioAnalyses] = useState<PortfolioAnalysis[]>([DEMO_PORTFOLIO_ANALYSIS]);
  const [jobs, setJobs] = useState<Job[]>(DEMO_JOBS);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['10000000-0000-0000-0000-000000000001']);
  const [applications, setApplications] = useState<JobApplication[]>(DEMO_APPLICATIONS);
  const [learningResources] = useState<LearningResource[]>(DEMO_LEARNING_RESOURCES);
  const [learningProgress, setLearningProgress] = useState<Record<string, 'not_started' | 'in_progress' | 'completed'>>({
    '30000000-0000-0000-0000-000000000002': 'completed',
    '30000000-0000-0000-0000-000000000001': 'in_progress',
  });

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('sb_current_user');
      if (savedUser) setCurrentUserState(JSON.parse(savedUser));
      
      const savedSkills = localStorage.getItem('sb_skills');
      if (savedSkills) setCandidateSkills(JSON.parse(savedSkills));

      const savedApps = localStorage.getItem('sb_applications');
      if (savedApps) setApplications(JSON.parse(savedApps));

      const savedJobsData = localStorage.getItem('sb_jobs');
      if (savedJobsData) setJobs(JSON.parse(savedJobsData));
    } catch {
      // LocalStorage unavailable in SSR or sandbox
    }
  }, []);

  const setCurrentUser = (user: UserProfile) => {
    setCurrentUserState(user);
    try {
      localStorage.setItem('sb_current_user', JSON.stringify(user));
    } catch {}
  };

  const switchUserRole = (role: 'candidate' | 'employer') => {
    if (role === 'employer') {
      const employer = allProfiles.find((p) => p.role === 'employer') || DEMO_PROFILES[3];
      setCurrentUser(employer);
    } else {
      const candidate = allProfiles.find((p) => p.role === 'candidate') || DEMO_PROFILES[0];
      setCurrentUser(candidate);
    }
  };

  const updateCurrentUser = (updated: Partial<UserProfile>) => {
    const updatedUser = { ...currentUser, ...updated, updated_at: new Date().toISOString() };
    setCurrentUser(updatedUser);
    setAllProfiles((prev) => prev.map((p) => (p.id === updatedUser.id ? updatedUser : p)));
  };

  const addCandidateSkill = (skill: Omit<CandidateSkill, 'id'>) => {
    const newSkill: CandidateSkill = {
      ...skill,
      id: `sk-${Date.now()}`,
    };
    const updated = [...candidateSkills, newSkill];
    setCandidateSkills(updated);
    try {
      localStorage.setItem('sb_skills', JSON.stringify(updated));
    } catch {}
  };

  const removeCandidateSkill = (id: string) => {
    const updated = candidateSkills.filter((s) => s.id !== id);
    setCandidateSkills(updated);
    try {
      localStorage.setItem('sb_skills', JSON.stringify(updated));
    } catch {}
  };

  const addPortfolioAnalysis = (analysis: PortfolioAnalysis) => {
    setPortfolioAnalyses((prev) => [analysis, ...prev]);

    // Automatically incorporate discovered skills into profile
    const existingSkillNames = new Set(candidateSkills.map((s) => s.skill_name.toLowerCase()));
    const newSkillsToAdd: CandidateSkill[] = [];

    for (const ev of analysis.evidence) {
      if (!existingSkillNames.has(ev.skill_name.toLowerCase())) {
        existingSkillNames.add(ev.skill_name.toLowerCase());
        newSkillsToAdd.push({
          id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          profile_id: currentUser.id,
          skill_name: ev.skill_name,
          category: (['frontend', 'backend', 'ai_ml', 'devops', 'database', 'general'].includes(ev.category)
            ? ev.category
            : 'general') as CandidateSkill['category'],
          verification_level: ev.verification_level,
          confidence: ev.confidence,
          verified_at: new Date().toISOString(),
          evidence_count: 1,
        });
      }
    }

    if (newSkillsToAdd.length > 0) {
      const merged = [...candidateSkills, ...newSkillsToAdd];
      setCandidateSkills(merged);
      try {
        localStorage.setItem('sb_skills', JSON.stringify(merged));
      } catch {}
    }
  };

  const addJob = (newJobData: Omit<Job, 'id' | 'created_at'>) => {
    const createdJob: Job = {
      ...newJobData,
      id: `job-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [createdJob, ...jobs];
    setJobs(updated);
    try {
      localStorage.setItem('sb_jobs', JSON.stringify(updated));
    } catch {}
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const submitApplication = (jobId: string, notes?: string) => {
    const existing = applications.find(
      (a) => a.job_id === jobId && a.candidate_id === currentUser.id
    );
    if (existing) return;

    const targetJob = jobs.find((j) => j.id === jobId);
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      job_id: jobId,
      candidate_id: currentUser.id,
      status: 'Applied',
      match_score: 85,
      notes: notes || 'Direct application through SkillBridge AI portal.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      job: targetJob,
      candidate: currentUser,
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    try {
      localStorage.setItem('sb_applications', JSON.stringify(updated));
    } catch {}
  };

  const updateApplicationStatus = (applicationId: string, newStatus: ApplicationStage): boolean => {
    const appIndex = applications.findIndex((a) => a.id === applicationId);
    if (appIndex === -1) return false;

    const currentApp = applications[appIndex];
    // Backend validation boundary: Candidates can only withdraw or advance matched to applied
    if (currentUser.role === 'candidate') {
      if (newStatus !== 'Withdrawn' && !(currentApp.status === 'Matched' && newStatus === 'Applied')) {
        return false;
      }
    }

    const updated = [...applications];
    updated[appIndex] = {
      ...currentApp,
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    setApplications(updated);
    try {
      localStorage.setItem('sb_applications', JSON.stringify(updated));
    } catch {}
    return true;
  };

  const updateLearningStatus = (
    resourceId: string, 
    status: 'not_started' | 'in_progress' | 'completed'
  ) => {
    setLearningProgress((prev) => ({
      ...prev,
      [resourceId]: status,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allProfiles,
        setCurrentUser,
        switchUserRole,
        isDemoMode,
        setIsDemoMode,
        candidateSkills,
        addCandidateSkill,
        removeCandidateSkill,
        portfolioAnalyses,
        addPortfolioAnalysis,
        jobs,
        addJob,
        savedJobIds,
        toggleSaveJob,
        applications,
        submitApplication,
        updateApplicationStatus,
        learningResources,
        learningProgress,
        updateLearningStatus,
        updateCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
