'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StageBadge, VerificationBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ApplicationStage, Job, JobApplication } from '@/types';
import { 
  Building2, 
  Briefcase, 
  Users, 
  Plus, 
  ChevronRight, 
  Search, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function EmployerDashboardPage() {
  const { 
    currentUser, 
    jobs, 
    addJob, 
    applications, 
    updateApplicationStatus, 
    allProfiles,
    candidateSkills 
  } = useApp();

  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [inspectingApplication, setInspectingApplication] = useState<JobApplication | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  // New Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('TechCorp Global AI');
  const [jobLocation, setJobLocation] = useState('San Francisco, CA / Remote');
  const [remotePolicy, setRemotePolicy] = useState<'remote' | 'hybrid' | 'onsite'>('remote');
  const [salaryRange, setSalaryRange] = useState('$130,000 - $160,000 USD');
  const [minExpYears, setMinExpYears] = useState(3);
  const [jobDescription, setJobDescription] = useState('');
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('Python, LangChain, pgvector');
  const [preferredSkillsInput, setPreferredSkillsInput] = useState('FastAPI, Docker, TypeScript');

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  // Applications for selected job
  const jobApplications = applications.filter((a) => a.job_id === selectedJobId);

  // Stages
  const pipelineStages: ApplicationStage[] = ['Matched', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'];

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDescription.trim()) return;

    const reqSkills = requiredSkillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const prefSkills = preferredSkillsInput.split(',').map((s) => s.trim()).filter(Boolean);

    addJob({
      employer_id: currentUser.id,
      title: jobTitle,
      company_name: companyName,
      description: jobDescription,
      location: jobLocation,
      remote_policy: remotePolicy,
      employment_type: 'full-time',
      min_experience_years: Number(minExpYears),
      salary_range: salaryRange,
      eligibility_requirements: ['Eligible for full-time employment'],
      is_active: true,
      is_demo: false,
      skills: [
        ...reqSkills.map((s, i) => ({ id: `new-req-${i}`, job_id: '', skill_name: s, is_required: true, weight: 4 })),
        ...prefSkills.map((s, i) => ({ id: `new-pref-${i}`, job_id: '', skill_name: s, is_required: false, weight: 2 })),
      ],
    });

    setIsCreatingJob(false);
    setJobTitle('');
    setJobDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <Building2 className="w-4 h-4 text-blue-400" />
            Employer ATS &amp; Candidate Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recruitment Funnel &amp; Code Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Evaluate engineering applicants through verified GitHub evidence. Advance candidates through each stage of the hiring pipeline with real-time auditability.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingJob(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Job Opening
        </button>
      </div>

      {/* Job Selector Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
            Active Job Pipeline:
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 max-w-md truncate"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.company_name})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>Applicants in Pipeline: <strong>{jobApplications.length}</strong></span>
          <span>•</span>
          <span>Required Skills: <strong>{selectedJob?.skills.filter((s) => s.is_required).length}</strong></span>
        </div>
      </div>

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {pipelineStages.map((stage) => {
          const stageApps = jobApplications.filter((a) => a.status === stage);

          return (
            <div
              key={stage}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col min-h-[420px]"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  {stage}
                </span>
                <span className="w-5 h-5 rounded-full bg-white border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center">
                  {stageApps.length}
                </span>
              </div>

              {/* Applications in this stage */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageApps.map((app) => {
                  const candidate = allProfiles.find((p) => p.id === app.candidate_id);

                  return (
                    <div
                      key={app.id}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900 truncate">
                          {candidate?.full_name || 'Candidate'}
                        </div>
                        <span className="text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                          {app.match_score}%
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 truncate">
                        {candidate?.headline || 'AI Candidate'}
                      </div>

                      {/* Advance Stage Controls */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => setInspectingApplication(app)}
                          className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Inspect
                        </button>

                        {/* Stage transition forward */}
                        {stage === 'Applied' && (
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'Assessment')}
                            className="text-purple-600 hover:text-purple-800 font-bold"
                          >
                            Assess →
                          </button>
                        )}
                        {stage === 'Assessment' && (
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'Interview')}
                            className="text-amber-600 hover:text-amber-800 font-bold"
                          >
                            Interview →
                          </button>
                        )}
                        {stage === 'Interview' && (
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'Offer')}
                            className="text-emerald-600 hover:text-emerald-800 font-bold"
                          >
                            Offer →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {stageApps.length === 0 && (
                  <div className="text-center py-12 text-[11px] text-slate-400 italic">
                    No candidates in {stage}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Candidate Drawer Modal */}
      {inspectingApplication && (
        <Modal
          isOpen={Boolean(inspectingApplication)}
          onClose={() => setInspectingApplication(null)}
          title="Candidate Competency & Code Evidence Dossier"
          maxWidth="lg"
        >
          {(() => {
            const candidate = allProfiles.find((p) => p.id === inspectingApplication.candidate_id);
            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{candidate?.full_name}</h3>
                    <p className="text-xs text-slate-500">{candidate?.headline}</p>
                    <div className="text-xs text-slate-500 mt-1">
                      {candidate?.location} • {candidate?.experience_years} years experience
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Compatibility</span>
                    <div className="text-2xl font-black text-blue-600">{inspectingApplication.match_score}%</div>
                    <StageBadge stage={inspectingApplication.status} />
                  </div>
                </div>

                {/* Candidate Notes */}
                {inspectingApplication.notes && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Applicant Note
                    </h4>
                    <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                      &quot;{inspectingApplication.notes}&quot;
                    </p>
                  </div>
                )}

                {/* Verified Skills */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Verified Competencies on Record
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {candidateSkills.map((s) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {s.skill_name} ({s.verification_level})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stage Update Buttons for Employer */}
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Advance Candidate Stage
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {pipelineStages.map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          updateApplicationStatus(inspectingApplication.id, st);
                          setInspectingApplication((prev) => prev ? { ...prev, status: st } : null);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          inspectingApplication.status === st
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Create Job Opening Modal */}
      {isCreatingJob && (
        <Modal
          isOpen={isCreatingJob}
          onClose={() => setIsCreatingJob(false)}
          title="Post a New Engineering Opportunity"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Machine Learning Engineer"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Location &amp; Remote Policy
                </label>
                <select
                  value={remotePolicy}
                  onChange={(e) => setRemotePolicy(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="remote">Global Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="$140,000 - $175,000"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={requiredSkillsInput}
                  onChange={(e) => setRequiredSkillsInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Preferred Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={preferredSkillsInput}
                  onChange={(e) => setPreferredSkillsInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Job Description &amp; Responsibilities
              </label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Describe role scope, architecture challenges, and team expectations..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingJob(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm"
              >
                Publish Job Opening
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
