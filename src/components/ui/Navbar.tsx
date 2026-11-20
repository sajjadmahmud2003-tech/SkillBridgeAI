'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Sparkles, 
  Briefcase, 
  Compass, 
  BookOpen, 
  User, 
  Building2, 
  BarChart3, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Code2 
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, setCurrentUser, allProfiles, isDemoMode } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const candidateLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Briefcase },
    { href: '/jobs', label: 'Job Marketplace', icon: Compass },
    { href: '/analyzer', label: 'Portfolio Analyzer', icon: Code2 },
    { href: '/advisor', label: 'AI Advisor', icon: Sparkles },
    { href: '/roadmap', label: 'Learning Roadmap', icon: BookOpen },
    { href: '/profile', label: 'My Profile', icon: User },
  ];

  const employerLinks = [
    { href: '/employer', label: 'Employer Portal (ATS)', icon: Building2 },
    { href: '/jobs', label: 'Marketplace View', icon: Compass },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const links = currentUser.role === 'employer' ? employerLinks : candidateLinks;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Demo Mode Notice Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2 mx-auto">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              <strong>HACKATHON DEMO MODE ACTIVE</strong> — Sample jobs, candidates, and AI responses loaded. Connect Supabase & Gemini in .env to enable live sync.
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  SkillBridge<span className="text-blue-600 font-extrabold">AI</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium -mt-1 tracking-wider uppercase">
                  Verified Global Talent
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Role / User Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-xs font-medium text-slate-800"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {currentUser.full_name[0]}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 leading-tight">
                    {currentUser.full_name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {currentUser.role} View
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Test Persona
                  </div>
                  {allProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setCurrentUser(p);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${
                        p.id === currentUser.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {p.full_name[0]}
                      </div>
                      <div className="truncate">
                        <div className="font-medium text-slate-900 truncate">{p.full_name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{p.headline || p.role}</div>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1 px-3 py-1">
                    <Link
                      href="/auth"
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      Sign In / Register Custom User
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/analyzer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all hover:shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Analyze Repo
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-600" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 mt-2">
            <div className="text-xs font-medium text-slate-500 px-3 pb-1">Current Active User:</div>
            <div className="px-3 text-sm font-semibold text-slate-900">{currentUser.full_name} ({currentUser.role})</div>
          </div>
        </div>
      )}
    </header>
  );
}
