import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiX, FiLogOut, FiGrid, FiMessageCircle } from 'react-icons/fi';
import { mbtiTypes, groupTextClasses, groupBgClasses } from '@/lib/mbtiData';
import { useUser } from '@/contexts/UserContext';
import MBTIBadge from './MBTIBadge';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoom?: string;
}

const Sidebar = ({ isOpen, onClose, currentRoom }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed left-0 top-0 bottom-0 w-[280px] z-50',
              'bg-card border-r border-border',
              'flex flex-col',
              'lg:relative lg:translate-x-0'
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <FiMessageCircle className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">TypeTalk</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* User info */}
            {user && (
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.username}</p>
                    <MBTIBadge type={user.mbtiType} size="sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-2">
              {/* Dashboard link */}
              <button
                onClick={() => handleNavigation('/dashboard')}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2 transition-colors',
                  location.pathname === '/dashboard'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                )}
              >
                <FiGrid className="w-4 h-4" />
                <span className="font-medium">All Rooms</span>
              </button>

              {/* Rooms list */}
              <div className="mt-4">
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Chat Rooms
                </p>
                <div className="space-y-1 mt-2">
                  {mbtiTypes.map((type) => (
                    <button
                      key={type.code}
                      onClick={() => handleNavigation(`/chat/${type.code}`)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                        currentRoom === type.code
                          ? cn(groupBgClasses[type.group], 'text-background')
                          : cn('hover:bg-secondary', groupTextClasses[type.group])
                      )}
                    >
                      <span className="font-mono font-medium text-sm">{type.code}</span>
                      <span className={cn(
                        'text-xs truncate',
                        currentRoom === type.code ? 'text-background/80' : 'text-muted-foreground'
                      )}>
                        {type.subtitle}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
