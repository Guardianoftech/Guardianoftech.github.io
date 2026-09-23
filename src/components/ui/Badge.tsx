import React, { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'normal' | 'success' | 'warning' | 'error' | 'neutral';
  dot?: boolean;
}

export const Badge = ({ children, variant = 'neutral', dot = false, className = '', ...props }: BadgeProps) => {
  const variants = {
    normal: 'bg-primary-500/10 text-primary-400 ring-1 ring-primary-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    error: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
    neutral: 'bg-slate-700/30 text-slate-300 ring-1 ring-white/10',
  };

  const dotColors = {
    normal: 'bg-primary-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-red-400',
    neutral: 'bg-slate-400',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`} {...props}>
      {dot && (
        <svg className={`mr-1.5 h-2 w-2 rounded-full ${dotColors[variant]} animate-pulse`} fill="currentColor" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" />
        </svg>
      )}
      {children}
    </span>
  );
};