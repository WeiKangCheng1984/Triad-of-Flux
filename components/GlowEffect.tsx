'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowEffectProps {
  children: ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  className?: string;
}

export default function GlowEffect({ 
  children, 
  intensity = 'medium',
  color = 'rgba(45, 55, 72, 0.3)',
  className = ''
}: GlowEffectProps) {
  const intensityMap = {
    low: '0 0 20px',
    medium: '0 0 40px',
    high: '0 0 60px'
  };

  return (
    <motion.div
      className={className}
      style={{
        filter: `drop-shadow(${intensityMap[intensity]} ${color})`
      }}
      animate={{
        boxShadow: [
          `0 0 ${intensity === 'high' ? 60 : intensity === 'medium' ? 40 : 20}px ${color}`,
          `0 0 ${intensity === 'high' ? 80 : intensity === 'medium' ? 60 : 30}px ${color}`,
          `0 0 ${intensity === 'high' ? 60 : intensity === 'medium' ? 40 : 20}px ${color}`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
}

