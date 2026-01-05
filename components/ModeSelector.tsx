'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ParticleEffect from './ParticleEffect';
import ShimmerEffect from './ShimmerEffect';
import GlowEffect from './GlowEffect';

export default function ModeSelector() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* 背景粒子效果 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticleEffect count={25} color="rgba(45, 55, 72, 0.1)" />
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <ShimmerEffect>
            <motion.h1 
              className="text-5xl font-bold text-ink-dark mb-4"
              animate={{ 
                textShadow: [
                  '0 0 0px rgba(26, 26, 26, 0)',
                  '0 0 20px rgba(26, 26, 26, 0.3)',
                  '0 0 0px rgba(26, 26, 26, 0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              天地人變數卡牌
            </motion.h1>
          </ShimmerEffect>
          <motion.p 
            className="text-ink-medium text-base md:text-lg max-w-2xl mx-auto mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            透過「天意」與「自問」，探索內心狀態與運勢指引
          </motion.p>
          <motion.p 
            className="text-ink-light text-sm max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            適合心理認知、朋友互動、運勢占卜
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 單卡抽籤 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <GlowEffect intensity="medium" color="rgba(74, 85, 104, 0.3)">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/single')}
                className="bg-gradient-to-br from-sky-start to-sky-end p-8 rounded-card shadow-lg text-white text-left w-full relative overflow-hidden"
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
                  <h2 className="text-2xl font-bold mb-2">單卡抽籤</h2>
                  <p className="text-white/90 mb-4">快速指引</p>
                  <p className="text-white/80 text-sm">
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
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <GlowEffect intensity="medium" color="rgba(85, 60, 154, 0.3)">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/fortune')}
                className="bg-gradient-to-br from-variable-start to-variable-end p-8 rounded-card shadow-lg text-white text-left w-full relative overflow-hidden"
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
                  <h2 className="text-2xl font-bold mb-2">四卡占卜</h2>
                  <p className="text-white/90 mb-4">完整運勢</p>
                  <p className="text-white/80 text-sm">
                    依序抽取天、地、人、變數四張卡牌，獲得深度的運勢解讀與建議
                  </p>
                </div>
              </motion.button>
            </GlowEffect>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

