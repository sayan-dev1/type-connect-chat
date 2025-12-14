import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MBTIType, groupGlowClasses, groupTextClasses, groupBgClasses } from '@/lib/mbtiData';
import { cn } from '@/lib/utils';
import { FiMessageCircle, FiUsers } from 'react-icons/fi';

interface RoomCardProps {
  type: MBTIType;
  index: number;
  onlineCount?: number;
}

const RoomCard = ({ type, index, onlineCount = 0 }: RoomCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/chat/${type.code}`)}
      className={cn(
        'relative cursor-pointer group',
        'glass-card p-5 transition-all duration-300',
        `hover:${groupGlowClasses[type.group]}`
      )}
    >
      {/* Gradient accent bar */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1 rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity',
          groupBgClasses[type.group]
        )}
      />

      {/* Content */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            'text-2xl font-bold transition-colors',
            groupTextClasses[type.group]
          )}>
            {type.code}
          </h3>
          <div className={cn(
            'p-2 rounded-lg bg-secondary/50 group-hover:bg-secondary transition-colors',
            groupTextClasses[type.group]
          )}>
            <FiMessageCircle className="w-4 h-4" />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{type.subtitle}</p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FiUsers className="w-3 h-3" />
          <span>{onlineCount} online</span>
        </div>
      </div>

      {/* Hover glow effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
          'bg-gradient-to-b from-transparent to-transparent',
          type.group === 'analyst' && 'shadow-[inset_0_0_30px_hsl(263_67%_60%/0.1)]',
          type.group === 'diplomat' && 'shadow-[inset_0_0_30px_hsl(156_75%_47%/0.1)]',
          type.group === 'sentinel' && 'shadow-[inset_0_0_30px_hsl(197_80%_63%/0.1)]',
          type.group === 'explorer' && 'shadow-[inset_0_0_30px_hsl(47_90%_60%/0.1)]'
        )}
      />
    </motion.div>
  );
};

export default RoomCard;
