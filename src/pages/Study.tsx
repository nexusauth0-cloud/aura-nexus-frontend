import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Brain, Sparkles, ChevronRight, Loader2, FileText, Lightbulb } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import { study } from '../services/api';

export default function Study() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [aiAction, setAiAction] = useState<'none' | 'summarizing' | 'quiz' | 'flashcards'>('none');
  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const { data } = await study.list();
      setMaterials(data.materials || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const createMaterial = async () => {
    if (!title.trim()) return;
    try {
      const { data } = await study.create({ title, content, category });
      setMaterials((prev) => [data.material, ...prev]);
      setTitle('');
      setContent('');
      setShowCreate(false);
    } catch {}
  };

  const handleSummarize = async (id: string) => {
    setAiAction('summarizing');
    try {
      const { data } = await study.summarize(id);
      setAiResult({ type: 'summary', content: data.summary });
    } catch {} finally {
      setAiAction('none');
    }
  };

  const handleQuiz = async (id: string) => {
    setAiAction('quiz');
    try {
      const { data } = await study.generateQuiz(id);
      setAiResult({ type: 'quiz', content: data.quizzes });
    } catch {} finally {
      setAiAction('none');
    }
  };

  const handleFlashcards = async (id: string) => {
    setAiAction('flashcards');
    try {
      const { data } = await study.generateFlashcards(id);
      setAiResult({ type: 'flashcards', content: data.flashcards });
    } catch {} finally {
      setAiAction('none');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text">AI Study Companion</h1>
          <p className="text-gray-500 text-sm mt-1">Learn smarter with AI assistance</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="cyber-button text-sm py-2 px-4">
          <Plus size={14} className="inline mr-1" /> New Material
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GlassPanel className="p-4 space-y-4">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Material title" className="input-cyber" />
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste your study content here..." rows={6} className="input-cyber resize-none" />
              <div className="flex gap-3">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-cyber flex-1">
                  <option value="general">General</option>
                  <option value="science">Science</option>
                  <option value="math">Mathematics</option>
                  <option value="history">History</option>
                  <option value="language">Language</option>
                  <option value="technology">Technology</option>
                </select>
                <button onClick={createMaterial} className="cyber-button">Save</button>
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
          ) : materials.length === 0 ? (
            <GlassPanel className="text-center py-12">
              <BookOpen size={40} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No study materials yet</p>
              <p className="text-gray-600 text-sm mt-1">Upload your first study material</p>
            </GlassPanel>
          ) : (
            materials.map((material) => (
              <motion.div
                key={material.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-panel p-4 cursor-pointer transition-all ${
                  selectedMaterial?.id === material.id ? 'glow-border' : ''
                }`}
                onClick={() => setSelectedMaterial(material)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aura-500 to-cyber-purple flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{material.title}</p>
                      <p className="text-xs text-gray-500">{material.category} • {material.content?.length || 0} chars</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {material.progress > 0 && (
                      <span className="text-xs text-aura-400">{material.progress}%</span>
                    )}
                    <ChevronRight size={16} className="text-gray-600" />
                  </div>
                </div>
                {material.summary && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{material.summary}</p>
                )}
              </motion.div>
            ))
          )}
        </div>

        <div className="space-y-4">
          {selectedMaterial ? (
            <>
              <GlassPanel>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">AI Tools</h3>
                <div className="space-y-2">
                  <button onClick={() => handleSummarize(selectedMaterial.id)} disabled={aiAction !== 'none'} className="w-full flex items-center gap-2 p-3 rounded-xl bg-cyber-dark/50 hover:bg-cyber-dark/80 transition-colors text-sm">
                    <Brain size={16} className="text-aura-400" /> Summarize
                  </button>
                  <button onClick={() => handleQuiz(selectedMaterial.id)} disabled={aiAction !== 'none'} className="w-full flex items-center gap-2 p-3 rounded-xl bg-cyber-dark/50 hover:bg-cyber-dark/80 transition-colors text-sm">
                    <Lightbulb size={16} className="text-yellow-400" /> Generate Quiz
                  </button>
                  <button onClick={() => handleFlashcards(selectedMaterial.id)} disabled={aiAction !== 'none'} className="w-full flex items-center gap-2 p-3 rounded-xl bg-cyber-dark/50 hover:bg-cyber-dark/80 transition-colors text-sm">
                    <Sparkles size={16} className="text-green-400" /> Flashcards
                  </button>
                </div>
              </GlassPanel>

              {aiAction !== 'none' && (
                <GlassPanel className="text-center py-6">
                  <Loader2 size={24} className="animate-spin text-aura-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    {aiAction === 'summarizing' && 'Generating summary...'}
                    {aiAction === 'quiz' && 'Creating quiz questions...'}
                    {aiAction === 'flashcards' && 'Making flashcards...'}
                  </p>
                </GlassPanel>
              )}

              {aiResult && (
                <GlassPanel>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 capitalize">{aiResult.type}</h3>
                  {aiResult.type === 'summary' && (
                    <p className="text-sm text-gray-400">{aiResult.content}</p>
                  )}
                  {aiResult.type === 'quiz' && aiResult.content?.map((q: any, i: number) => (
                    <div key={i} className="mb-3 p-3 rounded-lg bg-cyber-dark/30">
                      <p className="text-sm text-gray-200 mb-2">{q.question}</p>
                      <div className="space-y-1">
                        {q.options?.map((opt: string, j: number) => (
                          <div key={j} className={`text-xs p-2 rounded ${j === q.correct ? 'bg-green-500/20 text-green-400' : 'text-gray-500'}`}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {aiResult.type === 'flashcards' && aiResult.content?.map((fc: any, i: number) => (
                    <div key={i} className="mb-2 p-3 rounded-lg bg-cyber-dark/30">
                      <p className="text-xs text-gray-500">Q: {fc.question}</p>
                      <p className="text-xs text-green-400 mt-1">A: {fc.answer}</p>
                    </div>
                  ))}
                </GlassPanel>
              )}
            </>
          ) : (
            <GlassPanel className="text-center py-8">
              <BookOpen size={32} className="mx-auto text-gray-600 mb-3" />
              <p className="text-sm text-gray-500">Select a material to use AI tools</p>
            </GlassPanel>
          )}
        </div>
      </div>
    </div>
  );
}
