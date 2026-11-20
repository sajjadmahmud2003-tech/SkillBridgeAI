'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DEMO_JOBS } from '@/lib/demo-data';
import { 
  BookOpen, 
  Target, 
  CheckCircle2, 
  Clock, 
  Star, 
  ExternalLink, 
  AlertCircle, 
  Sparkles, 
  Check, 
  Layers,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function LearningRoadmapPage() {
  const { 
    currentUser, 
    candidateSkills, 
    learningResources, 
    learningProgress, 
    updateLearningStatus 
  } = useApp();

  const [selectedTargetTrack, setSelectedTargetTrack] = useState<string>(
    currentUser.target_roles[0] || 'Junior AI Engineer'
  );

  // Derive target job skills
  const benchmarkJob = DEMO_JOBS[0]; // Nexus AI Labs Junior AI Engineer
  const candidateSkillNames = new Set(
    candidateSkills
      .filter((s) => s.verification_level !== 'Self-Reported')
      .map((s) => s.skill_name.toLowerCase())
  );

  // Group skills into Acquired vs High Priority Gaps vs Nice to Have
  const requiredSkills = benchmarkJob.skills.filter((s) => s.is_required);
  const preferredSkills = benchmarkJob.skills.filter((s) => !s.is_required);

  const acquiredSkills: string[] = [];
  const highPriorityGaps: string[] = [];
  const mediumPriorityGaps: string[] = [];

  for (const s of requiredSkills) {
    if (candidateSkillNames.has(s.skill_name.toLowerCase())) {
      acquiredSkills.push(s.skill_name);
    } else {
      highPriorityGaps.push(s.skill_name);
    }
  }

  for (const s of preferredSkills) {
    if (candidateSkillNames.has(s.skill_name.toLowerCase())) {
      acquiredSkills.push(s.skill_name);
    } else {
      mediumPriorityGaps.push(s.skill_name);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          Competency Transition Roadmap
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Skill Gap Analysis &amp; Learning Pathway
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Track your progress towards benchmark engineering roles. Close verified capability gaps through targeted curricula and portfolio evidence projects.
        </p>
      </div>

      {/* Target Track Selector Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Target Role Roadmap</span>
          <h2 className="text-2xl font-bold">{selectedTargetTrack}</h2>
          <p className="text-xs text-slate-300">
            Benchmarked against active enterprise hiring requirements at Nexus AI and Synthetix.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gap Coverage</div>
            <div className="text-2xl font-black text-emerald-400">
              {Math.round((acquiredSkills.length / Math.max(1, requiredSkills.length + preferredSkills.length)) * 100)}%
            </div>
          </div>
          <div className="text-xs text-slate-400">
            <div>{acquiredSkills.length} Verified</div>
            <div>{highPriorityGaps.length} Critical Gaps</div>
          </div>
        </div>
      </div>

      {/* Skill Gap Priority Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Acquired Skills */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Competencies ({acquiredSkills.length})
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Demonstrated
            </span>
          </div>
          <div className="space-y-2">
            {acquiredSkills.map((s) => (
              <div key={s} className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 flex items-center justify-between">
                <span>{s}</span>
                <span className="text-[10px] text-emerald-600 font-bold">✓ Evidence Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* High Priority Gaps */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              High-Priority Gaps ({highPriorityGaps.length})
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
              Required
            </span>
          </div>
          <div className="space-y-2">
            {highPriorityGaps.map((s) => (
              <div key={s} className="p-2.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200 flex items-center justify-between">
                <span>{s}</span>
                <span className="text-[10px] text-amber-700 font-semibold">Mandatory</span>
              </div>
            ))}
            {highPriorityGaps.length === 0 && (
              <div className="text-xs text-emerald-600 font-medium p-2">
                All mandatory skills demonstrated!
              </div>
            )}
          </div>
        </div>

        {/* Medium Priority Gaps */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              Secondary Competencies ({mediumPriorityGaps.length})
            </h3>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
              Preferred
            </span>
          </div>
          <div className="space-y-2">
            {mediumPriorityGaps.map((s) => (
              <div key={s} className="p-2.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200 flex items-center justify-between">
                <span>{s}</span>
                <span className="text-[10px] text-blue-600 font-semibold">Bonus</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curated Learning Resources with Interactive Tracking */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Curated Learning Resources to Close Gaps
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified courseware and tutorials aligned with target roles. Mark your progress as you complete each curriculum.
          </p>
        </div>

        <div className="space-y-4">
          {learningResources.map((resource) => {
            const currentStatus = learningProgress[resource.id] || 'not_started';

            return (
              <div
                key={resource.id}
                className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-bold text-slate-900 text-sm">{resource.title}</h4>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded capitalize">
                      {resource.difficulty}
                    </span>
                    {resource.is_free && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Free
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-4">
                    <span className="font-medium text-slate-700">{resource.provider}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {resource.duration_hours} hours
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-current" /> {resource.rating} rating
                    </span>
                  </div>

                  {/* Skills Covered */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {resource.skills_covered.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] text-slate-600 font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status Selector & External Link */}
                <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                  <select
                    value={currentStatus}
                    onChange={(e) => updateLearningStatus(resource.id, e.target.value as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      currentStatus === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : currentStatus === 'in_progress'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed ✓</option>
                  </select>

                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                    title="Open course in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
