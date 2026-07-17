import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedAICoreProps {
  size?: number;
  status?: 'idle' | 'listening' | 'thinking' | 'speaking';
  className?: string;
}

export default function AnimatedAICore({ size = 200, status = 'idle', className = '' }: AnimatedAICoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 60 + Math.random() * 40;
      particles.push({
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 1 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.7,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const pulseIntensity = status === 'thinking' ? 1.2 : status === 'listening' ? 1.1 : status === 'speaking' ? 1.15 : 1;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80 * pulseIntensity);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
      gradient.addColorStop(0.3, 'rgba(124, 58, 237, 0.3)');
      gradient.addColorStop(0.6, 'rgba(0, 240, 255, 0.15)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, 80 * pulseIntensity, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      const ringGradient = ctx.createConicGradient(0, centerX, centerY);
      ringGradient.addColorStop(0, 'rgba(99, 102, 241, 0.6)');
      ringGradient.addColorStop(0.25, 'rgba(0, 240, 255, 0.4)');
      ringGradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.6)');
      ringGradient.addColorStop(0.75, 'rgba(236, 72, 153, 0.4)');
      ringGradient.addColorStop(1, 'rgba(99, 102, 241, 0.6)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, 50 * pulseIntensity, 0, Math.PI * 2);
      ctx.strokeStyle = ringGradient;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 35 * pulseIntensity, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      const time = Date.now() / 1000;
      const glowSize = 40 + Math.sin(time * 2) * 10;
      const innerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize);
      innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      innerGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
      innerGradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = innerGradient;
      ctx.fill();

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 90;

        if (dist > maxDist) {
          const angle = Math.atan2(dy, dx);
          p.x = centerX + Math.cos(angle) * (maxDist - 5);
          p.y = centerY + Math.sin(angle) * (maxDist - 5);
          p.vx *= -0.5;
          p.vy *= -0.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 180, 252, ${p.alpha * (0.5 + Math.sin(time + p.x) * 0.3)})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [status]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="absolute inset-0"
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: status === 'listening' ? [1, 1.05, 1] : status === 'thinking' ? [1, 1.08, 1] : 1,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-aura-400 to-cyber-purple blur-xl opacity-60" />
          <div className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-br from-aura-400 to-cyber-purple flex items-center justify-center">
            <span className="text-white text-lg font-bold">A</span>
          </div>
        </div>
      </motion.div>

      {(status === 'listening' || status === 'speaking') && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-aura-400 to-cyber-glow rounded-full"
              animate={{
                height: status === 'listening' ? [8, 20, 8] : [12, 24, 12],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
