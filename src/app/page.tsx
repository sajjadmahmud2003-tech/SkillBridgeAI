'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Code2, 
  Target, 
  Compass, 
  BookOpen, 
  Building2, 
  CheckCircle2, 
  BarChart, 
  Zap, 
  Search,
  ExternalLink
} from 'lucide-react';
import { calculateJobMatch } from '@/lib/matching';
import { DEMO_JOBS } from '@/lib/demo-data';
import { CandidateSkill } from '@/types';

export default function LandingPage() {
  // Interactive Live Matching Preview on Landing Page
  const [selectedSkillNames, setSelectedSkillNames] = useState<string[]>(['Python', 'LangChain', 'TypeScript']);
  const availableSkills = ['Python', 'LangChain', 'Vector Databases (pgvector)', 'FastAPI', 'React', 'TypeScript', 'PyTorch', 'Docker', 'Kubernetes'];

  const toggleSkill = (skill: string) => {
    setSelectedSkillNames((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Convert to candidate skills for the interactive preview
  const previewSkills: CandidateSkill[] = selectedSkillNames.map((name, i) => ({
    id: `prev-${i}`,
    profile_id: 'preview',
    skill_name: name,
    category: 'ai_ml',
    verification_level: 'Portfolio-Supported',
    confidence: 0.92,
  }));

  const sampleJob = DEMO_JOBS[0]; // Junior AI Engineer
  const previewMatch = calculateJobMatch(sampleJob, previewSkills, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 bg-gradient-to-b from-white via-slate-50/60 to-slate-100 border-b border-slate-200">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>Next-Gen Global Talent Verification Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Connecting verified AI talent with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">global employers</span>.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Replace subjective resumes with objective portfolio code evidence. Discover global opportunities with explainable matching formulas and receive personalized, RAG-grounded career roadmaps.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/analyzer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                <Code2 className="w-4 h-4" />
                Analyze Public GitHub Repo
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-800 font-semibold text-sm border border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all"
              >
                <Compass className="w-4 h-4 text-slate-500" />
                Browse Verified Roles
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                No keyword resume hacks
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Deterministic transparent scoring
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                RAG guidance with source citations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Match Simulator Preview */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Explainable Technology</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">See Deterministic Job Matching in Action</h2>
            <p className="text-slate-600 text-sm mt-2">
              Select technical skills to see how our weighted algorithm scores candidate compatibility against real job requirements in real-time.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {/* Skill Selector Chips */}
            <div className="mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 block">
                Select Your Demonstrated Portfolio Skills:
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => {
                  const isSelected = selectedSkillNames.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Job Card Result */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Target Job Match</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">{sampleJob.title}</h3>
                  <div className="text-xs text-slate-500 mt-1">{sampleJob.company_name} • {sampleJob.location}</div>
                </div>

                {/* Score Pill */}
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 self-start sm:self-auto">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium">Explainable Score</div>
                    <div className="text-2xl font-black text-blue-600">{previewMatch.score}%</div>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-blue-600 flex items-center justify-center font-bold text-xs text-blue-700 bg-blue-50">
                    {previewMatch.score >= 80 ? 'HIGH' : previewMatch.score >= 50 ? 'MED' : 'LOW'}
                  </div>
                </div>
              </div>

              {/* Match Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Matched Required Skills ({previewMatch.breakdown.matched_required_skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {previewMatch.breakdown.matched_required_skills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                        {s}
                      </span>
                    ))}
                    {previewMatch.breakdown.matched_required_skills.length === 0 && (
                      <span className="text-xs text-slate-400 italic">None yet selected.</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-600" />
                    Missing Required Skills ({previewMatch.breakdown.missing_required_skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {previewMatch.breakdown.missing_required_skills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
                        {s}
                      </span>
                    ))}
                    {previewMatch.breakdown.missing_required_skills.length === 0 && (
                      <span className="text-xs text-emerald-600 font-medium">All required skills met!</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <strong>Algorithm Assessment: </strong>
                {previewMatch.breakdown.explanation}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Why SkillBridge AI</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">Engineered For Objective Technical Hiring</h2>
            <p className="text-slate-600 text-sm mt-2">
              Replacing exaggerated resumes with verifiable code, transparent algorithms, and actionable guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. GitHub Portfolio Evidence</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our analyzer connects safely to public GitHub repositories to inspect architectures, frameworks, and implementations. Skills are strictly categorized as Portfolio-Supported or Self-Reported.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-blue-600 font-semibold">
                <Link href="/analyzer" className="hover:underline flex items-center gap-1">
                  Try the Analyzer <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Explainable Deterministic Matching</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                No opaque black-box AI screening. Match scores are mathematically computed from required skills, code evidence strength, and experience alignment. Zero bias for ethnicity or university prestige.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-indigo-600 font-semibold">
                <Link href="/jobs" className="hover:underline flex items-center gap-1">
                  Explore Global Jobs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. RAG-Based Career Guidance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Personalized advice powered by vector search across O*NET occupational standards, production RAG blueprints, and curated curricula. Every factual claim is backed by explicit source citations.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-purple-600 font-semibold">
                <Link href="/advisor" className="hover:underline flex items-center gap-1">
                  Consult the Advisor <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate vs Employer Split */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Candidate Box */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-8 sm:p-10 border border-blue-100">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Candidate Benefits</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-4">Level the Playing Field with Proof</h3>
              <ul className="space-y-3.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Turn your GitHub repositories into verified, employer-visible competency credentials.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Receive an exact breakdown of skills missing for your target roles.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Actionable project recommendations that teach you what hiring managers actually look for.</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Candidate Portal
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Employer Box */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 sm:p-10 border border-slate-700 shadow-xl">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Employer Benefits</span>
              <h3 className="text-2xl font-bold text-white mt-2 mb-4">Cut Through Resume Inflation</h3>
              <ul className="space-y-3.5 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Review pre-validated codebase evidence before spending engineering hours on screenings.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Full recruitment ATS pipeline (Matched, Applied, Assessment, Interview, Offer).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Define weighted technical requirements and receive deterministic candidate rankings.</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/employer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold text-xs hover:bg-blue-600 transition-colors shadow-sm"
                >
                  Employer ATS Portal
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to verify your engineering capabilities?</h2>
          <p className="mt-4 text-base text-blue-100 max-w-2xl mx-auto">
            Run your first GitHub repository through our evidence analyzer in under 10 seconds.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/analyzer"
              className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 shadow-lg transition-transform hover:scale-105"
            >
              Start Free Analysis
            </Link>
            <Link
              href="/jobs"
              className="px-6 py-3 rounded-xl bg-blue-800 text-white font-bold text-sm hover:bg-blue-900 border border-blue-500/50 transition-colors"
            >
              Browse Roles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
