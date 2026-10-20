import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconHelperProps {
  name?: string;
  className?: string;
  size?: number;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, className = 'w-5 h-5', size }) => {
  if (!name) return <LucideIcons.Sparkles className={className} size={size} />;
  
  // @ts-expect-error Lucide icons indexed access
  const IconComponent = LucideIcons[name] || LucideIcons.Sparkles;
  
  return <IconComponent className={className} size={size} />;
};
