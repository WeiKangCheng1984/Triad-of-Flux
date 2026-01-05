'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import { drawRandomCard } from '@/lib/cards';
import { interpretSingleCard } from '@/lib/singleCard';
import { CardWeight } from '@/types/card';
import { ArrowLeft } from 'lucide-react';
import ParticleEffect from '@/components/ParticleEffect';
import ShimmerEffect from '@/components/ShimmerEffect';

export default function SingleCardPage() {
  const router = useRouter();
  const [card, setCard] = useState<CardWeight | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof interpretSingleCard> | null>(null);

  const handleDraw = () => {
    const newCard = drawRandomCard();
    setCard(newCard);
    setIsFlipped(false);
    setResult(null);
  };

  const handleFlip = () => {
    if (!isFlipped && card) {
      setIsFlipped(true);
      setTimeout(() => {
        setResult(interpretSingleCard(card));
      }, 800);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative bg-paper">
      {/* 背景粒子效果 */}
      {!card && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <ParticleEffect count={20} color="rgba(45, 55, 72, 0.15)" />
        </div>
      )}

      <button
        onClick={() => router.push('/')}
        className="mb-6 flex items-center gap-2 text-ink-medium hover:text-ink-dark transition-colors relative z-10"
      >
        <ArrowLeft size={20} />
        <span>返回首頁</span>
      </button>

      <div className="max-w-4xl mx-auto relative z-10">
        {!card ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <ShimmerEffect>
              <h1 className="text-4xl font-bold text-ink-dark mb-8">單卡抽籤</h1>
            </ShimmerEffect>
            <p className="text-ink-medium mb-12 text-lg">從四類中隨機抽取一張卡牌</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDraw}
              className="bg-gradient-to-br from-sky-start to-sky-end text-white px-8 py-4 rounded-card text-lg font-medium shadow-lg relative overflow-hidden"
            >
              <span className="relative z-10">開始抽卡</span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-12">
            <div className="flex justify-center">
              <div className="w-[353px] md:w-[441px]" style={{ aspectRatio: '3/5.5' }}>
                <Card
                  card={card}
                  isFlipped={isFlipped}
                  onFlip={handleFlip}
                  isClickable={!isFlipped}
                />
              </div>
            </div>

            {/* 點擊翻牌提示 */}
            {!isFlipped && (
              <div className="text-center mt-6">
                <p className="text-ink-medium text-sm animate-pulse">
                  點擊卡牌翻開
                </p>
              </div>
            )}

            {/* 解讀區塊在下方 */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-paper-light p-8 md:p-10 rounded-card shadow-lg border-2 border-ink-light mt-12"
              >
                  <ShimmerEffect>
                    <h2 className="text-2xl font-bold text-ink-dark mb-4">解讀</h2>
                  </ShimmerEffect>
                  <div className="space-y-4 text-ink-medium">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="font-semibold text-ink-dark mb-2">關鍵詞</h3>
                      <p>{result.meaning}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="font-semibold text-ink-dark mb-2">建議</h3>
                      <p>{result.advice}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="font-semibold text-ink-dark mb-2">適用情境</h3>
                      <p>{result.context}</p>
                    </motion.div>
                  </div>
                </motion.div>
            )}

            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDraw}
                className="bg-gradient-to-br from-earth-start to-earth-end text-white px-6 py-3 rounded-card shadow-lg"
              >
                再抽一張
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
                className="bg-ink-light text-white px-6 py-3 rounded-card shadow-lg"
              >
                返回首頁
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

