import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiArrowLeft, FiUsers } from 'react-icons/fi';
import { getMBTIByCode, groupBgClasses, groupTextClasses } from '@/lib/mbtiData';
import { useUser } from '@/contexts/UserContext';
import ChatMessage, { Message } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import Sidebar from '@/components/Sidebar';
import MBTIBadge from '@/components/MBTIBadge';
import { cn } from '@/lib/utils';

// Mock messages for demo (replace with Firestore in production)
const generateMockMessages = (roomType: string): Message[] => {
  const names = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Riley', 'Morgan'];
  const messages = [
    'Hey everyone! Just joined the room.',
    'Anyone here interested in discussing cognitive functions?',
    'I love how this type thinks!',
    'What books are you all reading lately?',
    'The weather is great today!',
    'Has anyone tried the new productivity app?',
  ];

  return messages.slice(0, 4).map((text, index) => ({
    id: `msg_${index}`,
    text,
    senderName: names[index % names.length],
    senderType: roomType,
    createdAt: new Date(Date.now() - (4 - index) * 60000),
    uid: `user_${index}`,
  }));
};

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomType = roomId?.toUpperCase() || 'INTJ';
  const mbtiInfo = getMBTIByCode(roomType);
  const roomGroup = mbtiInfo?.group || 'analyst';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Load mock messages (replace with Firestore onSnapshot)
    setMessages(generateMockMessages(roomType));
  }, [isAuthenticated, navigate, roomType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      senderName: user.username,
      senderType: user.mbtiType,
      createdAt: new Date(),
      uid: user.uid,
    };

    setMessages((prev) => [...prev, newMessage]);

    // TODO: Add to Firestore
    // await addDoc(collection(db, 'rooms', roomType, 'messages'), {
    //   text,
    //   senderName: user.username,
    //   senderType: user.mbtiType,
    //   createdAt: serverTimestamp(),
    //   uid: user.uid,
    // });
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
              <span>{Math.floor(Math.random() * 10) + 5} online</span>
            </div>
          </div>
        </motion.header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
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
        <ChatInput onSend={handleSendMessage} roomType={roomType} />
      </div>
    </div>
  );
};

export default ChatRoom;
