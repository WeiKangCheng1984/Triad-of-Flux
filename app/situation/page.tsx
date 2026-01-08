'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import { ArrowLeft } from 'lucide-react';
import ShuffleAnimation from '@/components/ShuffleAnimation';
import { situations, drawSituationCards } from '@/lib/situations';
import { generateSituationInterpretation, generateSituationSummary } from '@/lib/situationInterpretation';
import { Situation, SituationResult } from '@/types/situation';
import { CardWeight } from '@/types/card';
import { saveLastMode, saveHistory, updateCardStats } from '@/lib/storage';

type Phase = 'select' | 'shuffling' | 'drawing' | 'result';

// 統一的顏色配置函數 - 使用明確的 HEX 顏色值確保一致性（輕柔清爽版本）
function getGradientColors(situationId: string): { start: string; end: string } {
  const colorMap: Record<string, { start: string; end: string }> = {
    work: { start: '#fb923c', end: '#f87171' },        // 工作事業 - 輕柔橙紅 (orange-400 to red-400)
    love: { start: '#f472b6', end: '#fb7185' },        // 感情關係 - 輕柔粉紅 (pink-400 to rose-400)
    health: { start: '#4ade80', end: '#34d399' },     // 健康狀態 - 輕柔綠色 (green-400 to emerald-400)
    growth: { start: '#fbbf24', end: '#fb923c' },     // 個人成長 - 輕柔金橙 (amber-400 to orange-400)
    finance: { start: '#60a5fa', end: '#818cf8' },   // 財務狀況 - 輕柔藍紫 (blue-400 to indigo-400)
    social: { start: '#22d3ee', end: '#2dd4bf' },     // 人際關係 - 輕柔青綠 (cyan-400 to teal-400)
    creative: { start: '#a78bfa', end: '#c084fc' },   // 創意靈感 - 輕柔紫色 (purple-400 to violet-400)
    decision: { start: '#94a3b8', end: '#64748b' }    // 重大決策 - 輕柔灰藍 (slate-400 to slate-500)
  };
  return colorMap[situationId] || { start: '#9ca3af', end: '#6b7280' };
}

function SituationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null);
  const [cards, setCards] = useState<CardWeight[]>([]);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [result, setResult] = useState<SituationResult | null>(null);

  // 從 URL 參數獲取情境（如果有）
  useEffect(() => {
    const situationId = searchParams.get('situation') as Situation['id'] | null;
    if (situationId) {
      const situation = situations.find(s => s.id === situationId);
      if (situation) {
        setSelectedSituation(situation);
        setPhase('shuffling');
        setIsShuffling(true);
      }
    }
  }, [searchParams]);

  const handleSelectSituation = (situation: Situation) => {
    setSelectedSituation(situation);
    setPhase('shuffling');
    setIsShuffling(true);
  };

  const handleShuffleComplete = () => {
    if (selectedSituation) {
      const drawnCards = drawSituationCards(selectedSituation, 3);
      setCards(drawnCards);
      setFlippedCards([false, false, false]);
      setCurrentStep(0);
      setIsShuffling(false);
      setPhase('drawing');
      // 記錄使用模式
      saveLastMode('situation');
    }
  };

  const handleCardClick = (index: number) => {
    if (index !== currentStep || flippedCards[index] || isShuffling) {
      return;
    }

    const newFlipped = [...flippedCards];
    newFlipped[index] = true;
    setFlippedCards(newFlipped);

    if (index === 2) {
      // 第三張卡牌翻開後，進入結果階段
      setTimeout(() => {
        if (selectedSituation) {
          const interpretation = generateSituationInterpretation(cards, selectedSituation);
          const summary = generateSituationSummary(cards, selectedSituation);
          
          const situationResult: SituationResult = {
            situation: selectedSituation,
            cards,
            interpretation,
            summary
          };
          
          setResult(situationResult);
          setPhase('result');
          
          // 記錄歷史和統計
          saveHistory({
            id: Date.now().toString(),
            mode: 'situation',
            cards: cards.map(c => c.id),
            timestamp: Date.now(),
            result: situationResult
          });
          updateCardStats(cards.map(c => c.id));
        }
      }, 1000);
    } else {
      setCurrentStep(index + 1);
    }
  };

  const handleReset = () => {
    setPhase('select');
    setSelectedSituation(null);
    setCards([]);
    setFlippedCards([]);
    setCurrentStep(0);
    setResult(null);
    setIsShuffling(false);
  };

  // 選擇情境階段
  if (phase === 'select') {
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
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-bold text-ink-dark mb-4">情境占卜</h1>
            <p className="text-ink-medium text-lg">
              選擇你關心的生活領域，獲得針對性的運勢指引
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {situations.map((situation, index) => (
              <motion.button
                key={situation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectSituation(situation)}
                className="bg-gradient-to-br p-6 rounded-card shadow-lg text-white text-left relative overflow-hidden"
                style={{
                  background: `linear-gradient(to bottom right, ${getGradientColors(situation.id).start}, ${getGradientColors(situation.id).end})`
                }}
              >
                <div className="relative z-10">
                  <div className="text-4xl mb-2">{situation.icon}</div>
                  <h3 className="text-xl font-bold mb-1">{situation.name}</h3>
                  <p className="text-white/90 text-sm">{situation.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 洗牌階段
  if (phase === 'shuffling' && isShuffling) {
    return (
      <ShuffleAnimation onComplete={handleShuffleComplete} cardCount={8} />
    );
  }

  // 抽卡階段
  if (phase === 'drawing' && selectedSituation) {
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
          <div className="text-center mb-8">
            <div 
              className="inline-block px-4 py-2 rounded-full mb-4 text-white"
              style={{
                background: `linear-gradient(to right, ${getGradientColors(selectedSituation.id).start}, ${getGradientColors(selectedSituation.id).end})`
              }}
            >
              <span className="text-2xl mr-2">{selectedSituation.icon}</span>
              <span className="font-bold">{selectedSituation.name}</span>
            </div>
            <p className="text-ink-medium mb-2">
              依序點擊卡牌，抽取三張卡牌進行解讀
            </p>
            <p className="text-ink-light text-sm">
              已翻開 {flippedCards.filter(f => f).length} / 3 張
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            {[0, 1, 2].map((index) => {
              const isClickable = index === currentStep && !flippedCards[index];
              
              return (
                <div key={index} className="flex flex-col items-center w-[280px] md:w-[300px]">
                  <div className="mb-3 text-center w-full">
                    <span className={`text-sm md:text-base font-medium ${
                      isClickable ? 'text-ink-dark' :
                      flippedCards[index] ? 'text-ink-medium' :
                      'text-ink-light'
                    }`}>
                      第 {index + 1} 張
                    </span>
                    {isClickable && (
                      <span className="block text-ink-light text-xs mt-1.5">
                        點擊翻牌
                      </span>
                    )}
                  </div>
                  <div className={`${isClickable ? 'cursor-pointer' : 'cursor-default'} w-full`} style={{ aspectRatio: '3/5.5' }}>
                    <Card
                      card={cards[index] || null}
                      isFlipped={flippedCards[index]}
                      onFlip={isClickable ? () => handleCardClick(index) : undefined}
                      isClickable={isClickable}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 結果階段
  if (phase === 'result' && result) {
    const stateColors = {
      excellent: 'from-green-500 to-emerald-600',
      good: 'from-blue-500 to-cyan-600',
      neutral: 'from-gray-400 to-gray-600',
      challenging: 'from-orange-500 to-amber-600',
      critical: 'from-red-500 to-rose-600'
    };

    const stateLabels = {
      excellent: '極佳',
      good: '良好',
      neutral: '普通',
      challenging: '挑戰',
      critical: '關鍵'
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
          {/* 情境標題 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div 
              className="inline-block px-6 py-3 rounded-full mb-4 text-white"
              style={{
                background: `linear-gradient(to right, ${getGradientColors(result.situation.id).start}, ${getGradientColors(result.situation.id).end})`
              }}
            >
              <span className="text-3xl mr-3">{result.situation.icon}</span>
              <span className="text-2xl font-bold">{result.situation.name}</span>
            </div>
          </motion.div>

          {/* 三張卡牌展示 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 justify-items-center"
          >
            {result.cards.map((card, index) => (
              <div key={index} className="w-[240px] md:w-[260px]" style={{ aspectRatio: '3/5.5' }}>
                <Card card={card} isFlipped={true} />
              </div>
            ))}
          </motion.div>

          {/* 摘要卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-paper-light border-2 border-ink-light rounded-card p-4 text-center">
              <div className="text-ink-light text-sm mb-1">整體狀態</div>
              <div className={`text-lg font-bold bg-gradient-to-r ${stateColors[result.summary.overallState]} bg-clip-text text-transparent`}>
                {stateLabels[result.summary.overallState]}
              </div>
            </div>
            <div className="bg-paper-light border-2 border-ink-light rounded-card p-4 text-center">
              <div className="text-ink-light text-sm mb-1">能量等級</div>
              <div className="text-lg font-bold text-ink-dark capitalize">
                {result.summary.energyLevel === 'high' ? '高' : result.summary.energyLevel === 'medium' ? '中' : '低'}
              </div>
            </div>
            <div className="bg-paper-light border-2 border-ink-light rounded-card p-4 text-center">
              <div className="text-ink-light text-sm mb-1">風險等級</div>
              <div className="text-lg font-bold text-ink-dark capitalize">
                {result.summary.riskLevel === 'high' ? '高' : result.summary.riskLevel === 'medium' ? '中' : '低'}
              </div>
            </div>
            <div className="bg-paper-light border-2 border-ink-light rounded-card p-4 text-center">
              <div className="text-ink-light text-sm mb-1">機會等級</div>
              <div className="text-lg font-bold text-ink-dark capitalize">
                {result.summary.opportunityLevel === 'high' ? '高' : result.summary.opportunityLevel === 'medium' ? '中' : '低'}
              </div>
            </div>
          </motion.div>

          {/* 解讀內容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-paper-light border-2 border-ink-light rounded-card p-8 md:p-10 mb-8"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-ink-dark mb-4">運勢解讀</h3>
                <p className="text-ink-medium text-lg leading-relaxed mb-4">
                  {result.interpretation.opening}{result.interpretation.analysis}
                </p>
                <p className="text-ink-medium leading-relaxed">
                  {result.interpretation.closing}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-ink-dark mb-4">行動建議</h3>
                <ul className="space-y-3">
                  {result.interpretation.advice.map((advice, index) => (
                    <li key={index} className="flex items-start gap-3 text-ink-medium">
                      <span className="text-ink-light mt-1">•</span>
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.interpretation.keyInsights.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-ink-dark mb-4">關鍵洞察</h3>
                  <ul className="space-y-2">
                    {result.interpretation.keyInsights.map((insight, index) => (
                      <li key={index} className="text-ink-medium bg-ink-light/10 p-3 rounded-card">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

          {/* 操作按鈕 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="text-white px-8 py-3 rounded-card shadow-lg font-medium"
              style={{
                background: `linear-gradient(to right, ${getGradientColors(result.situation.id).start}, ${getGradientColors(result.situation.id).end})`
              }}
            >
              重新占卜
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="bg-ink-light text-white px-8 py-3 rounded-card shadow-lg font-medium"
            >
              返回首頁
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}

export default function SituationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ink-light border-t-ink-dark rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ink-medium">載入中...</p>
        </div>
      </div>
    }>
      <SituationPageContent />
    </Suspense>
  );
}
