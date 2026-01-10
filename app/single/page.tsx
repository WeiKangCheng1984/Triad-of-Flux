'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import { drawRandomCard } from '@/lib/cards';
import { interpretSingleCard } from '@/lib/singleCard';
import { CardWeight } from '@/types/card';
import { ArrowLeft } from 'lucide-react';
import ParticleEffect from '@/components/ParticleEffect';
import ShimmerEffect from '@/components/ShimmerEffect';
import ShuffleAnimation from '@/components/ShuffleAnimation';
import { saveLastMode, saveHistory, updateCardStats } from '@/lib/storage';

export default function SingleCardPage() {
  const router = useRouter();
  const [card, setCard] = useState<CardWeight | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof interpretSingleCard> | null>(null);
  const [isShuffling, setIsShuffling] = useState(true); // 初始狀態為洗牌中
  const [pendingCard, setPendingCard] = useState<CardWeight | null>(null);

  // 進入頁面時自動抽取卡牌並觸發洗牌動畫
  useEffect(() => {
    if (!card && !pendingCard) {
      const newCard = drawRandomCard();
      setPendingCard(newCard);
    }
  }, []);

  const handleShuffleComplete = () => {
    // 洗牌動畫完成後，顯示卡牌
    if (pendingCard) {
      setCard(pendingCard);
      setPendingCard(null);
      setIsFlipped(false);
      setResult(null);
      // 記錄使用模式
      saveLastMode('single');
    }
    setIsShuffling(false);
  };

  const handleDraw = () => {
    // 再抽一張時，重新觸發洗牌動畫
    const newCard = drawRandomCard();
    setPendingCard(newCard);
    setIsShuffling(true);
    setCard(null);
    setIsFlipped(false);
    setResult(null);
  };

  const handleFlip = () => {
    if (!isFlipped && card) {
      setIsFlipped(true);
      setTimeout(() => {
        const result = interpretSingleCard(card);
        setResult(result);
        // 記錄歷史和統計
        saveHistory({
          id: Date.now().toString(),
          mode: 'single',
          cards: [card.id],
          timestamp: Date.now(),
          result
        });
        updateCardStats([card.id]);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative bg-paper">
      {/* 洗牌動畫 */}
      {isShuffling && (
        <ShuffleAnimation onComplete={handleShuffleComplete} cardCount={10} />
      )}

      {/* 背景粒子效果 */}
      {!card && !isShuffling && (
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
        {!isShuffling && card && (
          <div className="space-y-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-ink-dark mb-4">單卡抽籤</h1>
              <p className="text-ink-medium mb-2 text-base md:text-lg">
                從四類中隨機抽取一張卡牌，獲得即時的心理認知與日常指引
              </p>
              {!isFlipped && (
                <p className="text-ink-light text-sm">
                  點擊卡牌翻開查看結果
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <div className="w-[240px] md:w-[280px]" style={{ aspectRatio: '3/5.5' }}>
                <Card
                  card={card}
                  isFlipped={isFlipped}
                  onFlip={handleFlip}
                  isClickable={!isFlipped}
                />
              </div>
            </div>

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
        
        {/* 洗牌中或等待狀態時顯示標題 */}
        {isShuffling && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-ink-dark mb-4">單卡抽籤</h1>
            <p className="text-ink-medium text-lg">正在為您抽取卡牌...</p>
          </div>
        )}
      </div>
    </div>
  );
}

