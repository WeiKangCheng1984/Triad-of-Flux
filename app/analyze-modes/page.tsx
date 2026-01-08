'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AnalysisData {
  simulation: { count: number; description: string };
  single: {
    totalCards: number;
    uniqueCardsDrawn: number;
    uniqueCardsRate: string;
    categoryDistribution: { 天: number; 地: number; 人: number; 變數: number };
    categoryDistributionCheck: {
      isReasonable: boolean;
      rating: string;
      details: Record<string, { actual: number; expected: number; diff: number }>;
    };
    uniformity: { cv: number; isUniform: boolean; rating: string };
    topCards: Array<{ cardId: string; cardName: string; category: string; count: number; frequency: string }>;
  };
  fortune: {
    totalCards: number;
    uniqueCardsDrawn: number;
    uniqueCardsRate: string;
    categoryDistribution: {
      first: { 天: number; 地: number; 人: number; 變數: number };
      second: { 天: number; 地: number; 人: number; 變數: number };
      third: { 天: number; 地: number; 人: number; 變數: number };
      fourth: { 天: number; 地: number; 人: number; 變數: number };
    };
    categoryDistributionCheck: {
      first: { isReasonable: boolean; rating: string; details: Record<string, { actual: number; expected: number; diff: number }> };
      second: { isReasonable: boolean; rating: string; details: Record<string, { actual: number; expected: number; diff: number }> };
      third: { isReasonable: boolean; rating: string; details: Record<string, { actual: number; expected: number; diff: number }> };
      fourth: { isReasonable: boolean; rating: string; details: Record<string, { actual: number; expected: number; diff: number }> };
    };
    uniformity: { cv: number; isUniform: boolean; rating: string };
    topCards: Array<{ cardId: string; cardName: string; category: string; count: number; frequency: string; positions: { first: number; second: number; third: number; fourth: number } }>;
  };
  situation: {
    situations: Array<{
      id: string;
      name: string;
      uniqueCards: number;
      uniqueCardsRate: string;
      categoryDistribution: { 天: number; 地: number; 人: number; 變數: number };
      categoryDistributionCheck: {
        isReasonable: boolean;
        rating: string;
        details: Record<string, { actual: number; expected: number; diff: number }>;
      };
      uniformity: { cv: number; isUniform: boolean; rating: string };
      positionStats: {
        first: { 天: number; 地: number; 人: number; 變數: number };
        second: { 天: number; 地: number; 人: number; 變數: number };
        third: { 天: number; 地: number; 人: number; 變數: number };
      };
      topCards: Array<{ cardId: string; cardName: string; category: string; count: number; frequency: string }>;
    }>;
  };
  summary: {
    single: { uniformity: string; categoryDistribution: string; overall: string };
    fortune: { uniformity: string; categoryDistribution: string; overall: string };
    situation: { averageUniqueCards: string; averageUniformity: string; categoryDistribution: string; overall: string };
  };
}

export default function AnalyzeModesPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analyze-modes')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching analysis:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ink-light border-t-ink-dark rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ink-medium">分析中...（模擬 {data?.simulation.count || 1000} 次抽卡）</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="text-ink-medium">無法載入數據</p>
      </div>
    );
  }

  const getStatusIcon = (rating: string) => {
    if (rating.includes('非常') || rating === '良好') {
      return <CheckCircle className="text-green-600" size={20} />;
    } else if (rating.includes('較為') || rating === '較為合理') {
      return <AlertCircle className="text-yellow-600" size={20} />;
    } else {
      return <XCircle className="text-red-600" size={20} />;
    }
  };

  const categoryColors = {
    天: 'from-sky-start to-sky-end',
    地: 'from-earth-start to-earth-end',
    人: 'from-human-start to-human-end',
    變數: 'from-variable-start to-variable-end'
  };

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
        <h1 className="text-4xl font-bold text-ink-dark mb-8 text-center">三個模式統計分析</h1>
        <p className="text-center text-ink-medium mb-8">
          模擬 {data.simulation.count} 次抽卡，分析均勻度和分布合理性
        </p>

        {/* 總體摘要 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-paper-light p-6 rounded-card shadow-lg border-2 border-ink-light mb-8"
        >
          <h2 className="text-2xl font-bold text-ink-dark mb-4">總體摘要</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-ink-light/5 p-4 rounded-card">
              <h3 className="font-semibold text-ink-dark mb-2">單卡抽籤</h3>
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(data.summary.single.overall)}
                <span className="font-bold">{data.summary.single.overall}</span>
              </div>
              <p className="text-sm text-ink-medium">均勻度: {data.summary.single.uniformity}</p>
              <p className="text-sm text-ink-medium">類別分布: {data.summary.single.categoryDistribution}</p>
            </div>
            <div className="bg-ink-light/5 p-4 rounded-card">
              <h3 className="font-semibold text-ink-dark mb-2">四卡占卜</h3>
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(data.summary.fortune.overall)}
                <span className="font-bold">{data.summary.fortune.overall}</span>
              </div>
              <p className="text-sm text-ink-medium">均勻度: {data.summary.fortune.uniformity}</p>
              <p className="text-sm text-ink-medium">類別分布: {data.summary.fortune.categoryDistribution}</p>
            </div>
            <div className="bg-ink-light/5 p-4 rounded-card">
              <h3 className="font-semibold text-ink-dark mb-2">情境占卜</h3>
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(data.summary.situation.overall)}
                <span className="font-bold">{data.summary.situation.overall}</span>
              </div>
              <p className="text-sm text-ink-medium">平均卡牌種類: {data.summary.situation.averageUniqueCards}</p>
              <p className="text-sm text-ink-medium">均勻度: {data.summary.situation.averageUniformity}</p>
              <p className="text-sm text-ink-medium">類別分布: {data.summary.situation.categoryDistribution}</p>
            </div>
          </div>
        </motion.div>

        {/* 單卡模式詳細分析 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-paper-light p-6 rounded-card shadow-lg border-2 border-ink-light mb-8"
        >
          <h2 className="text-2xl font-bold text-ink-dark mb-4">單卡抽籤模式</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-ink-light text-sm">總卡牌數</p>
              <p className="text-2xl font-bold text-ink-dark">{data.single.totalCards}</p>
            </div>
            <div>
              <p className="text-ink-light text-sm">實際抽到種類</p>
              <p className="text-2xl font-bold text-ink-dark">{data.single.uniqueCardsDrawn}</p>
            </div>
            <div>
              <p className="text-ink-light text-sm">覆蓋率</p>
              <p className="text-2xl font-bold text-ink-dark">{data.single.uniqueCardsRate}</p>
            </div>
            <div>
              <p className="text-ink-light text-sm">均勻度</p>
              <div className="flex items-center gap-2">
                {getStatusIcon(data.single.uniformity.rating)}
                <p className="text-xl font-bold text-ink-dark">{data.single.uniformity.rating}</p>
              </div>
              <p className="text-xs text-ink-light">CV: {data.single.uniformity.cv.toFixed(3)}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-ink-dark mb-3">類別分布</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['天', '地', '人', '變數'] as const).map(category => {
                const detail = data.single.categoryDistributionCheck.details[category];
                const actualPercent = ((data.single.categoryDistribution[category] / data.simulation.count) * 100).toFixed(1);
                return (
                  <div key={category} className="bg-ink-light/5 p-3 rounded-card">
                    <div className="font-semibold text-ink-dark mb-1">{category}</div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-ink-light">實際:</span>
                        <span>{actualPercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-light">期望:</span>
                        <span>{detail.expected.toFixed(1)}%</span>
                      </div>
                      <div className={`flex justify-between font-semibold ${
                        detail.diff < 5 ? 'text-green-600' : detail.diff < 10 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        <span>差異:</span>
                        <span>{detail.diff.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-2">
              {getStatusIcon(data.single.categoryDistributionCheck.rating)}
              <span className="font-semibold">{data.single.categoryDistributionCheck.rating}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-ink-dark mb-3">最常出現的卡牌 (Top 10)</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.single.topCards.map((card, index) => (
                <div key={card.cardId} className="bg-ink-light/5 p-2 rounded-card text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-ink-light text-xs">#{index + 1}</span>
                      <span className="font-semibold text-ink-dark">{card.cardName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${categoryColors[card.category as keyof typeof categoryColors]}`}>
                        {card.category}
                      </span>
                    </div>
                    <span className="text-ink-medium font-semibold">{card.frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 四卡模式詳細分析 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-paper-light p-6 rounded-card shadow-lg border-2 border-ink-light mb-8"
        >
          <h2 className="text-2xl font-bold text-ink-dark mb-4">四卡占卜模式</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-ink-light text-sm">總卡牌數</p>
              <p className="text-2xl font-bold text-ink-dark">{data.fortune.totalCards}</p>
            </div>
            <div>
              <p className="text-ink-light text-sm">實際抽到種類</p>
              <p className="text-2xl font-bold text-ink-dark">{data.fortune.uniqueCardsDrawn}</p>
            </div>
            <div>
              <p className="text-ink-light text-sm">覆蓋率</p>
              <p className="text-2xl font-bold text-ink-dark">{data.fortune.uniqueCardsRate}</p>
            </div>
            <div>
              <p className="text-ink-light text-sm">均勻度</p>
              <div className="flex items-center gap-2">
                {getStatusIcon(data.fortune.uniformity.rating)}
                <p className="text-xl font-bold text-ink-dark">{data.fortune.uniformity.rating}</p>
              </div>
              <p className="text-xs text-ink-light">CV: {data.fortune.uniformity.cv.toFixed(3)}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-ink-dark mb-3">各位置類別分布（應該 100% 對應）</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(['first', 'second', 'third', 'fourth'] as const).map((position, index) => {
                const positionName = ['第一張', '第二張', '第三張', '第四張'][index];
                const expectedCategory = ['天', '地', '人', '變數'][index];
                const check = data.fortune.categoryDistributionCheck[position];
                const actual = data.fortune.categoryDistribution[position];
                const total = Object.values(actual).reduce((sum, val) => sum + val, 0);
                const actualPercent = total > 0 ? ((actual[expectedCategory as keyof typeof actual] / total) * 100).toFixed(1) : '0';
                
                return (
                  <div key={position} className="bg-ink-light/5 p-3 rounded-card">
                    <div className="font-semibold text-ink-dark mb-2">{positionName} ({expectedCategory})</div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-ink-light">實際:</span>
                        <span>{actualPercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-light">期望:</span>
                        <span>100%</span>
                      </div>
                      <div className={`flex justify-between font-semibold ${
                        parseFloat(actualPercent) > 95 ? 'text-green-600' : parseFloat(actualPercent) > 90 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        <span>差異:</span>
                        <span>{(100 - parseFloat(actualPercent)).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      {getStatusIcon(check.rating)}
                      <span className="text-xs">{check.rating}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-ink-dark mb-3">最常出現的卡牌 (Top 10)</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.fortune.topCards.map((card, index) => (
                <div key={card.cardId} className="bg-ink-light/5 p-2 rounded-card text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-ink-light text-xs">#{index + 1}</span>
                      <span className="font-semibold text-ink-dark">{card.cardName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${categoryColors[card.category as keyof typeof categoryColors]}`}>
                        {card.category}
                      </span>
                    </div>
                    <span className="text-ink-medium font-semibold">{card.frequency}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-ink-light">
                    <span>第一張: {card.positions.first}</span>
                    <span>第二張: {card.positions.second}</span>
                    <span>第三張: {card.positions.third}</span>
                    <span>第四張: {card.positions.fourth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 情境模式詳細分析 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-paper-light p-6 rounded-card shadow-lg border-2 border-ink-light mb-8"
        >
          <h2 className="text-2xl font-bold text-ink-dark mb-4">情境占卜模式</h2>
          
          <div className="space-y-6">
            {data.situation.situations.map((situation, index) => (
              <motion.div
                key={situation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-ink-light/5 p-4 rounded-card"
              >
                <h3 className="text-xl font-bold text-ink-dark mb-3">{situation.name}</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-ink-light text-sm">實際抽到種類</p>
                    <p className="text-xl font-bold text-ink-dark">{situation.uniqueCards} / {data.single.totalCards}</p>
                  </div>
                  <div>
                    <p className="text-ink-light text-sm">覆蓋率</p>
                    <p className="text-xl font-bold text-ink-dark">{situation.uniqueCardsRate}</p>
                  </div>
                  <div>
                    <p className="text-ink-light text-sm">均勻度</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(situation.uniformity.rating)}
                      <span className="font-bold">{situation.uniformity.rating}</span>
                    </div>
                    <p className="text-xs text-ink-light">CV: {situation.uniformity.cv.toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-ink-light text-sm">類別分布</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(situation.categoryDistributionCheck.rating)}
                      <span className="font-bold">{situation.categoryDistributionCheck.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-ink-dark mb-2">類別分布詳情</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['天', '地', '人', '變數'] as const).map(category => {
                      const detail = situation.categoryDistributionCheck.details[category];
                      const total = Object.values(situation.categoryDistribution).reduce((sum, val) => sum + val, 0);
                      const actualPercent = total > 0 ? ((situation.categoryDistribution[category] / total) * 100).toFixed(1) : '0';
                      return (
                        <div key={category} className="bg-white/50 p-2 rounded-card text-xs">
                          <div className="font-semibold text-ink-dark mb-1">{category}</div>
                          <div className="space-y-0.5">
                            <div className="flex justify-between">
                              <span className="text-ink-light">實際:</span>
                              <span>{actualPercent}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-ink-light">期望:</span>
                              <span>{detail.expected.toFixed(1)}%</span>
                            </div>
                            <div className={`flex justify-between font-semibold ${
                              detail.diff < 10 ? 'text-green-600' : detail.diff < 20 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              <span>差異:</span>
                              <span>{detail.diff.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-ink-dark mb-2">各位置類別分布</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(['first', 'second', 'third'] as const).map((position, posIndex) => {
                      const positionName = ['第一張', '第二張', '第三張'][posIndex];
                      const stats = situation.positionStats[position];
                      const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
                      return (
                        <div key={position} className="bg-white/50 p-2 rounded-card text-xs">
                          <div className="font-semibold text-ink-dark mb-1">{positionName}</div>
                          {(['天', '地', '人', '變數'] as const).map(category => {
                            const percent = total > 0 ? ((stats[category] / total) * 100).toFixed(1) : '0';
                            return (
                              <div key={category} className="flex justify-between">
                                <span className="text-ink-light">{category}:</span>
                                <span>{percent}%</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-ink-dark mb-2">最常出現的卡牌 (Top 5)</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {situation.topCards.slice(0, 5).map((card, idx) => (
                      <div key={card.cardId} className="bg-white/50 p-2 rounded-card text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-ink-light">#{idx + 1}</span>
                            <span className="font-semibold text-ink-dark">{card.cardName}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full text-white bg-gradient-to-r ${categoryColors[card.category as keyof typeof categoryColors]}`}>
                              {card.category}
                            </span>
                          </div>
                          <span className="text-ink-medium font-semibold">{card.frequency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
