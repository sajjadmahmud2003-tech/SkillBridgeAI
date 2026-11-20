'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { calculateJobMatch } from '@/lib/matching';
import { RemoteBadge, VerificationBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Job, MatchResult, RemotePolicy } from '@/types';
import { 
  Compass, 
  Search, 
  Filter, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  DollarSign, 
  Clock, 
  Briefcase,
  Check,
  Send,
  ExternalLink
} from 'lucide-react';

export default function JobsPage() {
  const { 
    jobs, 
    candidateSkills, 
    currentUser, 
    savedJobIds, 
    toggleSaveJob, 
    applications, 
    submitApplication 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRemote, setSelectedRemote] = useState<string>('all');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [inspectingJobMatch, setInspectingJobMatch] = useState<MatchResult | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [applicationNotes, setApplicationNotes] = useState('');

  // Extract all unique skills across jobs for filtering
  const allJobSkills = Array.from(
    new Set(jobs.flatMap((j) => j.skills.map((s) => s.skill_name)))
  ).sort();

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRemote = 
      selectedRemote === 'all' || job.remote_policy === selectedRemote;

    const matchesSkill = 
      selectedSkillFilter === 'all' || 
      job.skills.some((s) => s.skill_name.toLowerCase() === selectedSkillFilter.toLowerCase());

    return matchesSearch && matchesRemote && matchesSkill;
  });

  // Calculate matches for all filtered jobs
  const matchedJobsList: MatchResult[] = filteredJobs.map((job) =>
    calculateJobMatch(job, candidateSkills, currentUser.experience_years)
  ).sort((a, b) => b.score - a.score);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;
    submitApplication(applyingJob.id, applicationNotes);
    setApplyingJob(null);
    setApplicationNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Compass className="w-4 h-4 text-blue-600" />
          Global AI Talent Marketplace
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Explore AI &amp; Software Engineering Opportunities
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Verified roles from frontier tech teams. Scores are calculated transparently based on your portfolio evidence and required skills.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company, or keyword (e.g. RAG, PyTorch, LangChain)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50/50"
            />
          </div>

          {/* Remote Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedRemote}
              onChange={(e) => setSelectedRemote(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="all">All Locations</option>
              <option value="remote">Global Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="all">Filter by Skill (All)</option>
              {allJobSkills.map((sk) => (
                <option key={sk} value={sk}>{sk}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing <strong>{matchedJobsList.length}</strong> matching positions</span>
          {currentUser.role === 'candidate' && (
            <span className="text-blue-600 font-medium">
              Ranked dynamically for {currentUser.full_name} ({currentUser.experience_years} yrs exp)
            </span>
          )}
        </div>
      </div>

      {/* Jobs Grid / List */}
      <div className="space-y-4">
        {matchedJobsList.map(({ job, score, breakdown }) => {
          const isSaved = savedJobIds.includes(job.id);
          const application = applications.find(
            (a) => a.job_id === job.id && a.candidate_id === currentUser.id
          );
          const hasApplied = Boolean(application);

          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                    <RemoteBadge policy={job.remote_policy} />
                    {job.is_demo && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold border border-slate-200">
                        Demo Role
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{job.company_name}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-800">{job.salary_range}</span>
                    <span>•</span>
                    <span>Min {job.min_experience_years} years exp</span>
                  </div>
                </div>

                {/* Match Score & Actions */}
                <div className="flex items-center gap-4 self-start lg:self-auto">
                  {/* Score Pill */}
                  <button
                    onClick={() => setInspectingJobMatch({ job, score, breakdown })}
                    className="flex items-center gap-2.5 bg-blue-50/70 hover:bg-blue-100/70 px-4 py-2 rounded-xl border border-blue-200 transition-colors text-left"
                    title="Click to see explainable score formula breakdown"
                  >
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        Match Score
                      </div>
                      <div className="text-2xl font-black text-blue-700 leading-none">
                        {score}%
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      i
                    </div>
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isSaved
                        ? 'bg-purple-50 border-purple-300 text-purple-600'
                        : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                    aria-label={isSaved ? 'Unsave job' : 'Save job'}
                  >
                    <Bookmark className="w-5 h-5 fill-current" />
                  </button>

                  {/* Apply Button */}
                  <button
                    onClick={() => setApplyingJob(job)}
                    disabled={hasApplied}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                      hasApplied
                        ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {hasApplied ? `Applied (${application?.status})` : 'Apply Now'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {job.description}
              </p>

              {/* Skills breakdown chip list */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-400 font-medium mr-1">Required:</span>
                  {job.skills.filter((s) => s.is_required).map((s) => {
                    const isMatched = breakdown.matched_required_skills.includes(s.skill_name);
                    return (
                      <span
                        key={s.id}
                        className={`px-2 py-0.5 rounded font-medium ${
                          isMatched
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {isMatched ? '✓ ' : ''}{s.skill_name}
                      </span>
                    );
                  })}
                </div>

                <button
                  onClick={() => setInspectingJobMatch({ job, score, breakdown })}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Inspect Score Details →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Match Breakdown Modal */}
      {inspectingJobMatch && (
        <Modal
          isOpen={Boolean(inspectingJobMatch)}
          onClose={() => setInspectingJobMatch(null)}
          title={`Match Analysis: ${inspectingJobMatch.job.title}`}
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Score Banner */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Deterministic Match</span>
                <div className="text-3xl font-black text-blue-900">{inspectingJobMatch.score} / 100</div>
              </div>
              <div className="text-right text-xs text-slate-600">
                <div>Employer: <strong>{inspectingJobMatch.job.company_name}</strong></div>
                <div>Location: {inspectingJobMatch.job.location}</div>
              </div>
            </div>

            {/* Formula Explanation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Scoring Formula Breakdown
              </h4>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono space-y-1 text-slate-700">
                <div>• Required Skills Weight: 55% (Match Ratio: {inspectingJobMatch.breakdown.required_skills_match_ratio})</div>
                <div>• Portfolio Evidence Weight: 25% (Multiplier: {inspectingJobMatch.breakdown.portfolio_evidence_multiplier})</div>
                <div>• Preferred Skills Weight: 15% (Match Ratio: {inspectingJobMatch.breakdown.preferred_skills_match_ratio})</div>
                <div>• Experience Alignment Weight: 5% (Score: {inspectingJobMatch.breakdown.experience_alignment_score})</div>
              </div>
            </div>

            {/* Assessment Narrative */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong>Assessment: </strong>
              {inspectingJobMatch.breakdown.explanation}
            </div>

            {/* Matched vs Missing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Demonstrated Competencies ({inspectingJobMatch.breakdown.matched_required_skills.length})
                </h5>
                <div className="space-y-1">
                  {inspectingJobMatch.breakdown.matched_required_skills.map((s) => (
                    <div key={s} className="p-2 rounded bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 font-medium">
                      ✓ {s}
                    </div>
                  ))}
                  {inspectingJobMatch.breakdown.matched_required_skills.length === 0 && (
                    <div className="text-xs text-slate-400 italic">No required skills demonstrated yet.</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Identified Skill Gaps ({inspectingJobMatch.breakdown.missing_required_skills.length})
                </h5>
                <div className="space-y-1">
                  {inspectingJobMatch.breakdown.missing_required_skills.map((s) => (
                    <div key={s} className="p-2 rounded bg-amber-50 text-amber-800 text-xs border border-amber-200 font-medium">
                      • {s}
                    </div>
                  ))}
                  {inspectingJobMatch.breakdown.missing_required_skills.length === 0 && (
                    <div className="text-xs text-emerald-600 font-medium">Full required skill coverage!</div>
                  )}
                </div>
              </div>
            </div>

            {/* Mandatory Eligibility */}
            <div className="pt-4 border-t border-slate-200">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Mandatory Eligibility Status
              </h5>
              {inspectingJobMatch.breakdown.eligibility_passed ? (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Candidate meets all mandatory experience and work authorization baselines.
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-amber-50 text-amber-800 text-xs border border-amber-200 space-y-1">
                  <div className="font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    Eligibility Discrepancy:
                  </div>
                  {inspectingJobMatch.breakdown.eligibility_issues.map((issue, idx) => (
                    <div key={idx} className="text-amber-700 pl-6">• {issue}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Apply Submission Modal */}
      {applyingJob && (
        <Modal
          isOpen={Boolean(applyingJob)}
          onClose={() => setApplyingJob(null)}
          title={`Apply to ${applyingJob.title}`}
          maxWidth="md"
        >
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div>Company: <strong>{applyingJob.company_name}</strong></div>
              <div>Location: <strong>{applyingJob.location}</strong></div>
              <div className="text-slate-500 pt-1">
                Your verified GitHub portfolio evidence and skill credentials will be transmitted directly to the hiring squad.
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Application Note / Introduction (Optional)
              </label>
              <textarea
                rows={3}
                value={applicationNotes}
                onChange={(e) => setApplicationNotes(e.target.value)}
                placeholder="Highlight specific relevant projects or open-source accomplishments..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setApplyingJob(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Application
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
