'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RAGCareerResponse } from '@/types';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  ExternalLink, 
  Target, 
  FileCheck2, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export default function CareerAdvisorPage() {
  const { currentUser, candidateSkills } = useApp();
  const [selectedTargetRole, setSelectedTargetRole] = useState(
    currentUser.target_roles[0] || 'Junior AI Engineer'
  );
  const [question, setQuestion] = useState(
    'What skills am I missing to transition from my current full-stack background into a Junior AI Engineer role?'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [adviceResult, setAdviceResult] = useState<RAGCareerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleQuestions = [
    'What skills am I missing to transition into a Junior AI Engineer role?',
    'Which portfolio projects should I build next to demonstrate vector search competency?',
    'How do my verified skills align with O*NET occupational standards for AI programmers?',
    'What curated learning resources should I prioritize this quarter?',
  ];

  const handleAsk = async (customPrompt?: string) => {
    const q = customPrompt || question;
    if (!q.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/career/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          targetRole: selectedTargetRole,
          candidateSkills,
          experienceYears: currentUser.experience_years,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate career advice.');
      }

      setAdviceResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during career guidance generation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Sparkles className="w-4 h-4 text-purple-600" />
          RAG-Grounded Career Intelligence
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          AI Career Advisor &amp; Transition Architect
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Ask questions about your career trajectory, skill gaps, or next portfolio project. Every answer is grounded in vector-retrieved occupational standards and curated curriculum documents.
        </p>
      </div>

      {/* Target Role & Prompt Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Target Role Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Select Target Career Track
            </label>
            <p className="text-xs text-slate-500">The advisor tailors all vector retrievals to your selected target role.</p>
          </div>
          <select
            value={selectedTargetRole}
            onChange={(e) => setSelectedTargetRole(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Junior AI Engineer">Junior AI Engineer (RAG &amp; LLM Systems)</option>
            <option value="Full-Stack AI Application Engineer">Full-Stack AI Application Engineer</option>
            <option value="Senior Machine Learning Systems Engineer">Senior Machine Learning Systems Engineer</option>
            <option value="Computer Vision Specialist">Computer Vision Specialist</option>
            <option value="MLOps &amp; Infrastructure Engineer">MLOps &amp; Infrastructure Engineer</option>
          </select>
        </div>

        {/* Input Question Area */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Your Question to the Advisor
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about technical prerequisites, missing skills, or architecture blueprints..."
              className="w-full p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              onClick={() => handleAsk()}
              disabled={isLoading || !question.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-700 shadow-md shadow-purple-500/20 disabled:opacity-50 transition-all self-end sm:self-auto"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Retrieving Sources &amp; Synthesizing...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Generate Grounded Career Advice
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div>
          <span className="text-xs text-slate-500 font-medium block mb-2">Example questions:</span>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuestion(sq);
                  handleAsk(sq);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100/80 transition-colors text-left"
              >
                &quot;{sq}&quot;
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* RAG Results Output */}
      {adviceResult && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-300">
          {/* Header Tag */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Synthesis for {selectedTargetRole}
              </span>
            </div>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✓ Grounded in Verified Vector Documents
            </span>
          </div>

          {/* Main Answer Narrative */}
          <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-line bg-slate-50/60 p-6 rounded-xl border border-slate-200">
            {adviceResult.answer}
          </div>

          {/* Identified Missing Skills */}
          {adviceResult.missing_skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-600" />
                Identified Missing Competencies for {selectedTargetRole}
              </h3>
              <div className="flex flex-wrap gap-2">
                {adviceResult.missing_skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200"
                  >
                    • {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Projects Grid */}
          {adviceResult.recommended_projects.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-purple-600" />
                Recommended Projects to Prove Missing Capabilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adviceResult.recommended_projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                        {proj.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200">
                      {proj.skills_demonstrated.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Citations Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              Retrieved Grounding Sources &amp; Citations ({adviceResult.citations.length})
            </h3>
            <div className="space-y-2">
              {adviceResult.citations.map((cite) => (
                <div
                  key={cite.source_id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{cite.title}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {cite.source_type}
                      </span>
                    </div>
                    <div className="text-slate-500 italic text-[11px]">
                      &quot;{cite.relevant_excerpt}&quot;
                    </div>
                  </div>

                  {cite.url && (
                    <a
                      href={cite.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold shrink-0"
                    >
                      Inspect Source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
