import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import { getMBTIByCode, groupBgClasses, groupTextClasses } from '@/lib/mbtiData';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  roomType: string;
  disabled?: boolean;
}

const ChatInput = ({ onSend, roomType, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const roomMBTI = getMBTIByCode(roomType);
  const roomGroup = roomMBTI?.group || 'analyst';

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full px-4 py-3 rounded-xl resize-none',
              'bg-secondary/50 border border-border',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2',
              'transition-all duration-200',
              `focus:ring-${groupTextClasses[roomGroup].replace('text-', '')}`,
              'min-h-[48px] max-h-32'
            )}
            style={{ 
              height: 'auto',
              minHeight: '48px'
            }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={cn(
            'p-3 rounded-xl transition-all duration-200',
            'flex items-center justify-center',
            message.trim() && !disabled
              ? cn(groupBgClasses[roomGroup], 'text-background shadow-lg')
              : 'bg-secondary text-muted-foreground cursor-not-allowed'
          )}
        >
          <FiSend className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default ChatInput;
