import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Square, Sparkles, Trash2, Plus, User, Bot } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import AnimatedAICore from '../components/ui/AnimatedAICore';
import { useAppStore } from '../store/appStore';
import { conversations } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function Assistant() {
  const { assistantStatus, setAssistantStatus } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [convId, setConvId] = useState<string | null>(null);
  const [convList, setConvList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    createNewConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const { data } = await conversations.list();
      setConvList(data.conversations || []);
    } catch {}
  };

  const createNewConversation = async () => {
    try {
      const { data } = await conversations.create();
      setConvId(data.conversation.id);
      setMessages([]);
    } catch {}
  };

  const loadConversation = async (id: string) => {
    try {
      const { data } = await conversations.get(id);
      setConvId(id);
      setMessages(data.conversation.messages || []);
    } catch {}
  };

  const sendMessage = async () => {
    if (!input.trim() || !convId) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setAssistantStatus('thinking');
    setLoading(true);

    try {
      const { data } = await conversations.sendMessage(convId, input);
      const aiMsg: Message = { role: 'assistant', content: data.response, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, aiMsg]);
      setAssistantStatus('idle');
      if (data.entities?.memories) {
        // memory created
      }
      loadConversations();
    } catch {
      const fallbackMsg: Message = {
        role: 'assistant',
        content: "I'm having trouble connecting to my cloud services. I'll use my offline knowledge to help you. What would you like to know?",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setAssistantStatus('idle');
    }
    setLoading(false);
  };

  const deleteConversation = async (id: string) => {
    try {
      await conversations.delete(id);
      if (convId === id) {
        createNewConversation();
      }
      loadConversations();
    } catch {}
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      <div className="hidden md:flex flex-col w-64 space-y-2">
        <button onClick={createNewConversation} className="cyber-button text-sm py-2 px-4 w-full flex items-center gap-2 justify-center mb-4">
          <Plus size={16} /> New Chat
        </button>
        <div className="flex-1 overflow-y-auto space-y-1">
          {convList.map((conv) => (
            <button
              key={conv.id}
              onClick={() => loadConversation(conv.id)}
              className={`w-full text-left p-3 rounded-xl text-sm transition-all ${
                convId === conv.id ? 'bg-aura-500/20 border border-aura-500/20' : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="truncate flex-1">{conv.title}</span>
                <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }} className="text-gray-600 hover:text-red-400 ml-2">
                  <Trash2 size={12} />
                </button>
              </div>
              <p className="text-[10px] text-gray-600 mt-1">
                {new Date(conv.updated_at || conv.created_at).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>

      <GlassPanel className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-cyber-border">
          <div className="flex items-center gap-3">
            <AnimatedAICore size={40} status={assistantStatus} />
            <div>
              <h2 className="text-sm font-semibold">AI Assistant</h2>
              <p className="text-xs text-gray-500">{assistantStatus === 'thinking' ? 'Thinking...' : 'Online'}</p>
            </div>
          </div>
          <button onClick={createNewConversation} className="text-gray-400 hover:text-white transition-colors md:hidden">
            <Plus size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <AnimatedAICore size={100} status="idle" />
              <p className="mt-4 text-gray-400 text-sm">Start a conversation with Aura</p>
              <p className="text-gray-600 text-xs mt-1">Ask me anything, I'm here to help!</p>
            </div>
          )}
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aura-500 to-cyber-purple flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-aura-600 to-cyber-purple text-white rounded-tr-sm'
                    : 'glass-panel rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-purple to-pink-500 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Type a message..."
            className="input-cyber flex-1"
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={!input.trim() || loading} className="cyber-button p-3">
            <Send size={18} />
          </button>
          <button onClick={() => useAppStore.getState().setActiveView('voice')} className="cyber-button-outline p-3">
            <Mic size={18} />
          </button>
        </div>
      </GlassPanel>
    </div>
  );
}
