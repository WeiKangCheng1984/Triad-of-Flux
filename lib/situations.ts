import { Situation, SituationId } from '@/types/situation';
import { allCards } from './cards';
import { CardWeight, Intensity } from '@/types/card';

// 八種情境定義
export const situations: Situation[] = [
  {
    id: 'work',
    name: '工作事業',
    description: '職場發展、工作狀態、事業規劃、職涯轉換',
    icon: '💼',
    categoryWeights: {
      天: 0.35,
      地: 0.30,
      人: 0.25,
      變數: 0.10
    },
    keywordMatches: [
      // 原有關鍵詞（去重）
      '忙碌', '播種', '收穫', '擴張', '領導', '責任', '指引', '競爭', '機會', '抉擇', '方向',
      '啟動', '潛力', '加速', '高峰', '轉折', '焦點', '十字路口',
      // 新增關鍵詞（擴展匹配範圍）
      '工作', '事業', '職場', '職涯', '職業', '專業', '技能', '能力', '表現', '成就',
      '目標', '計劃', '執行', '完成', '進度', '發展', '成長', '提升', '突破', '挑戰',
      '合作', '團隊', '溝通', '協調', '管理', '組織', '效率', '品質', '創新', '改進',
      '成功', '勝利', '成果', '業績', '績效', '升遷', '轉換', '變動'
    ],
    colorGradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'love',
    name: '感情關係',
    description: '戀愛、婚姻、伴侶關係、情感狀態',
    icon: '💕',
    categoryWeights: {
      天: 0.25,
      地: 0.20,
      人: 0.35,
      變數: 0.20
    },
    keywordMatches: [
      // 原有關鍵詞
      '溫暖', '冷清', '相遇', '重逢', '距離', '觀察', '承諾', '離開', '背叛', '救贖',
      '衝突', '主持', '委屈', '和諧', '平衡', '緊張', '火花', '奇蹟', '遺失', '空白',
      // 新增關鍵詞
      '愛情', '戀愛', '感情', '情感', '關係', '伴侶', '婚姻', '家庭', '親密', '連結',
      '理解', '支持', '陪伴', '信任', '忠誠', '真誠', '坦誠', '溝通', '交流', '分享',
      '浪漫', '甜蜜', '幸福', '快樂', '滿足', '安心', '安全', '歸屬', '接納', '包容',
      '分離', '孤獨', '寂寞', '失落', '傷心', '痛苦', '掙扎', '困惑', '猶豫', '不確定'
    ],
    colorGradient: 'from-rose-600 to-pink-700'
  },
  {
    id: 'health',
    name: '健康狀態',
    description: '身體健康、心理健康、生活節奏、能量管理',
    icon: '🌱',
    categoryWeights: {
      天: 0.40,
      地: 0.25,
      人: 0.20,
      變數: 0.15
    },
    keywordMatches: [
      // 原有關鍵詞
      '休息', '回歸', '內心', '減弱', '喘氣', '封閉', '積蓄', '恢復', '能量',
      '壓力', '煩躁', '爆發', '崩潰', '頂點', '平衡', '完美', '狀態', '冷卻', '決定',
      // 新增關鍵詞
      '健康', '身體', '心理', '身心', '體力', '活力', '精神', '元氣', '精力', '體能',
      '養生', '調理', '修復', '療癒', '治療', '康復', '恢復', '復原', '改善', '提升',
      '運動', '活動', '鍛鍊', '訓練', '練習', '習慣', '規律', '節奏', '作息', '生活',
      '飲食', '營養', '睡眠', '放鬆', '舒緩', '平靜', '安寧', '穩定', '和諧', '協調',
      '疲勞', '疲憊', '倦怠', '虛弱', '不適', '疾病', '症狀', '警訊', '警告', '注意'
    ],
    colorGradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'growth',
    name: '個人成長',
    description: '自我提升、學習發展、心靈成長、突破限制',
    icon: '🌟',
    categoryWeights: {
      天: 0.30,
      地: 0.25,
      人: 0.30,
      變數: 0.15
    },
    keywordMatches: [
      // 原有關鍵詞（去重）
      '新生', '啟動', '潛力', '學習', '犯錯', '謙卑', '突破', '探索',
      '擴張', '加速', '高峰', '轉折', '轉向', '重生',
      // 新增關鍵詞
      '成長', '發展', '進步', '提升', '改善', '優化', '精進', '進化', '轉變', '改變',
      '自我', '個人', '內在', '心靈', '精神', '智慧', '知識', '經驗', '技能', '能力',
      '學習', '教育', '訓練', '練習', '實習', '嘗試', '實驗', '探索', '發現', '領悟',
      '覺醒', '覺察', '覺知', '覺悟', '開悟', '啟發', '啟蒙', '引導', '指引', '方向',
      '目標', '夢想', '理想', '願景', '抱負', '志向', '追求', '追尋', '實現', '達成',
      '挑戰', '困難', '挫折', '失敗', '錯誤', '教訓', '經驗', '智慧', '成熟', '穩重'
    ],
    colorGradient: 'from-orange-600 to-amber-700'
  },
  {
    id: 'finance',
    name: '財務狀況',
    description: '金錢管理、投資理財、財務規劃、經濟狀態',
    icon: '💰',
    categoryWeights: {
      天: 0.25,
      地: 0.35,
      人: 0.25,
      變數: 0.15
    },
    keywordMatches: [
      // 原有關鍵詞（去重）
      '資源', '接納', '精算', '盤點', '得失', '禮物', '交換',
      '機會', '競爭', '焦點', '十字路口', '轉折', '轉向', '變化',
      // 新增關鍵詞
      '財務', '金錢', '財富', '資產', '收入', '支出', '預算', '理財', '投資', '儲蓄',
      '經濟', '財務', '金融', '資金', '資本', '利潤', '收益', '報酬', '回報', '獲利',
      '管理', '規劃', '計劃', '策略', '方案', '方法', '技巧', '技能', '知識', '經驗',
      '風險', '安全', '穩定', '保障', '保護', '防護', '謹慎', '小心', '審慎', '評估',
      '機會', '時機', '時機', '運氣', '機遇', '契機', '轉機', '突破', '發展', '成長',
      '損失', '虧損', '債務', '負債', '困難', '危機', '挑戰', '考驗', '壓力', '負擔'
    ],
    colorGradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'social',
    name: '人際關係',
    description: '朋友關係、社交互動、人際網絡、社交能力',
    icon: '👥',
    categoryWeights: {
      天: 0.20,
      地: 0.25,
      人: 0.40,
      變數: 0.15
    },
    keywordMatches: [
      // 原有關鍵詞
      '衝突', '主持', '委屈', '對抗', '威脅', '證明', '解決', '和諧', '平衡',
      '距離', '觀察', '格格不入', '相遇', '重逢', '領航員', '調停者', '局外人', '隱士',
      // 新增關鍵詞
      '人際', '關係', '社交', '互動', '交流', '溝通', '對話', '談話', '聊天', '分享',
      '朋友', '友誼', '夥伴', '同伴', '同事', '同學', '同伴', '盟友', '夥伴', '搭檔',
      '合作', '協作', '配合', '協助', '幫助', '支持', '支援', '支援', '鼓勵', '激勵',
      '理解', '體諒', '包容', '接納', '接受', '認同', '認可', '肯定', '讚美', '欣賞',
      '信任', '信賴', '依賴', '依靠', '依託', '連結', '連接', '聯繫', '關係', '紐帶',
      '孤立', '疏離', '隔閡', '隔膜', '距離', '陌生', '冷漠', '冷淡', '無情', '無感',
      '誤解', '誤會', '矛盾', '分歧', '爭執', '爭吵', '對立', '敵對', '敵意', '仇恨'
    ],
    colorGradient: 'from-teal-600 to-cyan-700'
  },
  {
    id: 'creative',
    name: '創意靈感',
    description: '創作靈感、創意思維、藝術表達、創新突破',
    icon: '🎨',
    categoryWeights: {
      天: 0.35,
      地: 0.25,
      人: 0.25,
      變數: 0.15
    },
    keywordMatches: [
      // 原有關鍵詞（去重）
      '靈感', '點燃', '火花', '突破', '探索', '創新',
      '啟動', '潛力', '擴張', '加速', '高峰', '轉折', '轉向', '重生', '奇蹟',
      // 新增關鍵詞
      '創意', '創作', '創造', '發明', '設計', '構思', '構想', '想法', '點子', '概念',
      '藝術', '美感', '美學', '審美', '品味', '風格', '特色', '個性', '獨特', '原創',
      '表達', '表現', '展現', '呈現', '展示', '顯現', '流露', '流露', '傳達', '傳遞',
      '想像', '幻想', '夢想', '理想', '願景', '憧憬', '期待', '希望', '渴望', '追求',
      '自由', '解放', '釋放', '放開', '放鬆', '輕鬆', '自在', '自然', '隨性', '隨意',
      '熱情', '激情', '熱忱', '熱愛', '喜愛', '喜歡', '愛好', '興趣', '嗜好', '樂趣',
      '啟發', '啟示', '啟迪', '引導', '指引', '指導', '引領', '帶領', '引領', '引導'
    ],
    colorGradient: 'from-purple-500 to-violet-600'
  },
  {
    id: 'decision',
    name: '重大決策',
    description: '人生選擇、重要決定、方向抉擇、人生轉折',
    icon: '⚖️',
    categoryWeights: {
      天: 0.25,
      地: 0.30,
      人: 0.25,
      變數: 0.20
    },
    keywordMatches: [
      // 原有關鍵詞
      '抉擇', '停滯', '方向', '決定', '轉折', '轉向',
      '未知', '恐懼', '陷阱', '風險', '機會', '轉機', '奇蹟', '重生',
      // 新增關鍵詞
      '決策', '選擇', '選項', '選項', '方案', '計劃', '策略', '策略', '方法', '途徑',
      '判斷', '評估', '分析', '思考', '考慮', '權衡', '衡量', '比較', '對比', '對照',
      '重要', '關鍵', '緊急', '迫切', '必要', '必須', '需要', '要求', '需求', '必要',
      '後果', '結果', '影響', '效果', '效應', '作用', '意義', '價值', '重要性', '關鍵性',
      '猶豫', '遲疑', '躊躇', '猶豫', '不決', '不確定', '困惑', '迷茫', '迷失', '迷失',
      '堅定', '果斷', '決斷', '果決', '堅決', '堅定', '堅強', '堅韌', '堅毅', '堅定',
      '改變', '變動', '轉變', '轉換', '轉移', '轉移', '轉移', '轉移', '轉移', '轉移',
      '未來', '前景', '前途', '前景', '展望', '預期', '期待', '期望', '希望', '願望'
    ],
    colorGradient: 'from-gray-700 to-slate-800'
  }
];

// 根據 ID 獲取情境
export function getSituationById(id: SituationId): Situation | undefined {
  return situations.find(s => s.id === id);
}

// 方案一：屬性匹配 + 類別權重分配
// 定義每個情境偏好的卡牌屬性範圍
const situationPreferences: Record<SituationId, {
  energyRange: [number, number];      // 能量範圍 [min, max]
  impactRange: [number, number];     // 影響力範圍
  directionPreference: number[];      // 方向偏好 [-1, 0, 1]
  temporalPreference: number[];      // 時間偏好 [1, 2, 3]
  intensityPreference: Intensity[];   // 強度偏好
}> = {
  work: {
    energyRange: [5, 10],           // 工作需要較高能量
    impactRange: [6, 10],           // 工作重視影響力
    directionPreference: [1, 0],    // 偏好正面或中性
    temporalPreference: [1, 2],     // 偏好短期或中期
    intensityPreference: ['medium', 'high', 'extreme']
  },
  love: {
    energyRange: [3, 8],            // 感情能量範圍較廣
    impactRange: [4, 9],            // 影響力中等偏高
    directionPreference: [1, 0, -1], // 接受各種方向
    temporalPreference: [2, 3],      // 偏好中期或長期
    intensityPreference: ['low', 'medium', 'high']
  },
  health: {
    energyRange: [3, 7],            // 健康能量不宜過高
    impactRange: [4, 8],            // 影響力中等
    directionPreference: [1, 0],     // 偏好正面或中性
    temporalPreference: [2, 3],      // 偏好長期
    intensityPreference: ['low', 'medium']
  },
  growth: {
    energyRange: [4, 9],            // 成長需要能量
    impactRange: [5, 9],            // 影響力中高
    directionPreference: [1, 0],     // 偏好正面
    temporalPreference: [2, 3],      // 偏好長期
    intensityPreference: ['medium', 'high']
  },
  finance: {
    energyRange: [4, 8],            // 財務能量中等
    impactRange: [5, 9],            // 影響力中高
    directionPreference: [1, 0],     // 偏好正面或中性
    temporalPreference: [1, 2],       // 偏好短期或中期
    intensityPreference: ['medium', 'high']
  },
  social: {
    energyRange: [3, 8],            // 人際能量範圍廣
    impactRange: [4, 9],            // 影響力中等偏高
    directionPreference: [1, 0, -1], // 接受各種方向
    temporalPreference: [1, 2, 3],    // 接受各種時間
    intensityPreference: ['low', 'medium', 'high']
  },
  creative: {
    energyRange: [5, 10],           // 創意需要高能量
    impactRange: [5, 10],           // 影響力中高
    directionPreference: [1, 0],     // 偏好正面
    temporalPreference: [1, 2],      // 偏好短期或中期
    intensityPreference: ['medium', 'high', 'extreme']
  },
  decision: {
    energyRange: [4, 9],            // 決策需要能量
    impactRange: [6, 10],           // 決策重視影響力
    directionPreference: [1, 0, -1], // 接受各種方向
    temporalPreference: [1, 2],      // 偏好短期或中期
    intensityPreference: ['high', 'extreme']
  }
};

// 計算卡牌與情境的適合度（方案一）
export function calculateCardFitness(card: CardWeight, situation: Situation): number {
  const preference = situationPreferences[situation.id];
  let fitness = 0;
  
  // 1. 類別權重（基礎分數）
  const categoryWeight = situation.categoryWeights[card.category];
  fitness += categoryWeight * 30; // 類別權重佔 30 分
  
  // 2. 能量匹配（0-15 分）
  if (card.energy >= preference.energyRange[0] && card.energy <= preference.energyRange[1]) {
    // 在範圍內，根據接近程度給分
    const range = preference.energyRange[1] - preference.energyRange[0];
    const center = (preference.energyRange[0] + preference.energyRange[1]) / 2;
    const distance = Math.abs(card.energy - center);
    fitness += 15 * (1 - distance / range); // 越接近中心分數越高
  } else {
    // 在範圍外，給較低分數
    fitness += 5;
  }
  
  // 3. 影響力匹配（0-15 分）
  if (card.impact >= preference.impactRange[0] && card.impact <= preference.impactRange[1]) {
    const range = preference.impactRange[1] - preference.impactRange[0];
    const center = (preference.impactRange[0] + preference.impactRange[1]) / 2;
    const distance = Math.abs(card.impact - center);
    fitness += 15 * (1 - distance / range);
  } else {
    fitness += 5;
  }
  
  // 4. 方向匹配（0-10 分）
  if (preference.directionPreference.includes(card.direction)) {
    fitness += 10;
  } else {
    fitness += 3; // 不在偏好內，給較低分
  }
  
  // 5. 時間匹配（0-10 分）
  if (preference.temporalPreference.includes(card.temporal)) {
    fitness += 10;
  } else {
    fitness += 3;
  }
  
  // 6. 強度匹配（0-10 分）
  if (preference.intensityPreference.includes(card.intensity)) {
    fitness += 10;
  } else {
    fitness += 3;
  }
  
  // 7. 基礎分數（確保所有卡牌都有分數）
  fitness += 10;
  
  return fitness;
}

// 情境化抽卡（方案一：屬性匹配 + 類別權重分配）
export function drawSituationCards(situation: Situation, count: number = 3): CardWeight[] {
  // 計算所有卡牌的適合度
  const cardsWithFitness = allCards.map(card => ({
    card,
    fitness: calculateCardFitness(card, situation),
    categoryWeight: situation.categoryWeights[card.category]
  }));
  
  // 排序：適合度高的優先
  cardsWithFitness.sort((a, b) => {
    const scoreA = a.fitness + a.categoryWeight * 10; // 類別權重微調
    const scoreB = b.fitness + b.categoryWeight * 10;
    return scoreB - scoreA;
  });
  
  // 確保至少 36 張卡牌可用（取前 36 張作為候選池）
  const candidatePool = cardsWithFitness.slice(0, Math.max(36, cardsWithFitness.length));
  
  // 按類別分組，確保類別分布
  const cardsByCategory: Record<CardWeight['category'], typeof cardsWithFitness> = {
    天: [],
    地: [],
    人: [],
    變數: []
  };
  
  candidatePool.forEach(item => {
    cardsByCategory[item.card.category].push(item);
  });
  
  // 確保每個類別至少有足夠的卡牌
  (['天', '地', '人', '變數'] as const).forEach(category => {
    if (cardsByCategory[category].length < 3) {
      // 如果某類別卡牌不足，從全部卡牌中補充
      const allCategoryCards = cardsWithFitness.filter(item => item.card.category === category);
      cardsByCategory[category] = allCategoryCards.slice(0, Math.max(3, allCategoryCards.length));
    }
  });
  
  const selectedCards: CardWeight[] = [];
  const categoryCounts: { [key in CardWeight['category']]: number } = { 天: 0, 地: 0, 人: 0, 變數: 0 };
  
  // 根據類別權重分配卡牌
  const expectedCounts = {
    天: Math.round(count * situation.categoryWeights.天),
    地: Math.round(count * situation.categoryWeights.地),
    人: Math.round(count * situation.categoryWeights.人),
    變數: Math.round(count * situation.categoryWeights.變數)
  };
  
  // 確保總數為 count
  const total = Object.values(expectedCounts).reduce((sum, val) => sum + val, 0);
  if (total !== count) {
    const diff = count - total;
    // 調整最大的類別
    const maxCategory = Object.entries(expectedCounts)
      .sort((a, b) => b[1] - a[1])[0][0] as CardWeight['category'];
    expectedCounts[maxCategory] += diff;
  }
  
  // 依序選擇各類別的卡牌
  (['天', '地', '人', '變數'] as const).forEach(category => {
    const targetCount = expectedCounts[category];
    const pool = cardsByCategory[category];
    
    // 從該類別中隨機選擇（加權隨機）
    for (let i = 0; i < targetCount && pool.length > 0; i++) {
      const totalFitness = pool.reduce((sum, item) => sum + item.fitness, 0);
      let random = Math.random() * totalFitness;
      
      let selectedIndex = 0;
      for (let j = 0; j < pool.length; j++) {
        random -= pool[j].fitness;
        if (random <= 0) {
          selectedIndex = j;
          break;
        }
      }
      
      selectedCards.push(pool[selectedIndex].card);
      pool.splice(selectedIndex, 1); // 移除已選卡牌
    }
  });
  
  // 如果選不夠，從候選池中補足
  while (selectedCards.length < count) {
    const remaining = candidatePool.filter(item => !selectedCards.includes(item.card));
    if (remaining.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * remaining.length);
    selectedCards.push(remaining[randomIndex].card);
  }
  
  return selectedCards;
}
