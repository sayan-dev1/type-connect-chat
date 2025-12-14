import { getMBTIByCode, groupBgClasses, groupTextClasses } from '@/lib/mbtiData';
import { cn } from '@/lib/utils';

interface MBTIBadgeProps {
  type: string;
  variant?: 'filled' | 'outline';
  size?: 'sm' | 'md';
}

const MBTIBadge = ({ type, variant = 'filled', size = 'sm' }: MBTIBadgeProps) => {
  const mbtiType = getMBTIByCode(type);
  const group = mbtiType?.group || 'analyst';

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-medium rounded',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
        variant === 'filled'
          ? cn(groupBgClasses[group], 'text-background')
          : cn('bg-transparent border', groupTextClasses[group], `border-current`)
      )}
    >
      {type}
    </span>
  );
};

export default MBTIBadge;
