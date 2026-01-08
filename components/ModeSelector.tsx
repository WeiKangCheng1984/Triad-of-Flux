'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ParticleEffect from './ParticleEffect';
import ShimmerEffect from './ShimmerEffect';
import GlowEffect from './GlowEffect';
import { getLastMode, saveLastMode } from '@/lib/storage';
import { BookOpen, History, BarChart3, Zap } from 'lucide-react';

export default function ModeSelector() {
  const router = useRouter();
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [lastMode, setLastMode] = useState<'single' | 'fortune' | 'situation' | null>(null);
  
  const titleChars = ['天', '地', '人', '變數', '卡牌'];
  
  useEffect(() => {
    // 逐字顯示標題
    titleChars.forEach((_, index) => {
      setTimeout(() => {
        setTitleVisible(true);
      }, index * 200);
    });
    
    // 顯示副標題
    setTimeout(() => {
      setSubtitleVisible(true);
    }, titleChars.length * 200 + 300);
    
    // 獲取上次使用的模式
    const mode = getLastMode();
    setLastMode(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleModeClick = (mode: 'single' | 'fortune') => {
    saveLastMode(mode);
    router.push(`/${mode}`);
  };
  
  const handleQuickStart = () => {
    if (lastMode) {
      if (lastMode === 'situation') {
        router.push('/situation');
      } else {
        router.push(`/${lastMode}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* 背景粒子效果 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticleEffect count={25} color="rgba(45, 55, 72, 0.1)" />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* 標題區域 - 逐字動畫 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <ShimmerEffect>
            <h1 className="text-5xl md:text-6xl font-bold text-ink-dark mb-4 flex justify-center items-center gap-2 flex-wrap">
              {titleChars.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ 
                    opacity: titleVisible ? 1 : 0,
                    y: titleVisible ? 0 : 20,
                    scale: titleVisible ? 1 : 0.8
                  }}
                  transition={{ 
                    delay: index * 0.2,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="inline-block"
                  style={{
                    textShadow: '0 2px 10px rgba(26, 26, 26, 0.2)'
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
          </ShimmerEffect>
          
          <AnimatePresence>
            {subtitleVisible && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.p 
                  className="text-ink-medium text-base md:text-lg max-w-2xl mx-auto mb-2"
                >
                  透過「天意」與「自問」，探索內心狀態與運勢指引
                </motion.p>
                <motion.p 
                  className="text-ink-light text-sm max-w-xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  適合心理認知、朋友互動、運勢占卜
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 快速開始按鈕 */}
        {lastMode && subtitleVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="flex justify-center mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickStart}
              className="flex items-center gap-2 bg-gradient-to-r from-ink-light to-ink-medium text-white px-6 py-3 rounded-card shadow-lg text-sm font-medium"
            >
              <Zap size={16} />
              <span>快速開始 {
                lastMode === 'single' ? '單卡抽籤' : 
                lastMode === 'fortune' ? '四卡占卜' : 
                '情境占卜'
              }</span>
            </motion.button>
          </motion.div>
        )}

        {/* 模式選擇卡片 */}
        <AnimatePresence>
          {subtitleVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* 單卡抽籤 */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <GlowEffect intensity="medium" color="rgba(74, 85, 104, 0.3)">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleModeClick('single')}
                      className="bg-gradient-to-br from-sky-start to-sky-end p-8 rounded-card shadow-lg text-white text-left w-full relative overflow-hidden h-full"
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        animate={{
                          x: ['-100%', '200%']
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear'
                        }}
                      />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-2xl font-bold">單卡抽籤</h2>
                          {lastMode === 'single' && (
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">推薦</span>
                          )}
                        </div>
                        <p className="text-white/90 mb-4">快速指引</p>
                        <p className="text-white/80 text-sm leading-relaxed">
                          從四類中隨機抽取一張卡牌，獲得即時的心理認知與日常指引
                        </p>
                      </div>
                    </motion.button>
                  </GlowEffect>
                </motion.div>

                {/* 四卡占卜 */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                >
                  <GlowEffect intensity="medium" color="rgba(85, 60, 154, 0.3)">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleModeClick('fortune')}
                      className="bg-gradient-to-br from-variable-start to-variable-end p-8 rounded-card shadow-lg text-white text-left w-full relative overflow-hidden h-full"
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        animate={{
                          x: ['-100%', '200%']
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: 0.5
                        }}
                      />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-2xl font-bold">四卡占卜</h2>
                          {lastMode === 'fortune' && (
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">推薦</span>
                          )}
                        </div>
                        <p className="text-white/90 mb-4">完整運勢</p>
                        <p className="text-white/80 text-sm leading-relaxed">
                          依序抽取天、地、人、變數四張卡牌，獲得深度的運勢解讀與建議
                        </p>
                      </div>
                    </motion.button>
                  </GlowEffect>
                </motion.div>
              </div>

              {/* 情境占卜 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="mb-8"
              >
                <GlowEffect intensity="medium" color="rgba(139, 92, 246, 0.3)">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/situation')}
                    className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 rounded-card shadow-lg text-white text-left w-full relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: 1
                      }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold">情境占卜</h2>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">新功能</span>
                      </div>
                      <p className="text-white/90 mb-4">針對性指引</p>
                      <p className="text-white/80 text-sm leading-relaxed">
                        選擇生活領域（工作、感情、健康等），獲得針對性的運勢解讀與行動建議
                      </p>
                    </div>
                  </motion.button>
                </GlowEffect>
              </motion.div>

              {/* 探索模式入口 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="grid md:grid-cols-3 gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/explore')}
                  className="bg-paper-light border-2 border-ink-light p-6 rounded-card shadow-md hover:shadow-lg transition-all text-left group"
                >
                  <BookOpen className="text-ink-medium mb-3 group-hover:text-ink-dark transition-colors" size={24} />
                  <h3 className="text-lg font-bold text-ink-dark mb-1">卡牌圖鑑</h3>
                  <p className="text-ink-light text-sm">瀏覽所有 72 張卡牌</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/history')}
                  className="bg-paper-light border-2 border-ink-light p-6 rounded-card shadow-md hover:shadow-lg transition-all text-left group"
                >
                  <History className="text-ink-medium mb-3 group-hover:text-ink-dark transition-colors" size={24} />
                  <h3 className="text-lg font-bold text-ink-dark mb-1">運勢歷史</h3>
                  <p className="text-ink-light text-sm">查看過往抽卡記錄</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/stats')}
                  className="bg-paper-light border-2 border-ink-light p-6 rounded-card shadow-md hover:shadow-lg transition-all text-left group"
                >
                  <BarChart3 className="text-ink-medium mb-3 group-hover:text-ink-dark transition-colors" size={24} />
                  <h3 className="text-lg font-bold text-ink-dark mb-1">個人統計</h3>
                  <p className="text-ink-light text-sm">最常抽到的卡牌分析</p>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

