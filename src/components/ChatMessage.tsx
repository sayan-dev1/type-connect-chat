import { motion } from 'framer-motion';
import { getMBTIByCode, groupBgClasses, groupTextClasses } from '@/lib/mbtiData';
import MBTIBadge from './MBTIBadge';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  text: string;
  senderName: string;
  senderType: string;
  createdAt: Date;
  uid: string;
}

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
  roomType: string;
}

const ChatMessage = ({ message, isOwn, roomType }: ChatMessageProps) => {
  const roomMBTI = getMBTIByCode(roomType);
  const roomGroup = roomMBTI?.group || 'analyst';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex gap-3 max-w-[85%] md:max-w-[70%]',
        isOwn ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
          isOwn
            ? cn(groupBgClasses[roomGroup], 'text-background')
            : 'bg-secondary text-foreground'
        )}
      >
        {message.senderName.charAt(0).toUpperCase()}
      </div>

      {/* Message bubble */}
      <div className={cn(
        'flex flex-col gap-1',
        isOwn ? 'items-end' : 'items-start'
      )}>
        {/* Header */}
        <div className={cn(
          'flex items-center gap-2 text-xs',
          isOwn ? 'flex-row-reverse' : 'flex-row'
        )}>
          <span className="font-medium text-foreground">{message.senderName}</span>
          <MBTIBadge type={message.senderType} variant="outline" />
        </div>

        {/* Bubble */}
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl',
            isOwn
              ? cn(
                  groupBgClasses[roomGroup],
                  'text-background rounded-tr-sm'
                )
              : 'bg-secondary text-foreground rounded-tl-sm'
          )}
        >
          <p className="text-sm leading-relaxed break-words">{message.text}</p>
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground px-1">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
