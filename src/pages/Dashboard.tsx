import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MessageSquare, Mic, Plus, BookOpen, Sparkles, TrendingUp, CheckCircle, Clock, Brain } from 'lucide-react';
import AnimatedAICore from '../components/ui/AnimatedAICore';
import GlassPanel from '../components/ui/GlassPanel';
import StatusBadge from '../components/ui/StatusBadge';
import { useAppStore } from '../store/appStore';
import { analytics } from '../services/api';

export default function Dashboard() {
  const { setActiveView, assistantStatus } = useAppStore();
  const [stats, setStats] = useState<any>(null);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await analytics.dashboard();
        setStats(data.stats);
        setRecentTasks(data.recentTasks || []);
      } catch {
        // offline fallback - use defaults
      }
    };
    load();
  }, []);

  const quickActions = [
    { label: 'Ask AI', icon: MessageSquare, view: 'assistant', color: 'from-aura-500 to-blue-500' },
    { label: 'Voice Mode', icon: Mic, view: 'voice', color: 'from-cyber-purple to-pink-500' },
    { label: 'New Task', icon: Plus, view: 'tasks', color: 'from-emerald-500 to-teal-500' },
    { label: 'Study Mode', icon: BookOpen, view: 'study', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Your AI command center</p>
        </div>
        <StatusBadge status={assistantStatus === 'thinking' ? 'thinking' : 'online'} label={assistantStatus === 'thinking' ? 'Processing' : 'System Active'} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPanel className="lg:col-span-1 flex flex-col items-center justify-center py-8" glow>
          <AnimatedAICore size={180} status={assistantStatus} />
          <p className="mt-6 text-sm text-gray-400 font-mono">Aura Core v1.0</p>
          <p className="text-xs text-gray-500 mt-1">Always ready to assist</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setActiveView('assistant')} className="cyber-button text-sm py-2 px-4">
              <MessageSquare size={14} className="inline mr-1" /> Chat
            </button>
            <button onClick={() => setActiveView('voice')} className="cyber-button-outline text-sm py-2 px-4">
              <Mic size={14} className="inline mr-1" /> Voice
            </button>
          </div>
        </GlassPanel>

        <div className="lg:col-span-2 space-y-4">
          <GlassPanel>
            <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-aura-400" /> Productivity Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Tasks', value: stats?.tasks?.total || 0, icon: CheckCircle, color: 'text-emerald-400' },
                { label: 'Completed', value: stats?.tasks?.completed || 0, icon: TrendingUp, color: 'text-blue-400' },
                { label: 'Notes', value: stats?.notes || 0, icon: Brain, color: 'text-purple-400' },
                { label: 'Study', value: stats?.study?.total || 0, icon: BookOpen, color: 'text-orange-400' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="text-center p-3 rounded-xl bg-cyber-dark/50">
                    <Icon size={20} className={`mx-auto mb-2 ${item.color}`} />
                    <p className="text-2xl font-bold text-white">{item.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </GlassPanel>

          <GlassPanel>
            <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-aura-400" /> Recent Tasks
            </h2>
            <div className="space-y-2">
              {recentTasks.length > 0 ? recentTasks.slice(0, 4).map((task: any) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-cyber-dark/30 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <span className="text-sm text-gray-300 flex-1 truncate">{task.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-aura-500/20 text-aura-400'
                  }`}>
                    {task.status}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">No tasks yet. Create your first task!</p>
              )}
            </div>
          </GlassPanel>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.view}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView(action.view)}
                className="glass-panel p-4 flex flex-col items-center gap-3 hover:bg-cyber-card/60 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
