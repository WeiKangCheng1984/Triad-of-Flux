'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardRevealProps {
  children: ReactNode;
  delay?: number;
  onReveal?: () => void;
}

export default function CardReveal({ children, delay = 0, onReveal }: CardRevealProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.8,
        rotateY: -90
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotateY: 0
      }}
      transition={{ 
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      onAnimationComplete={onReveal}
      style={{ 
        transformStyle: 'preserve-3d'
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

