import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  glass = false,
  ...props 
}, ref) => {
  const baseClass = glass 
    ? 'glass-card'
    : 'bg-dark-surface border border-dark-border shadow-sm rounded-2xl transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-glow';

  return (
    <div ref={ref} className={`${baseClass} overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
});
Card.displayName = 'Card';

export const CardHeader = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-6 py-4 border-b border-dark-border ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-bold text-slate-50 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);