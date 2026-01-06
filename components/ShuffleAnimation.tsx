'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CardBack from './CardBack';

interface ShuffleAnimationProps {
  onComplete: () => void;
  cardCount?: number; // 洗牌卡牌數量，預設 10 張
}

export default function ShuffleAnimation({ onComplete, cardCount = 10 }: ShuffleAnimationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 生成卡牌位置（堆疊效果）
  const cards = Array.from({ length: cardCount }, (_, i) => ({
    id: i,
    // 堆疊時每張卡牌有輕微偏移，形成堆疊效果
    offsetX: (Math.random() - 0.5) * 6,
    offsetY: (Math.random() - 0.5) * 6,
    rotation: (Math.random() - 0.5) * 8,
    zIndex: i,
    // 初始堆疊縮放
    initialScale: 0.92 + i * 0.008,
  }));

  if (!mounted) return null;

  // 動畫時間配置
  const totalDuration = 4.5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/95 backdrop-blur-sm">
      <div className="relative flex items-center justify-center" style={{ width: '50%', maxWidth: '176px', aspectRatio: '3/5.5' }}>
        {cards.map((card, index) => {
          const shuffleFastEnd = 2.5; // 快速洗牌結束時間
          const shuffleSlowEnd = 3.5; // 減速洗牌結束時間
          const selectStart = 3.5; // 選中階段開始
          
          // 生成洗牌動畫關鍵幀（快速階段：0-2.5秒）
          const generateShuffleKeyframes = (base: number, amplitude: number, count: number) => {
            const keyframes = [base];
            for (let i = 1; i < count; i++) {
              const progress = i / (count - 1);
              const currentAmplitude = amplitude * (1 - progress * 0.6); // 逐漸減小幅度
              keyframes.push(base + (Math.random() - 0.5) * currentAmplitude);
            }
            return keyframes;
          };

          // 洗牌階段動畫值
          const shuffleY = generateShuffleKeyframes(card.offsetY, 80, 15);
          const shuffleX = generateShuffleKeyframes(card.offsetX, 35, 15);
          const shuffleRotate = generateShuffleKeyframes(card.rotation, 12, 15);
          
          // 減速階段（2.5-3.5秒）：逐漸回到中心
          const slowY = [...shuffleY.slice(-1), card.offsetY * 0.5, card.offsetY * 0.2, 0];
          const slowX = [...shuffleX.slice(-1), card.offsetX * 0.5, card.offsetX * 0.2, 0];
          const slowRotate = [...shuffleRotate.slice(-1), card.rotation * 0.5, card.rotation * 0.2, 0];
          
          // 選中階段：只有第一張卡牌（index 0）會被選中
          const isSelected = index === 0;
          
          // 完整的動畫值
          const finalY = isSelected 
            ? [...shuffleY, ...slowY.slice(1)] 
            : [...shuffleY, ...slowY.slice(1), slowY[slowY.length - 1]];
          const finalX = isSelected 
            ? [...shuffleX, ...slowX.slice(1)] 
            : [...shuffleX, ...slowX.slice(1), slowX[slowX.length - 1]];
          const finalRotate = isSelected 
            ? [...shuffleRotate, ...slowRotate.slice(1)] 
            : [...shuffleRotate, ...slowRotate.slice(1), slowRotate[slowRotate.length - 1]];
          
          // 時間點配置
          const timePoints: number[] = [];
          // 快速洗牌階段（0-2.5秒，15個關鍵幀）
          for (let i = 0; i < 15; i++) {
            timePoints.push(i / 14 * (shuffleFastEnd / totalDuration));
          }
          // 減速階段（2.5-3.5秒，3個關鍵幀）
          for (let i = 1; i <= 3; i++) {
            timePoints.push((shuffleFastEnd + (i / 3) * (shuffleSlowEnd - shuffleFastEnd)) / totalDuration);
          }
          // 選中階段（3.5-4.5秒）
          if (isSelected) {
            timePoints.push(selectStart / totalDuration, 1);
          } else {
            timePoints.push(selectStart / totalDuration, 0.98, 1);
          }
          
          return (
            <motion.div
              key={card.id}
              className="absolute w-full h-full"
              style={{
                zIndex: isSelected ? 100 : card.zIndex,
              }}
              initial={{
                x: card.offsetX,
                y: card.offsetY,
                rotate: card.rotation,
                opacity: 1,
                scale: card.initialScale,
              }}
              animate={{
                x: finalX,
                y: finalY,
                rotate: finalRotate,
                scale: isSelected 
                  ? [...Array(18).fill(card.initialScale), card.initialScale, 1]
                  : [...Array(18).fill(card.initialScale), card.initialScale, 0.7],
                opacity: isSelected 
                  ? Array(20).fill(1)
                  : [...Array(19).fill(1), 0.3, 0],
              }}
              transition={{
                duration: totalDuration,
                times: timePoints,
                ease: isSelected 
                  ? [0.16, 1, 0.3, 1] // 選中卡牌使用平滑緩動
                  : 'easeInOut', // 其他卡牌使用標準緩動
              }}
            >
              <CardBack />
            </motion.div>
          );
        })}
      </div>
      
      {/* 完成後調用回調 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{ duration: totalDuration, times: [0, 0.95, 1] }}
        onAnimationComplete={onComplete}
        className="absolute"
        style={{ pointerEvents: 'none', width: 0, height: 0 }}
      />
    </div>
  );
}

