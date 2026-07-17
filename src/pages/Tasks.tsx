import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Circle, Trash2, Flag, Calendar, Sparkles, Loader2 } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import { tasks, planner } from '../services/api';

export default function Tasks() {
  const [taskList, setTaskList] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showNew, setShowNew] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
    loadPlans();
  }, []);

  const loadTasks = async () => {
    try {
      const { data } = await tasks.list();
      setTaskList(data.tasks || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await planner.list({ date: today });
      setPlans(data.plans || []);
    } catch {}
  };

  const createTask = async () => {
    if (!newTask.trim()) return;
    try {
      const { data } = await tasks.create({ title: newTask, priority: newPriority });
      setTaskList((prev) => [data.task, ...prev]);
      setNewTask('');
      setShowNew(false);
    } catch {}
  };

  const toggleTask = async (task: any) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await tasks.update(task.id, { status: newStatus });
      setTaskList((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
    } catch {}
  };

  const deleteTask = async (id: string) => {
    try {
      await tasks.delete(id);
      setTaskList((prev) => prev.filter((t) => t.id !== id));
    } catch {}
  };

  const generatePlan = async () => {
    try {
      const { data } = await planner.generate();
      setPlans((prev) => [data.plan, ...prev]);
    } catch {}
  };

  const priorityColors: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text">Productivity Hub</h1>
          <p className="text-gray-500 text-sm mt-1">Manage tasks & daily plans</p>
        </div>
        <div className="flex gap-2">
          <button onClick={generatePlan} className="cyber-button-outline text-sm py-2 px-4">
            <Sparkles size={14} className="inline mr-1" /> Generate Plan
          </button>
          <button onClick={() => setShowNew(true)} className="cyber-button text-sm py-2 px-4">
            <Plus size={14} className="inline mr-1" /> New Task
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GlassPanel className="p-4">
              <div className="flex gap-3">
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createTask()}
                  placeholder="What needs to be done?"
                  className="input-cyber flex-1"
                  autoFocus
                />
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="input-cyber w-32"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button onClick={createTask} className="cyber-button">
                  Add
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-aura-400" />
            </div>
          ) : taskList.length === 0 ? (
            <GlassPanel className="text-center py-12">
              <CheckCircle2 size={40} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No tasks yet</p>
              <p className="text-gray-600 text-sm mt-1">Create your first task to get started</p>
            </GlassPanel>
          ) : (
            taskList.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-4 flex items-center gap-4"
              >
                <button onClick={() => toggleTask(task)} className="flex-shrink-0">
                  {task.status === 'completed' ? (
                    <CheckCircle2 size={22} className="text-green-400" />
                  ) : (
                    <Circle size={22} className="text-gray-500 hover:text-aura-400 transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{task.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[task.priority] || ''}`}>
                    {task.priority}
                  </span>
                  <button onClick={() => deleteTask(task.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-aura-400" /> Today's Plan
            </h3>
            {plans.length > 0 ? (
              <div className="space-y-3">
                {plans[0].plan?.tasks_planned?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-cyber-dark/30">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      item.priority === 'high' ? 'bg-red-400' : item.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`} />
                    <span className="text-xs text-gray-400 w-12 font-mono">{item.time}</span>
                    <span className="text-xs text-gray-300 flex-1 truncate">{item.task}</span>
                  </div>
                ))}
                {plans[0].plan?.goals?.map((goal: string, i: number) => (
                  <div key={`goal-${i}`} className="flex items-center gap-2 text-xs text-gray-500">
                    <Flag size={10} className="text-aura-400" />
                    {goal}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">No plan for today</p>
                <button onClick={generatePlan} className="text-xs text-aura-400 hover:text-aura-300 mt-2">
                  Generate one with AI
                </button>
              </div>
            )}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
