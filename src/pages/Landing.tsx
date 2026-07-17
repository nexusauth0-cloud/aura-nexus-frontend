import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, Mic, Brain, ClipboardList, BookOpen, Sparkles, ChevronDown, Cpu, Shield, Zap, Globe } from 'lucide-react';

function FeatureCard({ icon: Icon, title, description, gradient }: { icon: any; title: string; description: string; gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel p-6 hover:glow-border transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </motion.div>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="bg-cyber-black min-h-screen">
      <ParticleCanvas />

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aura-500 to-cyber-purple flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold neon-text">Aura Nexus</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="cyber-button-outline text-sm py-2 px-4">Sign In</Link>
          <Link to="/register" className="cyber-button text-sm py-2 px-4">Get Started</Link>
        </div>
      </nav>

      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-xs text-aura-400 mb-8">
            <Cpu size={12} /> Next-Generation AI Operating System
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="neon-text">Aura Nexus</span>
            <br />
            <span className="text-white">Your AI</span>
            <br />
            <span className="bg-gradient-to-r from-aura-400 to-cyber-glow bg-clip-text text-transparent">
              Command Center
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Experience the future of personal AI assistance — intelligent conversations,
            voice interaction, memory, productivity, and learning, all in one seamless OS.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="cyber-button text-lg px-8 py-4 flex items-center gap-2">
              <Zap size={20} /> Launch Aura Nexus
            </Link>
            <a href="#features" className="cyber-button-outline text-lg px-8 py-4 flex items-center gap-2">
              Explore Features
            </a>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={24} className="text-gray-600" />
        </motion.div>
      </motion.section>

      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="neon-text">Everything</span> You Need
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A complete AI ecosystem designed to understand, remember, and help you achieve more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard icon={MessageSquare} gradient="from-aura-500 to-blue-500" title="AI Conversations" description="Natural, context-aware conversations that understand your needs and provide intelligent assistance." />
          <FeatureCard icon={Mic} gradient="from-cyber-purple to-pink-500" title="Voice Interaction" description="Speak naturally with Aura. Voice commands, voice responses, and hands-free operation." />
          <FeatureCard icon={Brain} gradient="from-yellow-500 to-orange-500" title="Personal Memory" description="Aura remembers your preferences, interests, and important information to personalize every interaction." />
          <FeatureCard icon={ClipboardList} gradient="from-emerald-500 to-teal-500" title="Smart Productivity" description="AI-powered task management, daily planning, and focus sessions to maximize your efficiency." />
          <FeatureCard icon={BookOpen} gradient="from-purple-500 to-violet-500" title="Study Assistant" description="Upload materials, generate summaries, create quizzes and flashcards. Learn faster with AI." />
          <FeatureCard icon={Globe} gradient="from-cyan-500 to-blue-500" title="Offline & Online" description="Works with or without internet. Your AI assistant is always available, anywhere." />
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="glass-panel-strong rounded-3xl p-12 md:p-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready for the <span className="neon-text">Future</span>?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg">
              Join the next generation of AI-powered productivity. Your personal AI assistant is one click away.
            </p>
            <Link to="/register" className="cyber-button text-lg px-10 py-4">
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-cyber-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-aura-400" />
            <span className="text-sm text-gray-500">Aura Nexus — AI Personal Operating System</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <span>© 2026 Aura Nexus</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
