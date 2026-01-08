// 分析八個情境的抽卡數據
const fs = require('fs');
const path = require('path');

// 讀取卡牌數據
const cardsPath = path.join(__dirname, '../lib/cards.ts');
const situationsPath = path.join(__dirname, '../lib/situations.ts');

// 簡化的卡牌數據（從實際文件中提取）
const allCards = [
  // 天（24張）
  { id: 'sky01', category: '天', keywords: ['新生', '啟動', '潛力'] },
  { id: 'sky02', category: '天', keywords: ['資源', '接納', '精算'] },
  { id: 'sky03', category: '天', keywords: ['打破', '熱鬧', '行動'] },
  { id: 'sky04', category: '天', keywords: ['平衡', '完美', '狀態'] },
  { id: 'sky05', category: '天', keywords: ['清朗', '現形', '真相'] },
  { id: 'sky06', category: '天', keywords: ['灌溉', '基礎', '紮實'] },
  { id: 'sky07', category: '天', keywords: ['擴張', '快長', '加速'] },
  { id: 'sky08', category: '天', keywords: ['飽滿', '希望', '等待'] },
  { id: 'sky09', category: '天', keywords: ['忙碌', '播種', '收穫'] },
  { id: 'sky10', category: '天', keywords: ['高峰', '轉折', '退場'] },
  { id: 'sky11', category: '天', keywords: ['悶熱', '壓力', '煩躁'] },
  { id: 'sky12', category: '天', keywords: ['頂點', '爆發', '崩潰'] },
  { id: 'sky13', category: '天', keywords: ['轉向', '退去', '收尾'] },
  { id: 'sky14', category: '天', keywords: ['殘留', '已定', '波折'] },
  { id: 'sky15', category: '天', keywords: ['轉涼', '冷卻', '決定'] },
  { id: 'sky16', category: '天', keywords: ['得失', '盤點', '資源'] },
  { id: 'sky17', category: '天', keywords: ['下降', '冷清', '溫暖'] },
  { id: 'sky18', category: '天', keywords: ['終結', '斷離', '放手'] },
  { id: 'sky19', category: '天', keywords: ['休息', '回歸', '內心'] },
  { id: 'sky20', category: '天', keywords: ['減弱', '休息', '喘氣'] },
  { id: 'sky21', category: '天', keywords: ['封閉', '積蓄', '準備'] },
  { id: 'sky22', category: '天', keywords: ['黑暗', '轉捩', '希望'] },
  { id: 'sky23', category: '天', keywords: ['考驗', '艱難', '毅力'] },
  { id: 'sky24', category: '天', keywords: ['極限', '考驗', '洗禮'] },
  // 地（12張）
  { id: 'earth01', category: '地', keywords: ['孤立', '視野', '資源'] },
  { id: 'earth02', category: '地', keywords: ['未知', '恐懼', '寶藏'] },
  { id: 'earth03', category: '地', keywords: ['機會', '競爭', '焦點'] },
  { id: 'earth04', category: '地', keywords: ['牆壁', '打轉', '出口'] },
  { id: 'earth05', category: '地', keywords: ['防禦', '安全', '限制'] },
  { id: 'earth06', category: '地', keywords: ['隔絕', '自給', '本事'] },
  { id: 'earth07', category: '地', keywords: ['抉擇', '停滯', '方向'] },
  { id: 'earth08', category: '地', keywords: ['舒適', '保護', '成長'] },
  { id: 'earth09', category: '地', keywords: ['一人', '無退路', '平衡'] },
  { id: 'earth10', category: '地', keywords: ['垮了', '荒涼', '重生'] },
  { id: 'earth11', category: '地', keywords: ['矚目', '表現', '演技'] },
  { id: 'earth12', category: '地', keywords: ['私密', '放鬆', '休養'] },
  // 人（18張）
  { id: 'human01', category: '人', keywords: ['巨人', '承接', '決定'] },
  { id: 'human02', category: '人', keywords: ['距離', '觀察', '格格不入'] },
  { id: 'human03', category: '人', keywords: ['衝突', '主持', '委屈'] },
  { id: 'human04', category: '人', keywords: ['領導', '責任', '指引'] },
  { id: 'human05', category: '人', keywords: ['獨處', '思考', '隔離'] },
  { id: 'human06', category: '人', keywords: ['對抗', '威脅', '證明'] },
  { id: 'human07', category: '人', keywords: ['隱藏', '支撐', '看見'] },
  { id: 'human08', category: '人', keywords: ['挑戰', '懷疑', '戰鬥'] },
  { id: 'human09', category: '人', keywords: ['模仿', '神格', '自卑'] },
  { id: 'human10', category: '人', keywords: ['傳授', '照顧', '價值'] },
  { id: 'human11', category: '人', keywords: ['不穩定', '離開', '承諾'] },
  { id: 'human12', category: '人', keywords: ['解決', '苦海', '救贖'] },
  { id: 'human13', category: '人', keywords: ['保護', '冷血', '看著'] },
  { id: 'human14', category: '人', keywords: ['轉向', '離開', '利益'] },
  { id: 'human15', category: '人', keywords: ['學習', '犯錯', '謙卑'] },
  { id: 'human16', category: '人', keywords: ['享樂', '當下', '責任'] },
  { id: 'human17', category: '人', keywords: ['權力', '決定', '重要'] },
  { id: 'human18', category: '人', keywords: ['孤寂', '無法交會', '走遠'] },
  // 變數（18張）
  { id: 'var01', category: '變數', keywords: ['打擊', '摧毀', '核心'] },
  { id: 'var02', category: '變數', keywords: ['動搖', '裂痕', '重新'] },
  { id: 'var03', category: '變數', keywords: ['誘惑', '機會', '分心'] },
  { id: 'var04', category: '變數', keywords: ['失效', '陌生', '直覺'] },
  { id: 'var05', category: '變數', keywords: ['關上', '無法前進', '轉身'] },
  { id: 'var06', category: '變數', keywords: ['快', '無法掌控', '煞車'] },
  { id: 'var07', category: '變數', keywords: ['消失', '寂靜', '存在'] },
  { id: 'var08', category: '變數', keywords: ['支援', '代價', '交換'] },
  { id: 'var09', category: '變數', keywords: ['揭開', '真相', '解脫'] },
  { id: 'var10', category: '變數', keywords: ['弄丟', '重要', '失去'] },
  { id: 'var11', category: '變數', keywords: ['遇到', '改變', '冒險'] },
  { id: 'var12', category: '變數', keywords: ['陰影', '舊人', '了結'] },
  { id: 'var13', category: '變數', keywords: ['瓦解', '失誤', '重新開始'] },
  { id: 'var14', category: '變數', keywords: ['嘈雜', '謠言', '心跳'] },
  { id: 'var15', category: '變數', keywords: ['耗盡', '空', '枯萎'] },
  { id: 'var16', category: '變數', keywords: ['靈感', '點燃', '火花'] },
  { id: 'var17', category: '變數', keywords: ['圈套', '抱怨', '爬出來'] },
  { id: 'var18', category: '變數', keywords: ['轉機', '不合理', '警告'] }
];

// 八個情境定義
const situations = [
  {
    id: 'work',
    name: '工作事業',
    categoryWeights: { 天: 0.35, 地: 0.30, 人: 0.25, 變數: 0.10 },
    keywordMatches: ['忙碌', '播種', '收穫', '擴張', '領導', '責任', '指引', '競爭', '機會', '抉擇', '方向', '啟動', '潛力', '加速', '高峰', '轉折', '機會', '競爭', '焦點', '十字路口']
  },
  {
    id: 'love',
    name: '感情關係',
    categoryWeights: { 天: 0.25, 地: 0.20, 人: 0.35, 變數: 0.20 },
    keywordMatches: ['溫暖', '冷清', '相遇', '重逢', '距離', '觀察', '承諾', '離開', '背叛', '救贖', '衝突', '主持', '委屈', '和諧', '平衡', '緊張', '火花', '奇蹟', '遺失', '空白']
  },
  {
    id: 'health',
    name: '健康狀態',
    categoryWeights: { 天: 0.40, 地: 0.25, 人: 0.20, 變數: 0.15 },
    keywordMatches: ['休息', '回歸', '內心', '減弱', '喘氣', '封閉', '積蓄', '恢復', '能量', '壓力', '煩躁', '爆發', '崩潰', '頂點', '平衡', '完美', '狀態', '冷卻', '決定']
  },
  {
    id: 'growth',
    name: '個人成長',
    categoryWeights: { 天: 0.30, 地: 0.25, 人: 0.30, 變數: 0.15 },
    keywordMatches: ['新生', '啟動', '潛力', '學習', '犯錯', '謙卑', '突破', '探索', '啟動', '潛力', '擴張', '加速', '高峰', '轉折', '轉向', '突破', '重生']
  },
  {
    id: 'finance',
    name: '財務狀況',
    categoryWeights: { 天: 0.25, 地: 0.35, 人: 0.25, 變數: 0.15 },
    keywordMatches: ['資源', '接納', '精算', '盤點', '得失', '資源', '禮物', '交換', '機會', '競爭', '焦點', '十字路口', '轉折', '轉向', '變化', '機會']
  },
  {
    id: 'social',
    name: '人際關係',
    categoryWeights: { 天: 0.20, 地: 0.25, 人: 0.40, 變數: 0.15 },
    keywordMatches: ['衝突', '主持', '委屈', '對抗', '威脅', '證明', '解決', '和諧', '平衡', '距離', '觀察', '格格不入', '相遇', '重逢', '領航員', '調停者', '局外人', '隱士']
  },
  {
    id: 'creative',
    name: '創意靈感',
    categoryWeights: { 天: 0.35, 地: 0.25, 人: 0.25, 變數: 0.15 },
    keywordMatches: ['靈感', '點燃', '火花', '突破', '探索', '創新', '啟動', '潛力', '擴張', '加速', '高峰', '轉折', '轉向', '突破', '重生', '奇蹟']
  },
  {
    id: 'decision',
    name: '重大決策',
    categoryWeights: { 天: 0.25, 地: 0.30, 人: 0.25, 變數: 0.20 },
    keywordMatches: ['抉擇', '停滯', '方向', '決定', '轉折', '轉向', '未知', '恐懼', '陷阱', '風險', '機會', '轉機', '奇蹟', '重生']
  }
];

// 計算每個情境匹配的卡牌
function analyzeSituation(situation) {
  const matchedCards = allCards.filter(card => {
    return card.keywords.some(k => 
      situation.keywordMatches.some(sk => k.includes(sk) || sk.includes(k))
    );
  });
  
  const categoryDistribution = { 天: 0, 地: 0, 人: 0, 變數: 0 };
  matchedCards.forEach(card => {
    categoryDistribution[card.category]++;
  });
  
  return {
    name: situation.name,
    totalMatched: matchedCards.length,
    categoryDistribution,
    keywordCount: situation.keywordMatches.length,
    categoryWeights: situation.categoryWeights
  };
}

// 分析所有情境
console.log('=== 八個情境的抽卡數據分析 ===\n');
situations.forEach(situation => {
  const analysis = analyzeSituation(situation);
  console.log(`${analysis.name}:`);
  console.log(`  關鍵詞數量: ${analysis.keywordCount}`);
  console.log(`  匹配卡牌數: ${analysis.totalMatched} / 72`);
  console.log(`  類別分布: 天${analysis.categoryDistribution.天} 地${analysis.categoryDistribution.地} 人${analysis.categoryDistribution.人} 變數${analysis.categoryDistribution.變數}`);
  console.log(`  類別權重: 天${(analysis.categoryWeights.天 * 100).toFixed(0)}% 地${(analysis.categoryWeights.地 * 100).toFixed(0)}% 人${(analysis.categoryWeights.人 * 100).toFixed(0)}% 變數${(analysis.categoryWeights.變數 * 100).toFixed(0)}%`);
  console.log('');
});
