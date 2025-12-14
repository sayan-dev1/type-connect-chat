import { motion } from 'framer-motion';
import { MBTIType, groupBgClasses, groupTextClasses, groupBorderClasses } from '@/lib/mbtiData';
import { cn } from '@/lib/utils';

interface MBTITypeButtonProps {
  type: MBTIType;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const MBTITypeButton = ({ type, isSelected, onClick, index }: MBTITypeButtonProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative p-3 rounded-lg border-2 transition-all duration-300',
        'flex flex-col items-center justify-center gap-1',
        'backdrop-blur-sm',
        isSelected
          ? cn(
              groupBgClasses[type.group],
              'border-transparent text-background',
              'shadow-lg'
            )
          : cn(
              'bg-secondary/50 hover:bg-secondary',
              groupBorderClasses[type.group],
              'border-opacity-50 hover:border-opacity-100',
              groupTextClasses[type.group]
            )
      )}
    >
      <span className={cn(
        'font-bold text-sm',
        isSelected ? 'text-background' : groupTextClasses[type.group]
      )}>
        {type.code}
      </span>
      <span className={cn(
        'text-[10px] opacity-80',
        isSelected ? 'text-background' : 'text-muted-foreground'
      )}>
        {type.subtitle}
      </span>
    </motion.button>
  );
};

export default MBTITypeButton;
