import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export default function GlassPanel({ children, className = '', glow = false, onClick }: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-panel rounded-2xl p-6 ${glow ? 'glow-border' : ''} ${onClick ? 'cursor-pointer hover:bg-cyber-card/60 transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
