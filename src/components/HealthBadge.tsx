import { getHealthColor, getHealthLabel } from '@/lib/utils/helpers';
import { cn } from '@/lib/utils';

interface HealthBadgeProps {
  healthIndex: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const HealthBadge = ({ healthIndex, size = 'md', showLabel = true }: HealthBadgeProps) => {
  const colorClass = getHealthColor(healthIndex);
  const label = getHealthLabel(healthIndex);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };
  
  const getHealthGradient = () => {
    if (healthIndex >= 80) return 'from-health-excellent/20 to-health-excellent/40 border-health-excellent/50';
    if (healthIndex >= 60) return 'from-health-good/20 to-health-good/40 border-health-good/50';
    if (healthIndex >= 40) return 'from-health-medium/20 to-health-medium/40 border-health-medium/50';
    if (healthIndex >= 20) return 'from-health-low/20 to-health-low/40 border-health-low/50';
    return 'from-health-critical/20 to-health-critical/40 border-health-critical/50';
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium backdrop-blur-md border-2 bg-gradient-to-r shadow-lg animate-bounce-in',
        getHealthGradient(),
        sizeClasses[size]
      )}
    >
      <div className={cn('w-2 h-2 rounded-full animate-glow-pulse', `bg-${colorClass}`)} />
      {showLabel && <span className="text-foreground">{label}</span>}
      <span className="font-bold text-foreground">{healthIndex}%</span>
    </div>
  );
};
