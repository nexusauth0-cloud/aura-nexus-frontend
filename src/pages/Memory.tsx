import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, Trash2, Star, Heart, BookOpen, Briefcase, Users, Edit3 } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import { memories } from '../services/api';

const categoryIcons: Record<string, any> = {
  personal: Heart,
  interests: Star,
  work: Briefcase,
  learning: BookOpen,
  social: Users,
  conversation: Brain,
};

const categoryColors: Record<string, string> = {
  personal: 'from-pink-500 to-rose-500',
  interests: 'from-yellow-500 to-orange-500',
  work: 'from-blue-500 to-indigo-500',
  learning: 'from-green-500 to-emerald-500',
  social: 'from-purple-500 to-violet-500',
  conversation: 'from-aura-500 to-cyber-purple',
};

export default function Memory() {
  const [memoryList, setMemoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [category, setCategory] = useState('personal');
  const [content, setContent] = useState('');
  const [importance, setImportance] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const { data } = await memories.list();
      setMemoryList(data.memories || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const createMemory = async () => {
    if (!content.trim()) return;
    try {
      const { data } = await memories.create({ category, content, importance });
      setMemoryList((prev) => [data.memory, ...prev]);
      setContent('');
      setShowAdd(false);
    } catch {}
  };

  const updateMemory = async (id: string) => {
    const mem = memoryList.find((m) => m.id === id);
    if (!mem) return;
    try {
      await memories.update(id, { content: mem.content, category: mem.category, importance: mem.importance });
      setEditingId(null);
    } catch {}
  };

  const deleteMemory = async (id: string) => {
    try {
      await memories.delete(id);
      setMemoryList((prev) => prev.filter((m) => m.id !== id));
    } catch {}
  };

  const updateLocal = (id: string, field: string, value: any) => {
    setMemoryList((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text">Personal Memory</h1>
          <p className="text-gray-500 text-sm mt-1">Aura remembers what matters to you</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="cyber-button text-sm py-2 px-4">
          <Plus size={14} className="inline mr-1" /> New Memory
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GlassPanel className="p-4 space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What should Aura remember about you?"
                rows={3}
                className="input-cyber resize-none"
              />
              <div className="flex gap-3 flex-wrap">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-cyber flex-1 min-w-[120px]">
                  <option value="personal">Personal</option>
                  <option value="interests">Interests</option>
                  <option value="work">Work</option>
                  <option value="learning">Learning</option>
                  <option value="social">Social</option>
                </select>
                <select value={importance} onChange={(e) => setImportance(Number(e.target.value))} className="input-cyber w-28">
                  <option value={1}>Normal</option>
                  <option value={2}>Important</option>
                  <option value={3}>Very Important</option>
                </select>
                <button onClick={createMemory} className="cyber-button">Save</button>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memoryList.map((mem) => {
          const Icon = categoryIcons[mem.category] || Brain;
          const color = categoryColors[mem.category] || 'from-aura-500 to-cyber-purple';

          return (
            <motion.div
              key={mem.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <GlassPanel className="relative group">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingId === mem.id ? (
                      <textarea
                        value={mem.content}
                        onChange={(e) => updateLocal(mem.id, 'content', e.target.value)}
                        className="input-cyber text-sm mb-2"
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm text-gray-200">{mem.content}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-gray-500 uppercase">{mem.category}</span>
                      {Array.from({ length: mem.importance }).map((_, i) => (
                        <Star key={i} size={10} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingId(editingId === mem.id ? null : mem.id)} className="p-1.5 rounded-lg bg-cyber-dark/80 text-gray-400 hover:text-aura-400 transition-colors">
                    <Edit3 size={12} />
                  </button>
                  <button onClick={() => deleteMemory(mem.id)} className="p-1.5 rounded-lg bg-cyber-dark/80 text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
                {editingId === mem.id && (
                  <div className="mt-2 flex justify-end">
                    <button onClick={() => updateMemory(mem.id)} className="cyber-button text-xs py-1.5 px-3">Save</button>
                  </div>
                )}
              </GlassPanel>
            </motion.div>
          );
        })}
        {memoryList.length === 0 && !loading && (
          <div className="col-span-full">
            <GlassPanel className="text-center py-12">
              <Brain size={40} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No memories yet</p>
              <p className="text-gray-600 text-sm mt-1">Tell Aura about yourself so it can help you better</p>
            </GlassPanel>
          </div>
        )}
      </div>
    </div>
  );
}
