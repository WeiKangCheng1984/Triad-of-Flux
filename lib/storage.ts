// LocalStorage 工具函數

const STORAGE_KEYS = {
  LAST_MODE: 'last_mode',
  HISTORY: 'fortune_history',
  STATS: 'card_stats'
} as const;

// 記錄上次使用的模式
export function saveLastMode(mode: 'single' | 'fortune' | 'situation') {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LAST_MODE, mode);
  }
}

// 獲取上次使用的模式
export function getLastMode(): 'single' | 'fortune' | 'situation' | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.LAST_MODE) as 'single' | 'fortune' | 'situation' | null;
  }
  return null;
}

// 記錄抽卡歷史
export interface HistoryEntry {
  id: string;
  mode: 'single' | 'fortune' | 'situation';
  cards: string[]; // 卡牌 ID 陣列
  timestamp: number;
  result?: any; // 解讀結果
}

export function saveHistory(entry: HistoryEntry) {
  if (typeof window !== 'undefined') {
    const history = getHistory();
    history.unshift(entry);
    // 只保留最近 100 條記錄
    const limitedHistory = history.slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limitedHistory));
  }
}

export function getHistory(): HistoryEntry[] {
  if (typeof window !== 'undefined') {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
  }
  return [];
}

// 統計卡牌出現次數
export interface CardStats {
  [cardId: string]: number;
}

export function updateCardStats(cardIds: string[]) {
  if (typeof window !== 'undefined') {
    const stats = getCardStats();
    cardIds.forEach(id => {
      stats[id] = (stats[id] || 0) + 1;
    });
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }
}

export function getCardStats(): CardStats {
  if (typeof window !== 'undefined') {
    const stats = localStorage.getItem(STORAGE_KEYS.STATS);
    return stats ? JSON.parse(stats) : {};
  }
  return {};
}

// 獲取最常抽到的卡牌
export function getMostFrequentCards(limit: number = 10): Array<{ id: string; count: number }> {
  const stats = getCardStats();
  return Object.entries(stats)
    .map(([id, count]) => ({ id, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
