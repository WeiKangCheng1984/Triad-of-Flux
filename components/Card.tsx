'use client';

import { motion } from 'framer-motion';
import { CardWeight } from '@/types/card';
import CardBack from './CardBack';
import CardFront from './CardFront';

interface CardProps {
  card: CardWeight | null;
  isFlipped: boolean;
  onFlip?: () => void;
  className?: string;
  isClickable?: boolean;
}

export default function Card({ card, isFlipped, onFlip, className = '', isClickable = false }: CardProps) {
  return (
    <div 
      className={`relative w-full ${className}`} 
      style={{ aspectRatio: '3/5.5' }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        <motion.div
          className="w-full h-full relative"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 背面 - 初始狀態顯示（rotateY=0時可見） */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <CardBack />
          </div>
          
          {/* 正面 - 翻轉後顯示（rotateY=180時可見） */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            {card ? (
              <CardFront card={card} />
            ) : (
              <CardBack />
            )}
          </div>
        </motion.div>
      </motion.div>
      
      {!isFlipped && onFlip && (
        <button
          onClick={onFlip}
          className="absolute inset-0 w-full h-full z-10 cursor-pointer"
          aria-label="翻牌"
        />
      )}
    </div>
  );
}

