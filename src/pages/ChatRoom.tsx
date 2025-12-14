import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiArrowLeft, FiUsers, FiLoader } from 'react-icons/fi';
import { getMBTIByCode, groupBgClasses, groupTextClasses } from '@/lib/mbtiData';
import { useUser } from '@/contexts/UserContext';
import ChatMessage, { Message } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import Sidebar from '@/components/Sidebar';
import MBTIBadge from '@/components/MBTIBadge';
import { cn } from '@/lib/utils';
import { sendMessage, subscribeToMessages, FirebaseMessage } from '@/lib/firebase';

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomType = roomId?.toUpperCase() || 'INTJ';
  const mbtiInfo = getMBTIByCode(roomType);
  const roomGroup = mbtiInfo?.group || 'analyst';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Subscribe to real-time messages from Firebase
    const unsubscribe = subscribeToMessages(roomType, (firebaseMessages: FirebaseMessage[]) => {
      const formattedMessages: Message[] = firebaseMessages.map(msg => ({
        id: msg.id,
        text: msg.text,
        senderName: msg.senderName,
        senderType: msg.senderType,
        createdAt: msg.createdAt,
        uid: msg.uid
      }));
      setMessages(formattedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated, navigate, roomType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!user || sending) return;

    setSending(true);
    try {
      await sendMessage(
        roomType,
        text,
        user.username,
        user.mbtiType,
        user.uid
      );
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentRoom={roomType}
      />

      {/* Desktop sidebar (always visible) */}
      <aside className="hidden lg:flex w-[280px] border-r border-border bg-card shrink-0">
        <div className="w-full">
          <Sidebar isOpen={true} onClose={() => {}} currentRoom={roomType} />
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'border-b border-border sticky top-0 z-10',
            'backdrop-blur-sm'
          )}
          style={{
            background: `linear-gradient(to right, hsl(var(--${roomGroup === 'analyst' ? 'mbti-analyst' : roomGroup === 'diplomat' ? 'mbti-diplomat' : roomGroup === 'sentinel' ? 'mbti-sentinel' : 'mbti-explorer'}) / 0.1), transparent)`
          }}
        >
          <div className="px-4 py-3 flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden"
            >
              <FiMenu className="w-5 h-5" />
            </button>

            {/* Back button (mobile) */}
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>

            {/* Room info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className={cn(
                  'font-bold text-xl',
                  groupTextClasses[roomGroup]
                )}>
                  {roomType}
                </h1>
                <MBTIBadge type={roomType} />
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {mbtiInfo?.subtitle}
              </p>
            </div>

            {/* Online users */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FiUsers className="w-4 h-4" />
              <span>Live Chat</span>
            </div>
          </div>
        </motion.header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <FiLoader className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground mt-2">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className={cn(
                'w-16 h-16 rounded-2xl mb-4 flex items-center justify-center',
                groupBgClasses[roomGroup]
              )}>
                <span className="text-2xl font-bold text-background">{roomType.charAt(0)}</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">Welcome to {roomType} Room</h3>
              <p className="text-muted-foreground text-sm">
                Be the first to start the conversation!
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwn={message.uid === user.uid}
                  roomType={roomType}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <ChatInput onSend={handleSendMessage} roomType={roomType} disabled={sending} />
      </div>
    </div>
  );
};

export default ChatRoom;
