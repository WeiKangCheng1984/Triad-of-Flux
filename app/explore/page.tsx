'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { allCards } from '@/lib/cards';
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

export default function ExplorePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CardWeight['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<CardWeight | null>(null);

  const filteredCards = allCards.filter(card => {
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      card.name.includes(searchQuery) ||
      card.infoA.includes(searchQuery) ||
      card.infoB.includes(searchQuery) ||
      card.keywords.some(k => k.includes(searchQuery));
    return matchesCategory && matchesSearch;
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

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-ink-dark mb-4">卡牌圖鑑</h1>
          <p className="text-ink-medium">
            瀏覽所有 72 張卡牌，探索每張卡牌的深層意義
          </p>
        </motion.div>

        {/* 搜尋和篩選 */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-light" size={20} />
            <input
              type="text"
              placeholder="搜尋卡牌名稱、內容或關鍵詞..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-paper-light border-2 border-ink-light rounded-card text-ink-dark focus:outline-none focus:border-ink-medium"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-card font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-ink-dark text-white'
                  : 'bg-paper-light text-ink-medium hover:bg-ink-light hover:text-white'
              }`}
            >
              全部
            </button>
            {(['天', '地', '人', '變數'] as const).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-card font-medium transition-all ${
                  selectedCategory === category
                    ? `bg-gradient-to-r ${categoryColors[category]} text-white`
                    : 'bg-paper-light text-ink-medium hover:bg-ink-light hover:text-white'
                }`}
              >
                {categoryNames[category]}
              </button>
            ))}
          </div>
        </div>

        {/* 卡牌列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-paper-light border-2 border-ink-light rounded-card p-6 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedCard(card)}
            >
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 bg-gradient-to-r ${categoryColors[card.category]} text-white`}>
                {categoryNames[card.category]}
              </div>
              <h3 className="text-xl font-bold text-ink-dark mb-2">{card.name}</h3>
              <p className="text-ink-medium text-sm mb-3 line-clamp-2">{card.infoA}</p>
              <div className="flex flex-wrap gap-2">
                {card.keywords.map((keyword, i) => (
                  <span key={i} className="text-xs bg-ink-light/20 text-ink-medium px-2 py-1 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-ink-light">找不到符合條件的卡牌</p>
          </div>
        )}
      </div>

      {/* 卡牌詳情彈窗 */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCard(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-paper rounded-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 bg-gradient-to-r ${categoryColors[selectedCard.category]} text-white`}>
                  {categoryNames[selectedCard.category]}
                </div>
                <h2 className="text-3xl font-bold text-ink-dark">{selectedCard.name}</h2>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="text-ink-light hover:text-ink-dark"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-ink-dark mb-2">天意</h3>
                <p className="text-ink-medium">{selectedCard.infoA}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink-dark mb-2">自問</h3>
                <p className="text-ink-medium italic">{selectedCard.infoB}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink-dark mb-2">關鍵詞</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCard.keywords.map((keyword, i) => (
                    <span key={i} className="text-sm bg-ink-light/20 text-ink-medium px-3 py-1 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
