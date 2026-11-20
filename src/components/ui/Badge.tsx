import React from 'react';
import { VerificationLevel, ApplicationStage, RemotePolicy } from '@/types';
import { CheckCircle2, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface VerificationBadgeProps {
  level: VerificationLevel;
  confidence?: number;
  showIcon?: boolean;
}

export function VerificationBadge({ level, confidence, showIcon = true }: VerificationBadgeProps) {
  if (level === 'Independently Verified') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
        {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
        Independently Verified
      </span>
    );
  }

  if (level === 'Portfolio-Supported') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
        {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
        Portfolio-Supported
        {confidence !== undefined && (
          <span className="text-[10px] bg-blue-200 text-blue-800 px-1 rounded font-semibold">
            {Math.round(confidence * 100)}%
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
      {showIcon && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
      Self-Reported
    </span>
  );
}

export function StageBadge({ stage }: { stage: ApplicationStage }) {
  const styles: Record<ApplicationStage, string> = {
    Matched: 'bg-slate-100 text-slate-700 border-slate-200',
    Applied: 'bg-blue-50 text-blue-700 border-blue-200',
    Assessment: 'bg-purple-50 text-purple-700 border-purple-200',
    Interview: 'bg-amber-50 text-amber-700 border-amber-200',
    Offer: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    Withdrawn: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${styles[stage] || styles.Applied}`}>
      {stage === 'Offer' && <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />}
      {stage}
    </span>
  );
}

export function RemoteBadge({ policy }: { policy: RemotePolicy }) {
  const map: Record<RemotePolicy, { label: string; class: string }> = {
    remote: { label: 'Global Remote', class: 'bg-teal-50 text-teal-700 border-teal-200' },
    hybrid: { label: 'Hybrid', class: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    onsite: { label: 'Onsite', class: 'bg-slate-100 text-slate-700 border-slate-200' },
  };

  const item = map[policy] || map.remote;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${item.class}`}>
      {item.label}
    </span>
  );
}
