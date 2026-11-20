'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { validateGitHubUrl, PortfolioAnalysisOutput } from '@/lib/portfolio';
import { VerificationBadge } from '@/components/ui/Badge';
import { 
  Code2, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode2, 
  Star, 
  GitFork, 
  ExternalLink,
  PlusCircle,
  Check
} from 'lucide-react';

export default function PortfolioAnalyzerPage() {
  const { currentUser, addPortfolioAnalysis, addCandidateSkill } = useApp();
  const [repoUrl, setRepoUrl] = useState('https://github.com/alexchen-dev/rag-enterprise-assistant');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PortfolioAnalysisOutput | null>(null);
  const [hasAddedToProfile, setHasAddedToProfile] = useState(false);

  const sampleRepoOptions = [
    { label: 'Alex Chen: Enterprise RAG Assistant', url: 'https://github.com/alexchen-dev/rag-enterprise-assistant' },
    { label: 'Elena Rostova: PyTorch Vision Transformer', url: 'https://github.com/erostova-ml/vit-fine-tune' },
    { label: 'Marcus Johnson: Next.js LangChain Canvas', url: 'https://github.com/marcusj-ai/nextjs-agent-canvas' },
  ];

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setHasAddedToProfile(false);

    // Client-side SSRF validation
    const target = validateGitHubUrl(repoUrl);
    if (!target.isValid) {
      setError(target.error || 'Please enter a valid public GitHub URL.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/portfolio/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: repoUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze repository.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during codebase extraction.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkillsToProfile = () => {
    if (!result) return;

    // Convert output to portfolio analysis record
    const analysisRecord = {
      id: `pa-${Date.now()}`,
      profile_id: currentUser.id,
      repo_url: result.repo_url,
      repo_name: result.repo_name,
      stars: result.stars,
      language: result.language,
      summary: result.summary,
      created_at: new Date().toISOString(),
      evidence: result.skills.map((s, idx) => ({
        id: `pe-${Date.now()}-${idx}`,
        analysis_id: `pa-${Date.now()}`,
        skill_name: s.skill_name,
        evidence_quote: s.evidence_quote,
        file_path: s.file_path,
        category: s.category,
        confidence: s.confidence,
        verification_level: s.verification_level,
      })),
    };

    addPortfolioAnalysis(analysisRecord);
    setHasAddedToProfile(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Code2 className="w-4 h-4 text-blue-600" />
          Evidence-Based Code Auditor
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Portfolio Code &amp; Skill Analyzer
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Submit any public GitHub repository to extract verified technical skills backed by confirmed codebase implementations. No keyword stuffing or fake badges.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Public GitHub Repository URL
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-900 bg-slate-50/50"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Auditing Codebase...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Codebase
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Preset Chips */}
        <div className="pt-2">
          <span className="text-xs text-slate-500 font-medium mr-2">Try sample repositories:</span>
          <div className="inline-flex flex-wrap gap-2 mt-1">
            {sampleRepoOptions.map((opt) => (
              <button
                key={opt.url}
                type="button"
                onClick={() => {
                  setRepoUrl(opt.url);
                  setError(null);
                }}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <strong className="font-bold">Analysis Warning: </strong>
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-300">
          {/* Header Summary */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{result.repo_name}</h2>
                <a
                  href={result.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-xs text-blue-600 hover:underline gap-1"
                >
                  View on GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                {result.summary}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
                  Primary: <strong>{result.language}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  {result.stars} Stars
                </span>
                {result.is_fallback && (
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    Demo Extractor Active
                  </span>
                )}
              </div>
            </div>

            {/* Save to Profile Action */}
            <div className="self-start md:self-auto">
              <button
                onClick={handleAddSkillsToProfile}
                disabled={hasAddedToProfile}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                  hasAddedToProfile
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {hasAddedToProfile ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    Saved to Your Profile
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Add Verified Skills to My Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Extracted Evidence List */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Extracted Competencies &amp; Code Evidence ({result.skills.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.skills.map((skill, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm">{skill.skill_name}</span>
                      <VerificationBadge 
                        level={skill.verification_level} 
                        confidence={skill.confidence} 
                      />
                    </div>
                    <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                      &quot;{skill.evidence_quote}&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                    <span className="font-mono text-slate-600">{skill.file_path}</span>
                    <span className="capitalize font-medium text-slate-500">{skill.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong>Honest Verification Notice: </strong>
            SkillBridge AI inspects real codebase syntax, package definitions, and architectural documentation. Commit count, stars, and self-written README marketing alone are never treated as proof of engineering proficiency.
          </div>
        </div>
      )}
    </div>
  );
}
