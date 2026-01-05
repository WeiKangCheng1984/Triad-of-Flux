'use client';

import { motion } from 'framer-motion';

interface ShimmerEffectProps {
  children: React.ReactNode;
  className?: string;
}

export default function ShimmerEffect({ children, className = '' }: ShimmerEffectProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '200%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
}

