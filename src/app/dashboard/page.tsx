'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { rankJobsForCandidate } from '@/lib/matching';
import { VerificationBadge, StageBadge, RemoteBadge } from '@/components/ui/Badge';
import { 
  Sparkles, 
  Code2, 
  Compass, 
  Target, 
  BookOpen, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Briefcase, 
  FileText,
  Clock,
  Layers
} from 'lucide-react';

export default function CandidateDashboard() {
  const { 
    currentUser, 
    candidateSkills, 
    jobs, 
    applications, 
    savedJobIds, 
    portfolioAnalyses 
  } = useApp();

  // Rank jobs for current user
  const rankedJobs = rankJobsForCandidate(jobs, candidateSkills, currentUser.experience_years);
  const topRecommendedJobs = rankedJobs.slice(0, 3);

  // Group candidate skills into verified vs self-reported
  const verifiedSkills = candidateSkills.filter((s) => s.verification_level !== 'Self-Reported');
  const selfReportedSkills = candidateSkills.filter((s) => s.verification_level === 'Self-Reported');

  // Candidate applications
  const userApplications = applications.filter((a) => a.candidate_id === currentUser.id);

  // Profile completion calculation
  let completionScore = 40;
  if (currentUser.bio) completionScore += 15;
  if (currentUser.github_url) completionScore += 15;
  if (verifiedSkills.length > 0) completionScore += 20;
  if (portfolioAnalyses.length > 0) completionScore += 10;
  completionScore = Math.min(100, completionScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Verified Candidate Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.full_name}
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              {currentUser.headline || 'Connecting your verified codebase artifacts with global hiring teams.'}
            </p>
          </div>

          {/* Profile Completion Bar */}
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300">Profile Readiness</span>
              <span className="text-blue-400 font-bold">{completionScore}%</span>
            </div>
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{verifiedSkills.length} Verified Skills</span>
              <Link href="/profile" className="text-blue-400 hover:underline">Edit Profile →</Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800 text-center sm:text-left">
          <div className="p-3 rounded-lg bg-slate-800/40">
            <div className="text-2xl font-black text-white">{verifiedSkills.length}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Verified Skills</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/40">
            <div className="text-2xl font-black text-blue-400">{userApplications.length}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Active Applications</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/40">
            <div className="text-2xl font-black text-purple-400">{savedJobIds.length}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Saved Roles</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/40">
            <div className="text-2xl font-black text-emerald-400">{portfolioAnalyses.length}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Code Repos Analyzed</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recommended Jobs & Application Pipeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Matches Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Top Matched Roles for You
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ranked by our deterministic matching formula against your verified skills.
                </p>
              </div>
              <Link 
                href="/jobs" 
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View All ({jobs.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {topRecommendedJobs.map(({ job, score, breakdown }) => (
                <div 
                  key={job.id} 
                  className="p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                        <RemoteBadge policy={job.remote_policy} />
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span className="font-medium text-slate-700">{job.company_name}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span className="text-slate-700 font-semibold">{job.salary_range}</span>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex items-center gap-2.5 self-start sm:self-auto bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Match</div>
                        <div className="text-xl font-extrabold text-blue-600 leading-none">{score}%</div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        score >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {score >= 85 ? '✓' : '•'}
                      </div>
                    </div>
                  </div>

                  {/* Skills tags preview */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-xs text-slate-400 font-medium mr-1">Matched:</span>
                      {breakdown.matched_required_skills.slice(0, 3).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                          {s}
                        </span>
                      ))}
                      {breakdown.missing_required_skills.length > 0 && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                          Gap: {breakdown.missing_required_skills[0]}
                        </span>
                      )}
                    </div>

                    <Link
                      href="/jobs"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Inspect Match →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Application Pipeline Overview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  Your Active Applications ({userApplications.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track your progression across all hiring stages.
                </p>
              </div>
            </div>

            {userApplications.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No active applications yet. Browse the marketplace to submit your first application.
              </div>
            ) : (
              <div className="space-y-3">
                {userApplications.map((app) => {
                  const job = jobs.find((j) => j.id === app.job_id);
                  return (
                    <div 
                      key={app.id}
                      className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 text-sm">{job?.title || 'Job Application'}</div>
                        <div className="text-xs text-slate-500">{job?.company_name} • Applied on {new Date(app.created_at).toLocaleDateString()}</div>
                        {app.notes && (
                          <div className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-200 mt-1">
                            &quot;{app.notes}&quot;
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <StageBadge stage={app.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Demonstrated Skills & RAG Career Roadmap Alert */}
        <div className="space-y-8">
          {/* Skill Breakdown Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-600" />
                Demonstrated Skills
              </h2>
              <Link href="/analyzer" className="text-xs font-semibold text-blue-600 hover:underline">
                + Analyze
              </Link>
            </div>

            {/* Verified Skills */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Portfolio-Supported ({verifiedSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {verifiedSkills.map((s) => (
                  <div 
                    key={s.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    <span>{s.skill_name}</span>
                    <span className="text-[10px] bg-blue-200/80 text-blue-800 px-1 rounded font-bold">
                      {Math.round(s.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Self-Reported Skills */}
            {selfReportedSkills.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  Self-Reported (Unverified)
                </div>
                <div className="flex flex-wrap gap-2">
                  {selfReportedSkills.map((s) => (
                    <div 
                      key={s.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200"
                    >
                      <span>{s.skill_name}</span>
                      <span className="text-[10px] text-amber-600 font-medium">Pending Proof</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <strong>Verification Standard: </strong>
              Skills marked as Portfolio-Supported contain confirmed code implementations parsed by our GitHub analyzer.
            </div>
          </div>

          {/* AI Career Advisor Prompt Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-2xl p-6 shadow-md border border-indigo-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-bold text-base text-white">AI Career Advisor (RAG)</h3>
              <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                Receive grounded advice citing O*NET occupational benchmarks and production RAG guides to close your skill gaps.
              </p>
            </div>

            <Link
              href="/advisor"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition-colors shadow-md"
            >
              Ask Career Advisor
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Learning Roadmap Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Target Learning Path
              </h3>
              <Link href="/roadmap" className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            <p className="text-xs text-slate-600">
              Prioritized resources to bridge your transition into <strong>{currentUser.target_roles[0] || 'Junior AI Engineer'}</strong>.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-800">LangChain for LLM Development</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Completed</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-800">Deep Learning Specialization</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
