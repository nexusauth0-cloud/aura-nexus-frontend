import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-cyber-black flex flex-col items-center justify-center z-50">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-24 h-24 rounded-full border-2 border-transparent border-t-aura-400 border-r-cyber-purple animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-aura-500 to-cyber-purple flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-white text-2xl font-bold">A</span>
          </motion.div>
        </div>
      </motion.div>
      <motion.p
        className="mt-8 text-gray-400 font-mono text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Initializing Aura Nexus...
      </motion.p>
      <div className="mt-4 flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-aura-400"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
