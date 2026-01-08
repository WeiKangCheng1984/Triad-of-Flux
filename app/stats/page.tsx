'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { getCardStats, getMostFrequentCards, getHistory } from '@/lib/storage';
import { allCards, getCardById } from '@/lib/cards';
import { CardWeight } from '@/types/card';

const categoryColors = {
  天: 'from-sky-start to-sky-end',
  地: 'from-earth-start to-earth-end',
  人: 'from-human-start to-human-end',
  變數: 'from-variable-start to-variable-end'
};

const categoryNames = {
  天: '天（節氣）',
  地: '地（空間）',
  人: '人（角色）',
  變數: '變數（意外）'
};

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [mostFrequent, setMostFrequent] = useState<Array<{ id: string; count: number }>>([]);

  useEffect(() => {
    const cardStats = getCardStats();
    const historyData = getHistory();
    const frequent = getMostFrequentCards(10);
    
    setStats(cardStats);
    setHistory(historyData);
    setMostFrequent(frequent);
  }, []);

  // 計算統計數據
  const totalDraws = history.length;
  const singleDraws = history.filter(h => h.mode === 'single').length;
  const fortuneDraws = history.filter(h => h.mode === 'fortune').length;
  const totalCardsDrawn = Object.values(stats).reduce((sum, count) => sum + count, 0);
  const uniqueCards = Object.keys(stats).length;

  // 按類別統計
  const categoryStats = {
    天: 0,
    地: 0,
    人: 0,
    變數: 0
  };

  Object.entries(stats).forEach(([cardId, count]) => {
    const card = getCardById(cardId);
    if (card) {
      categoryStats[card.category] += count;
    }
  });

  return (
    <div className="min-h-screen p-4 md:p-8 relative bg-paper">
      <button
        onClick={() => router.push('/')}
        className="mb-6 flex items-center gap-2 text-ink-medium hover:text-ink-dark transition-colors"
      >
        <ArrowLeft size={20} />
        <span>返回首頁</span>
      </button>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-ink-dark mb-4">個人統計</h1>
          <p className="text-ink-medium">
            分析你的抽卡習慣與運勢趨勢
          </p>
        </motion.div>

        {/* 總覽統計 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-paper-light border-2 border-ink-light rounded-card p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-ink-medium" size={24} />
              <h3 className="text-sm font-medium text-ink-light">總抽卡次數</h3>
            </div>
            <p className="text-3xl font-bold text-ink-dark">{totalDraws}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-paper-light border-2 border-ink-light rounded-card p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Award className="text-ink-medium" size={24} />
              <h3 className="text-sm font-medium text-ink-light">收集卡牌</h3>
            </div>
            <p className="text-3xl font-bold text-ink-dark">{uniqueCards} / 72</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-paper-light border-2 border-ink-light rounded-card p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-ink-medium" size={24} />
              <h3 className="text-sm font-medium text-ink-light">單卡抽籤</h3>
            </div>
            <p className="text-3xl font-bold text-ink-dark">{singleDraws}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-paper-light border-2 border-ink-light rounded-card p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-ink-medium" size={24} />
              <h3 className="text-sm font-medium text-ink-light">四卡占卜</h3>
            </div>
            <p className="text-3xl font-bold text-ink-dark">{fortuneDraws}</p>
          </motion.div>
        </div>

        {/* 類別分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-paper-light border-2 border-ink-light rounded-card p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-ink-dark mb-6">類別分布</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['天', '地', '人', '變數'] as const).map(category => {
              const count = categoryStats[category];
              const percentage = totalCardsDrawn > 0 ? (count / totalCardsDrawn * 100).toFixed(1) : 0;
              return (
                <div key={category} className="text-center">
                  <div className={`inline-block px-4 py-2 rounded-card mb-3 bg-gradient-to-r ${categoryColors[category]} text-white font-medium`}>
                    {categoryNames[category]}
                  </div>
                  <p className="text-2xl font-bold text-ink-dark mb-1">{count}</p>
                  <p className="text-sm text-ink-light">{percentage}%</p>
                  <div className="mt-2 h-2 bg-ink-light rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className={`h-full bg-gradient-to-r ${categoryColors[category]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 最常抽到的卡牌 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-paper-light border-2 border-ink-light rounded-card p-6"
        >
          <h2 className="text-2xl font-bold text-ink-dark mb-6">最常抽到的卡牌</h2>
          {mostFrequent.length === 0 ? (
            <p className="text-ink-light text-center py-8">尚無數據</p>
          ) : (
            <div className="space-y-4">
              {mostFrequent.map((item, index) => {
                const card = getCardById(item.id);
                if (!card) return null;
                const maxCount = mostFrequent[0]?.count || 1;
                const percentage = (item.count / maxCount * 100).toFixed(0);
                
                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-ink-light/20 rounded-full font-bold text-ink-dark">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[card.category]} text-white`}>
                          {card.category}
                        </div>
                        <h3 className="font-bold text-ink-dark">{card.name}</h3>
                        <span className="text-ink-light text-sm">×{item.count}</span>
                      </div>
                      <div className="h-2 bg-ink-light rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                          className={`h-full bg-gradient-to-r ${categoryColors[card.category]}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
