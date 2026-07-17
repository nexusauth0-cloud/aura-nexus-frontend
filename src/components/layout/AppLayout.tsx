import { useEffect } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Dashboard from '../../pages/Dashboard';
import Assistant from '../../pages/Assistant';
import VoiceMode from '../../pages/VoiceMode';
import Tasks from '../../pages/Tasks';
import Study from '../../pages/Study';
import Memory from '../../pages/Memory';
import Settings from '../../pages/Settings';
import { useAppStore } from '../../store/appStore';

export default function AppLayout() {
  const { activeView, isOnline, setOnline } = useAppStore();

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'assistant': return <Assistant />;
      case 'voice': return <VoiceMode />;
      case 'tasks': return <Tasks />;
      case 'study': return <Study />;
      case 'memory': return <Memory />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-cyber-black overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <div className="sticky top-0 z-20 glass-panel rounded-none border-t-0 border-x-0 px-4 py-3 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aura-500 to-cyber-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-sm font-bold neon-text">Aura</h1>
              <p className="text-[10px] text-gray-500">Nexus OS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
            <span className="text-xs text-gray-500">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
