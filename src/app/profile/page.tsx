'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { VerificationBadge } from '@/components/ui/Badge';
import { 
  User, 
  MapPin, 
  Github, 
  Globe, 
  Briefcase, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function ProfilePage() {
  const { 
    currentUser, 
    updateCurrentUser, 
    candidateSkills, 
    addCandidateSkill, 
    removeCandidateSkill,
    portfolioAnalyses 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser.full_name);
  const [headline, setHeadline] = useState(currentUser.headline || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [githubUrl, setGithubUrl] = useState(currentUser.github_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser.portfolio_url || '');
  const [experienceYears, setExperienceYears] = useState(currentUser.experience_years);
  const [targetRolesInput, setTargetRolesInput] = useState(currentUser.target_roles.join(', '));

  // Add new skill modal/form states
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'frontend' | 'backend' | 'ai_ml' | 'devops' | 'database' | 'general'>('ai_ml');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      full_name: fullName,
      headline,
      bio,
      location,
      github_url: githubUrl,
      portfolio_url: portfolioUrl,
      experience_years: Number(experienceYears),
      target_roles: targetRolesInput.split(',').map((r) => r.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    addCandidateSkill({
      profile_id: currentUser.id,
      skill_name: newSkillName.trim(),
      category: newSkillCategory,
      verification_level: 'Self-Reported', // user-added skills are self-reported until verified via repo analyzer
      confidence: 0.50,
      evidence_count: 0,
    });

    setNewSkillName('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {currentUser.full_name[0]}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{currentUser.full_name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200 capitalize">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">{currentUser.headline}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Edit Form or Display */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Target Roles (comma-separated)
                </label>
                <input
                  type="text"
                  value={targetRolesInput}
                  onChange={(e) => setTargetRolesInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Bio &amp; Professional Summary
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
              {currentUser.bio || 'No bio provided yet.'}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {currentUser.location || 'Remote'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {currentUser.experience_years} Years Experience
              </span>
              {currentUser.github_url && (
                <a
                  href={currentUser.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 hover:underline"
                >
                  <Github className="w-4 h-4 text-slate-700" />
                  GitHub Profile
                </a>
              )}
            </div>

            {/* Target Roles */}
            <div className="pt-2">
              <span className="text-xs text-slate-400 font-semibold mr-2">Target Roles:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {currentUser.target_roles.map((role) => (
                  <span key={role} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Skills Management */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Manage Technical Skills ({candidateSkills.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Self-reported skills receive partial matching weight until confirmed by code analysis.
            </p>
          </div>

          {/* Quick Add Skill Input Form */}
          <form onSubmit={handleAddSkill} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add skill (e.g. PyTorch)..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as any)}
              className="px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
            >
              <option value="ai_ml">AI / ML</option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="devops">DevOps</option>
              <option value="database">Database</option>
              <option value="general">General</option>
            </select>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shrink-0"
            >
              + Add
            </button>
          </form>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {candidateSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-2 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-1 truncate">
                <div className="font-bold text-xs text-slate-900 truncate">{skill.skill_name}</div>
                <div>
                  <VerificationBadge 
                    level={skill.verification_level} 
                    confidence={skill.confidence} 
                  />
                </div>
              </div>

              <button
                onClick={() => removeCandidateSkill(skill.id)}
                className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                title="Remove skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
