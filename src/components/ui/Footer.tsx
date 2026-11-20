import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                SkillBridge<span className="text-blue-500">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connecting verified AI talent with global employers through transparent portfolio evidence, deterministic matching, and RAG career intelligence.
            </p>
          </div>

          {/* Candidates */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">For Candidates</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/analyzer" className="hover:text-white transition-colors">Portfolio Code Analyzer</Link></li>
              <li><Link href="/jobs" className="hover:text-white transition-colors">Global AI Jobs</Link></li>
              <li><Link href="/advisor" className="hover:text-white transition-colors">AI Career Advisor (RAG)</Link></li>
              <li><Link href="/roadmap" className="hover:text-white transition-colors">Target Skill Gap Roadmap</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">For Employers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/employer" className="hover:text-white transition-colors">ATS Candidate Pipeline</Link></li>
              <li><Link href="/employer" className="hover:text-white transition-colors">Post Technical Role</Link></li>
              <li><Link href="/analytics" className="hover:text-white transition-colors">Marketplace Analytics</Link></li>
            </ul>
          </div>

          {/* Transparency & Ethics */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Ethics & Verification</h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] leading-relaxed text-slate-300">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                <Shield className="w-3.5 h-3.5" />
                Evidence-Based Policy
              </div>
              Scores reflect demonstrable repository artifacts and objective skill requirements. Never used as a guarantee of employment.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} SkillBridge AI. Built for the Global Talent Hackathon.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Built with Next.js 14, Supabase, and Google Gemini
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
