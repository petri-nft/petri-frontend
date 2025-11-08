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
  
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        `bg-${colorClass}/10 text-${colorClass}`,
        sizeClasses[size]
      )}
    >
      <div className={cn('w-2 h-2 rounded-full', `bg-${colorClass}`)} />
      {showLabel && <span>{label}</span>}
      <span className="font-semibold">{healthIndex}%</span>
    </div>
  );
};
