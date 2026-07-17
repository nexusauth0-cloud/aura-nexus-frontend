import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, Mic, Brain, ClipboardList, BookOpen, Settings, LogOut, X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
  { id: 'voice', label: 'Voice Mode', icon: Mic },
  { id: 'memory', label: 'Memory', icon: Brain },
  { id: 'tasks', label: 'Productivity', icon: ClipboardList },
  { id: 'study', label: 'Study', icon: BookOpen },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, activeView, setActiveView } = useAppStore();

  const handleNav = (id: string) => {
    setActiveView(id);
    setSidebarOpen(false);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-72 glass-panel-strong z-50 lg:hidden"
          >
            <SidebarContent
              user={user}
              activeView={activeView}
              onNav={handleNav}
              onClose={() => setSidebarOpen(false)}
              onLogout={logout}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex flex-col w-64 glass-panel-strong rounded-none border-l-0 border-t-0 border-b-0">
        <SidebarContent
          user={user}
          activeView={activeView}
          onNav={handleNav}
          onClose={() => {}}
          onLogout={logout}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  user, activeView, onNav, onClose, onLogout,
}: {
  user: any; activeView: string; onNav: (id: string) => void; onClose: () => void; onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aura-500 to-cyber-purple flex items-center justify-center shadow-lg shadow-aura-500/25">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold neon-text">Aura</h1>
            <p className="text-xs text-gray-500">Nexus OS</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-aura-500/20 to-cyber-purple/20 text-aura-300 border border-aura-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-aura-400" />}
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-cyber-border">
        <button
          onClick={() => onNav('settings')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white transition-colors mb-1"
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>

      {user && (
        <div className="mt-4 p-3 rounded-xl bg-cyber-dark/50 border border-cyber-border/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aura-400 to-cyber-purple flex items-center justify-center text-xs font-bold">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
