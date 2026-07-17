import { LayoutDashboard, MessageSquare, Mic, ClipboardList, BookOpen } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'assistant', label: 'Chat', icon: MessageSquare },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'tasks', label: 'Tasks', icon: ClipboardList },
  { id: 'study', label: 'Study', icon: BookOpen },
];

export default function BottomNav() {
  const { activeView, setActiveView } = useAppStore();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-panel-strong rounded-none border-b-0 border-x-0 z-30 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0 ${
                isActive
                  ? 'text-aura-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-aura-500/10' : ''}`}>
                <Icon size={20} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-aura-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
