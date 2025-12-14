import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiArrowRight, FiUser } from 'react-icons/fi';
import { mbtiTypes, MBTIGroup } from '@/lib/mbtiData';
import MBTITypeButton from '@/components/MBTITypeButton';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

const Login = () => {
  const [username, setUsername] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const groupOrder: MBTIGroup[] = ['analyst', 'diplomat', 'sentinel', 'explorer'];
  
  const groupedTypes = groupOrder.map(group => ({
    group,
    types: mbtiTypes.filter(t => t.group === group)
  }));

  const handleSubmit = () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    if (!selectedType) {
      setError('Please select your MBTI type');
      return;
    }

    // Create user (using local auth for now)
    const user = {
      username: username.trim(),
      mbtiType: selectedType,
      uid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    setUser(user);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-mbti-analyst/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-mbti-diplomat/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mbti-sentinel/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg">
            <FiMessageCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">TypeTalk</h1>
          <p className="text-muted-foreground">Connect with your MBTI community</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 md:p-8"
        >
          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter your username"
                className={cn(
                  'w-full pl-10 pr-4 py-3 rounded-lg',
                  'bg-secondary/50 border border-border',
                  'text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                  'transition-all duration-200'
                )}
              />
            </div>
          </div>

          {/* MBTI Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Select Your MBTI Type
            </label>
            <div className="space-y-4">
              {groupedTypes.map(({ group, types }) => (
                <div key={group} className="grid grid-cols-4 gap-2">
                  {types.map((type, index) => (
                    <MBTITypeButton
                      key={type.code}
                      type={type}
                      isSelected={selectedType === type.code}
                      onClick={() => {
                        setSelectedType(type.code);
                        setError('');
                      }}
                      index={index}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm mb-4"
            >
              {error}
            </motion.p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className={cn(
              'w-full py-3.5 rounded-lg font-semibold',
              'bg-primary text-primary-foreground',
              'flex items-center justify-center gap-2',
              'shadow-lg hover:shadow-xl transition-all duration-300',
              'hover:bg-primary/90'
            )}
          >
            Enter Chat
            <FiArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Personality Groups</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { group: 'Analysts', color: 'text-mbti-analyst' },
                { group: 'Diplomats', color: 'text-mbti-diplomat' },
                { group: 'Sentinels', color: 'text-mbti-sentinel' },
                { group: 'Explorers', color: 'text-mbti-explorer' },
              ].map(({ group, color }) => (
                <span key={group} className={cn('text-xs font-medium', color)}>
                  {group}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
