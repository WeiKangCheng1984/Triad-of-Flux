'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import { drawRandomCard } from '@/lib/cards';
import { calculateFortune, generateFortuneText } from '@/lib/fortune';
import { CardWeight, FortuneText } from '@/types/card';
import { ArrowLeft } from 'lucide-react';
import ShuffleAnimation from '@/components/ShuffleAnimation';

const categories: CardWeight['category'][] = ['天', '地', '人', '變數'];
const categoryNames = { 天: '天（節氣）', 地: '地（空間）', 人: '人（角色）', 變數: '變數（意外）' };

export default function FortunePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'drawing' | 'result' | 'calculating'>('drawing');
  const [cards, setCards] = useState<(CardWeight | null)[]>([null, null, null, null]);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false, false]);
  const [currentStep, setCurrentStep] = useState(0);
  const [fortuneResult, setFortuneResult] = useState<FortuneText | null>(null);
  const [isShuffling, setIsShuffling] = useState(true); // 初始狀態為洗牌中

  // 初始洗牌完成後，抽取四張卡牌
  const handleShuffleComplete = () => {
    // 同時抽取四張卡牌
    const newCards: CardWeight[] = [
      drawRandomCard('天'),
      drawRandomCard('地'),
      drawRandomCard('人'),
      drawRandomCard('變數')
    ];
    setCards(newCards);
    setIsShuffling(false);
  };

  // 點擊卡牌翻轉
  const handleCardClick = (index: number) => {
    if (index !== currentStep || flippedCards[index] || !cards[index] || isShuffling) {
      return;
    }

    // 直接翻轉卡牌
    const newFlipped = [...flippedCards];
    newFlipped[index] = true;
    setFlippedCards(newFlipped);

    if (index === 3) {
      // 第四張卡牌翻開後，進入計算階段
      setTimeout(() => {
        setPhase('calculating');
        setTimeout(() => {
          const allCards = cards as CardWeight[];
          const calculation = calculateFortune(
            allCards[0],
            allCards[1],
            allCards[2],
            allCards[3]
          );
          const text = generateFortuneText(
            [allCards[0], allCards[1], allCards[2], allCards[3]],
            calculation
          );
          setFortuneResult(text);
          setPhase('result');
        }, 2000);
      }, 1000);
    } else {
      setCurrentStep(index + 1);
    }
  };

  const handleReset = () => {
    setPhase('drawing');
    setCards([null, null, null, null]);
    setFlippedCards([false, false, false, false]);
    setCurrentStep(0);
    setFortuneResult(null);
    setIsShuffling(true); // 重新開始時觸發洗牌動畫
  };

  if (phase === 'drawing') {
    return (
      <div className="min-h-screen p-4 md:p-8 relative bg-paper">
        {/* 洗牌動畫 */}
        {isShuffling && (
          <ShuffleAnimation onComplete={handleShuffleComplete} cardCount={8} />
        )}

        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-ink-medium hover:text-ink-dark transition-colors"
        >
          <ArrowLeft size={20} />
          <span>返回首頁</span>
        </button>

        <div className="max-w-6xl mx-auto">
          <div className="space-y-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-ink-dark mb-4">四卡占卜</h1>
              <p className="text-ink-medium mb-2 text-base md:text-lg">
                由左至右依序點擊卡牌，抽取天、地、人、變數四張卡牌
              </p>
              <p className="text-ink-light text-sm mb-8">
                已翻開 {flippedCards.filter(f => f).length} / 4 張
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 justify-items-center">
              {[0, 1, 2, 3].map((index) => {
                const isClickable = index === currentStep && !flippedCards[index] && !isShuffling;
                const hasCard = cards[index] !== null;
                
                return (
                  <div key={index} className="flex flex-col items-center w-[198px] md:w-[221px]">
                    <div className="mb-3 text-center w-full">
                      <span className={`text-sm md:text-base font-medium ${
                        isClickable ? 'text-ink-dark' : 
                        flippedCards[index] ? 'text-ink-medium' : 
                        hasCard ? 'text-ink-medium' :
                        'text-ink-light'
                      }`}>
                        {categoryNames[categories[index]]}
                      </span>
                      {isClickable && (
                        <span className="block text-ink-light text-xs mt-1.5">
                          點擊翻牌
                        </span>
                      )}
                    </div>
                    <div className={`${isClickable ? 'cursor-pointer' : 'cursor-default'} w-full`} style={{ aspectRatio: '3/5.5' }}>
                      <Card
                        card={cards[index]}
                        isFlipped={flippedCards[index]}
                        onFlip={isClickable ? () => handleCardClick(index) : undefined}
                        isClickable={isClickable}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {!isShuffling && flippedCards.filter(f => f).length < 4 && (
              <div className="text-center text-ink-medium text-sm mt-6">
                <p>
                  {currentStep < 4 
                    ? `請點擊「${categoryNames[categories[currentStep]]}」卡牌翻開`
                    : '所有卡牌已翻開，正在計算運勢...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'calculating') {
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
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-ink-light border-t-ink-dark rounded-full mx-auto mb-4 animate-spin" />
              <p className="text-ink-medium text-lg">正在計算運勢...</p>
            </div>
          </div>
        </div>
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
        <div className="space-y-10">
          <h1 className="text-4xl font-bold text-ink-dark text-center mb-10">你的運勢解讀</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12 justify-items-center">
            {cards.map((card, index) => {
              if (!card) return null;
              return (
                <div key={index} className="w-[198px] md:w-[221px]" style={{ aspectRatio: '3/5.5' }}>
                  <Card card={card} isFlipped={true} />
                </div>
              );
            })}
          </div>

          {fortuneResult && (
            <div className="bg-paper-light p-8 md:p-10 rounded-card shadow-lg space-y-6 border-2 border-ink-light">
              <div>
                <h2 className="text-2xl font-bold text-ink-dark mb-3">整體運勢</h2>
                <p className="text-ink-medium text-base md:text-lg leading-relaxed mb-2">
                  {fortuneResult.opening}
                </p>
                <p className="text-ink-medium text-base md:text-lg leading-relaxed">
                  {fortuneResult.analysis}
                </p>
              </div>

              {fortuneResult.dimensions && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-paper rounded-lg border border-ink-light">
                  {[
                    { label: '能量流動', value: fortuneResult.dimensions.energyFlow },
                    { label: '環境適應', value: fortuneResult.dimensions.environmentAdaptation },
                    { label: '人際動態', value: fortuneResult.dimensions.relationshipDynamics },
                    { label: '變數影響', value: fortuneResult.dimensions.variableImpact }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-ink-light text-xs mb-1">{item.label}</div>
                      <div className="text-ink-dark text-sm font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {fortuneResult.keyThemes && fortuneResult.keyThemes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-ink-dark mb-2">關鍵主題</h3>
                  <div className="flex flex-wrap gap-2">
                    {fortuneResult.keyThemes.map((theme, index) => (
                      <span
                        key={index}
                        className="text-ink-medium text-sm px-3 py-1 bg-ink-light/20 rounded-full border border-ink-light/30"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-ink-dark mb-3">建議</h2>
                <ul className="space-y-3">
                  {fortuneResult.advice.map((item, index) => (
                    <li
                      key={index}
                      className="text-ink-medium text-base md:text-lg flex items-start bg-paper p-3 rounded-lg border-l-4 border-ink-dark/20"
                    >
                      <span className="text-ink-dark mr-3 text-xl">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-ink-light">
                <p className="text-ink-medium text-base md:text-lg italic text-center">
                  {fortuneResult.closing}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReset}
              className="bg-gradient-to-br from-earth-start to-earth-end text-white px-6 py-3 rounded-card shadow-lg hover:opacity-90 transition-opacity"
            >
              重新抽卡
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-ink-light text-white px-6 py-3 rounded-card shadow-lg hover:opacity-90 transition-opacity"
            >
              返回首頁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
