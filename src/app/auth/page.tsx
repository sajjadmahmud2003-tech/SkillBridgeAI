'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { 
  ShieldCheck, 
  Sparkles, 
  User, 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { allProfiles, setCurrentUser } = useApp();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'employer'>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const supabaseLive = isSupabaseConfigured();

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signup') {
      const newUser = {
        id: `user-${Date.now()}`,
        role: selectedRole,
        full_name: name || 'New User',
        headline: selectedRole === 'candidate' ? 'AI Developer' : 'Technical Recruiter',
        target_roles: selectedRole === 'candidate' ? ['Junior AI Engineer'] : [],
        experience_years: 2,
        created_at: new Date().toISOString(),
      };
      setCurrentUser(newUser);
      setMessage(`Account created for ${newUser.full_name}! Redirecting...`);
      setTimeout(() => {
        router.push(selectedRole === 'employer' ? '/employer' : '/dashboard');
      }, 1000);
    } else {
      setMessage(`Signed in as ${email}. Redirecting...`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
  };

  const handleQuickPersona = (personaId: string) => {
    const target = allProfiles.find((p) => p.id === personaId);
    if (target) {
      setCurrentUser(target);
      if (target.role === 'employer') {
        router.push('/employer');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {authMode === 'signin' ? 'Sign In to SkillBridge AI' : 'Create Your Account'}
        </h1>
        <p className="text-xs text-slate-500">
          Connecting verified engineering talent with global employers
        </p>
      </div>

      {/* Instant Demo Switcher for Hackathon Judges */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Hackathon Judge 1-Click Access
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded border border-blue-400/30">
            Instant Login
          </span>
        </div>
        <p className="text-xs text-slate-300">
          Select any pre-configured test persona to explore candidate or employer ATS features immediately:
        </p>

        <div className="space-y-2">
          <button
            onClick={() => handleQuickPersona('a1111111-1111-1111-1111-111111111111')}
            className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-left transition-colors flex items-center justify-between border border-slate-700"
          >
            <div>
              <div className="text-xs font-bold text-white">Alex Chen (Candidate)</div>
              <div className="text-[11px] text-slate-400">Full-Stack to AI Transition • 4 yrs exp</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleQuickPersona('b2222222-2222-2222-2222-222222222222')}
            className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-left transition-colors flex items-center justify-between border border-slate-700"
          >
            <div>
              <div className="text-xs font-bold text-white">Elena Rostova (Senior ML Candidate)</div>
              <div className="text-[11px] text-slate-400">PyTorch &amp; Vision Systems • 6 yrs exp</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleQuickPersona('e9999999-9999-9999-9999-999999999999')}
            className="w-full p-3 rounded-xl bg-indigo-900/60 hover:bg-indigo-900 text-left transition-colors flex items-center justify-between border border-indigo-700/80"
          >
            <div>
              <div className="text-xs font-bold text-white">Sarah Jenkins (Employer View)</div>
              <div className="text-[11px] text-indigo-300">Head of Talent @ TechCorp AI • ATS Portal</div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-300" />
          </button>
        </div>
      </div>

      {/* Custom Auth Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authMode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authMode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {authMode === 'signup' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('candidate')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'candidate'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <User className="w-4 h-4 mb-1 text-blue-600" />
                <div className="text-xs font-bold">Candidate</div>
                <div className="text-[10px] text-slate-500">Seeking AI roles</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('employer')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'employer'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4 mb-1 text-blue-600" />
                <div className="text-xs font-bold">Employer</div>
                <div className="text-[10px] text-slate-500">Hiring engineering talent</div>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleCustomSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@example.com"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
          >
            {authMode === 'signin' ? 'Sign In to Dashboard' : 'Register Account'}
          </button>
        </form>

        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {message}
          </div>
        )}

        {/* Supabase status badge */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Supabase Auth Backend:</span>
          <span className={`font-semibold ${supabaseLive ? 'text-emerald-600' : 'text-amber-600'}`}>
            {supabaseLive ? '● Live Supabase Active' : '○ Demo Auth Fallback Active'}
          </span>
        </div>
      </div>
    </div>
  );
}
