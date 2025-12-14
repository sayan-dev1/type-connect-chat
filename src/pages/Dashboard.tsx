import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiLogOut } from 'react-icons/fi';
import { mbtiTypes, MBTIGroup } from '@/lib/mbtiData';
import { useUser } from '@/contexts/UserContext';
import RoomCard from '@/components/RoomCard';
import MBTIBadge from '@/components/MBTIBadge';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const groupOrder: MBTIGroup[] = ['analyst', 'diplomat', 'sentinel', 'explorer'];
  const groupLabels: Record<MBTIGroup, string> = {
    analyst: 'Analysts',
    diplomat: 'Diplomats',
    sentinel: 'Sentinels',
    explorer: 'Explorers',
  };

  const groupedTypes = groupOrder.map(group => ({
    group,
    label: groupLabels[group],
    types: mbtiTypes.filter(t => t.group === group)
  }));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-mbti-analyst/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-mbti-diplomat/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20"
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <FiMessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-xl">TypeTalk</h1>
                <p className="text-xs text-muted-foreground">Choose a room to start chatting</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">{user.username}</span>
                <MBTIBadge type={user.mbtiType} />
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Welcome message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Welcome, <span className="text-gradient">{user.username}</span>!
            </h2>
            <p className="text-muted-foreground">
              Join a chat room to connect with people who share your interests
            </p>
          </motion.div>

          {/* Room groups */}
          <div className="space-y-10">
            {groupedTypes.map(({ group, label, types }, groupIndex) => (
              <motion.section
                key={group}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + groupIndex * 0.1 }}
              >
                <h3 className={cn(
                  'text-lg font-semibold mb-4 flex items-center gap-2',
                  group === 'analyst' && 'text-mbti-analyst',
                  group === 'diplomat' && 'text-mbti-diplomat',
                  group === 'sentinel' && 'text-mbti-sentinel',
                  group === 'explorer' && 'text-mbti-explorer'
                )}>
                  <span className={cn(
                    'w-2 h-2 rounded-full',
                    group === 'analyst' && 'bg-mbti-analyst',
                    group === 'diplomat' && 'bg-mbti-diplomat',
                    group === 'sentinel' && 'bg-mbti-sentinel',
                    group === 'explorer' && 'bg-mbti-explorer'
                  )} />
                  {label}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {types.map((type, index) => (
                    <RoomCard
                      key={type.code}
                      type={type}
                      index={groupIndex * 4 + index}
                      onlineCount={Math.floor(Math.random() * 15)}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
