'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Trash2 } from 'lucide-react';
import { getHistory, HistoryEntry } from '@/lib/storage';
import { allCards, getCardById } from '@/lib/cards';
import { CardWeight } from '@/types/card';

const categoryColors = {
  天: 'from-sky-start to-sky-end',
  地: 'from-earth-start to-earth-end',
  人: 'from-human-start to-human-end',
  變數: 'from-variable-start to-variable-end'
};

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearHistory = () => {
    if (confirm('確定要清除所有歷史記錄嗎？')) {
      localStorage.removeItem('fortune_history');
      setHistory([]);
    }
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-ink-dark mb-4">運勢歷史</h1>
            <p className="text-ink-medium">
              查看過往抽卡記錄，追蹤運勢變化
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 rounded-card hover:bg-red-500/20 transition-colors"
            >
              <Trash2 size={18} />
              <span>清除記錄</span>
            </button>
          )}
        </motion.div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-ink-light mb-4" size={48} />
            <p className="text-ink-light">尚無歷史記錄</p>
            <p className="text-ink-light text-sm mt-2">開始抽卡後，記錄會顯示在這裡</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry, index) => {
              const cards = entry.cards.map(id => getCardById(id)).filter(Boolean) as CardWeight[];
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-paper-light border-2 border-ink-light rounded-card p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${
                          entry.mode === 'single' 
                            ? 'from-sky-start to-sky-end' 
                            : 'from-variable-start to-variable-end'
                        } text-white`}>
                          {entry.mode === 'single' ? '單卡抽籤' : '四卡占卜'}
                        </span>
                        <span className="text-ink-light text-sm">{formatDate(entry.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {cards.map((card, i) => (
                      <div key={i} className="text-center">
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 bg-gradient-to-r ${categoryColors[card.category]} text-white`}>
                          {card.category}
                        </div>
                        <p className="text-sm font-medium text-ink-dark">{card.name}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 詳情彈窗 */}
      {selectedEntry && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEntry(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-paper rounded-card p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-ink-dark mb-2">
                  {selectedEntry.mode === 'single' ? '單卡抽籤' : '四卡占卜'}
                </h2>
                <p className="text-ink-light">{formatDate(selectedEntry.timestamp)}</p>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-ink-light hover:text-ink-dark"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-ink-dark mb-4">卡牌</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedEntry.cards.map((cardId, i) => {
                    const card = getCardById(cardId);
                    if (!card) return null;
                    return (
                      <div key={i} className="bg-paper-light p-4 rounded-card">
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 bg-gradient-to-r ${categoryColors[card.category]} text-white`}>
                          {card.category}
                        </div>
                        <h4 className="font-bold text-ink-dark mb-2">{card.name}</h4>
                        <p className="text-sm text-ink-medium mb-2">{card.infoA}</p>
                        <p className="text-xs text-ink-light italic">{card.infoB}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedEntry.result && (
                <div>
                  <h3 className="text-lg font-semibold text-ink-dark mb-4">解讀結果</h3>
                  {selectedEntry.mode === 'single' ? (
                    <div className="bg-paper-light p-6 rounded-card space-y-4">
                      <div>
                        <h4 className="font-semibold text-ink-dark mb-2">關鍵詞</h4>
                        <p className="text-ink-medium">{selectedEntry.result.meaning}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-ink-dark mb-2">建議</h4>
                        <p className="text-ink-medium">{selectedEntry.result.advice}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-paper-light p-6 rounded-card space-y-4">
                      {selectedEntry.result.text && (
                        <>
                          <div>
                            <h4 className="font-semibold text-ink-dark mb-2">整體運勢</h4>
                            <p className="text-ink-medium">{selectedEntry.result.text.opening}</p>
                            <p className="text-ink-medium mt-2">{selectedEntry.result.text.analysis}</p>
                          </div>
                          {selectedEntry.result.text.advice && (
                            <div>
                              <h4 className="font-semibold text-ink-dark mb-2">建議</h4>
                              <ul className="list-disc list-inside space-y-2 text-ink-medium">
                                {selectedEntry.result.text.advice.map((advice: string, i: number) => (
                                  <li key={i}>{advice}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
