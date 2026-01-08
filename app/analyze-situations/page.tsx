'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface AnalysisResult {
  id: string;
  name: string;
  keywordCount: number;
  uniqueKeywordCount: number;
  duplicateKeywords: number;
  totalMatched: number;
  matchRate: string;
  categoryDistribution: { 天: number; 地: number; 人: number; 變數: number };
  categoryMatchRate: { 天: number; 地: number; 人: number; 變數: number };
  categoryWeights: { 天: number; 地: number; 人: number; 變數: number };
  categoryWeightVsMatch: {
    天: { weight: string; matchRate: string; difference: string };
    地: { weight: string; matchRate: string; difference: string };
    人: { weight: string; matchRate: string; difference: string };
    變數: { weight: string; matchRate: string; difference: string };
  };
}

interface Summary {
  averageMatched: string;
  averageMatchRate: string;
  minMatched: number;
  maxMatched: number;
  totalUniqueKeywords: number;
}

export default function AnalyzeSituationsPage() {
  const router = useRouter();
  const [data, setData] = useState<{ situations: AnalysisResult[]; summary: Summary; cardPool: any } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analyze-situations')
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
          <p className="text-ink-medium">分析中...</p>
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
        <h1 className="text-4xl font-bold text-ink-dark mb-8 text-center">情境占卜數據分析</h1>

        {/* 總體統計 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-paper-light p-6 rounded-card shadow-lg border-2 border-ink-light mb-8"
        >
          <h2 className="text-2xl font-bold text-ink-dark mb-4">總體統計</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-ink-light text-sm">平均匹配卡牌數</p>
              <p className="text-2xl font-bold text-ink-dark">{data.summary.averageMatched}</p>
            </div>
            <div>
              <p className="text-ink-light text-sm">平均匹配率</p>
              <p className="text-2xl font-bold text-ink-dark">{data.summary.averageMatchRate}</p>
            </div>
            <div>
              <p className="text-ink-light text-sm">最少匹配</p>
              <p className="text-2xl font-bold text-ink-dark">{data.summary.minMatched}</p>
            </div>
            <div>
              <p className="text-ink-light text-sm">最多匹配</p>
              <p className="text-2xl font-bold text-ink-dark">{data.summary.maxMatched}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-ink-light">
            <p className="text-ink-light text-sm">卡牌池總數</p>
            <p className="text-lg font-semibold text-ink-dark">
              總計 {data.cardPool.total} 張（天 {data.cardPool.天} / 地 {data.cardPool.地} / 人 {data.cardPool.人} / 變數 {data.cardPool.變數}）
            </p>
          </div>
        </motion.div>

        {/* 各情境詳細分析 */}
        <div className="space-y-6">
          {data.situations.map((situation, index) => (
            <motion.div
              key={situation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-paper-light p-6 rounded-card shadow-lg border-2 border-ink-light"
            >
              <h3 className="text-xl font-bold text-ink-dark mb-4">{situation.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 左側：關鍵詞與匹配統計 */}
                <div>
                  <h4 className="font-semibold text-ink-dark mb-3">關鍵詞統計</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-ink-medium">關鍵詞總數：</span>
                      <span className="font-semibold text-ink-dark">{situation.keywordCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-medium">唯一關鍵詞：</span>
                      <span className="font-semibold text-ink-dark">{situation.uniqueKeywordCount}</span>
                    </div>
                    {situation.duplicateKeywords > 0 && (
                      <div className="flex justify-between text-amber-600">
                        <span>重複關鍵詞：</span>
                        <span className="font-semibold">{situation.duplicateKeywords}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-ink-medium">匹配卡牌數：</span>
                      <span className="font-semibold text-ink-dark">{situation.totalMatched} / 72</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-medium">匹配率：</span>
                      <span className="font-semibold text-ink-dark">{situation.matchRate}</span>
                    </div>
                  </div>
                </div>

                {/* 右側：類別分布 */}
                <div>
                  <h4 className="font-semibold text-ink-dark mb-3">類別分布</h4>
                  <div className="space-y-2 text-sm">
                    {(['天', '地', '人', '變數'] as const).map(category => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-ink-medium">{category}：</span>
                          <span className="font-semibold text-ink-dark">
                            {situation.categoryDistribution[category]} 張
                            ({situation.categoryMatchRate[category].toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-ink-light/20 rounded-full h-2">
                          <motion.div
                            className="bg-sky-start h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${situation.categoryMatchRate[category]}%` }}
                            transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 類別權重 vs 匹配率對比 */}
              <div className="mt-6 pt-4 border-t border-ink-light">
                <h4 className="font-semibold text-ink-dark mb-3">類別權重 vs 實際匹配率</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {(['天', '地', '人', '變數'] as const).map(category => {
                    const diff = parseFloat(situation.categoryWeightVsMatch[category].difference);
                    return (
                      <div key={category} className="bg-ink-light/10 p-3 rounded-card">
                        <div className="font-semibold text-ink-dark mb-2">{category}</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-ink-light">權重：</span>
                            <span>{situation.categoryWeightVsMatch[category].weight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ink-light">匹配率：</span>
                            <span>{situation.categoryWeightVsMatch[category].matchRate}</span>
                          </div>
                          <div className={`flex justify-between font-semibold ${
                            diff > 10 ? 'text-green-600' : diff < -10 ? 'text-red-600' : 'text-ink-medium'
                          }`}>
                            <span>差異：</span>
                            <span>{situation.categoryWeightVsMatch[category].difference}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
