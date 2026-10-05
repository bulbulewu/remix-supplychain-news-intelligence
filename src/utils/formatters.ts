import { PriorityLevel, ImpactLevel, CredibilityType } from '../types/news';

export function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
}

export function formatLocalDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return isoString;
  }
}

export function getPriorityColor(level: PriorityLevel, isDark = false): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (level) {
    case 'CRITICAL':
      return {
        bg: isDark ? 'bg-rose-950/60' : 'bg-rose-50',
        text: isDark ? 'text-rose-300' : 'text-rose-700',
        border: isDark ? 'border-rose-800/80' : 'border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'HIGH':
      return {
        bg: isDark ? 'bg-amber-950/60' : 'bg-amber-50',
        text: isDark ? 'text-amber-300' : 'text-amber-700',
        border: isDark ? 'border-amber-800/80' : 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'IMPORTANT':
      return {
        bg: isDark ? 'bg-blue-950/60' : 'bg-blue-50',
        text: isDark ? 'text-blue-300' : 'text-blue-700',
        border: isDark ? 'border-blue-800/80' : 'border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'WATCH':
      return {
        bg: isDark ? 'bg-emerald-950/60' : 'bg-emerald-50',
        text: isDark ? 'text-emerald-300' : 'text-emerald-700',
        border: isDark ? 'border-emerald-800/80' : 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'LOW':
    default:
      return {
        bg: isDark ? 'bg-slate-900/60' : 'bg-slate-100',
        text: isDark ? 'text-slate-400' : 'text-slate-600',
        border: isDark ? 'border-slate-800' : 'border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}

export function getImpactBadge(level: ImpactLevel, isDark = false): {
  bg: string;
  text: string;
} {
  switch (level) {
    case 'Critical':
      return {
        bg: isDark ? 'bg-rose-950/80' : 'bg-rose-100',
        text: isDark ? 'text-rose-300' : 'text-rose-800',
      };
    case 'High':
      return {
        bg: isDark ? 'bg-amber-950/80' : 'bg-amber-100',
        text: isDark ? 'text-amber-300' : 'text-amber-800',
      };
    case 'Medium':
      return {
        bg: isDark ? 'bg-blue-950/80' : 'bg-blue-100',
        text: isDark ? 'text-blue-300' : 'text-blue-800',
      };
    case 'Low':
    default:
      return {
        bg: isDark ? 'bg-slate-800' : 'bg-slate-100',
        text: isDark ? 'text-slate-400' : 'text-slate-700',
      };
  }
}

export function getCredibilityBadge(type: CredibilityType): string {
  switch (type) {
    case 'Established news organization':
      return 'Tier-1 International Media';
    case 'Specialist industry publication':
      return 'Industry Specialist Press';
    case 'Government/official source':
      return 'Official / Regulatory Statement';
    case 'Corporate announcement':
      return 'Corporate Filing / Advisory';
    case 'Trade organization':
      return 'Trade Association Bulletin';
    case 'Secondary publication':
    default:
      return 'Secondary Reporting';
  }
}
