// 簡化版分析腳本 - 直接讀取和計算
const fs = require('fs');
const path = require('path');

// 讀取卡牌數據
const cardsPath = path.join(__dirname, '../lib/cards.ts');
const fortunePath = path.join(__dirname, '../lib/fortune.ts');

// 由於無法直接執行 TypeScript，我們創建一個手動計算版本
// 這裡我們使用簡化的計算邏輯來分析分布

console.log('開始分析運勢分布...\n');

// 手動定義計算函數（簡化版，基於 fortune.ts 的邏輯）
function calculateFortune(skyCard, earthCard, humanCard, variableCard) {
  const categoryWeights = {
    天: 0.30,
    地: 0.25,
    人: 0.25,
    變數: 0.20
  };
  
  const skyBase = (skyCard.energy * 0.4 + skyCard.impact * 0.6) 
                  * categoryWeights.天 * skyCard.direction;
  const earthBase = (earthCard.energy * 0.4 + earthCard.impact * 0.6) 
                    * categoryWeights.地 * earthCard.direction;
  const humanBase = (humanCard.energy * 0.4 + humanCard.impact * 0.6) 
                    * categoryWeights.人 * humanCard.direction;
  const variableBase = (variableCard.energy * 0.5 + variableCard.impact * 0.5) 
                       * categoryWeights.變數 * variableCard.direction;
  
  const baseScore = skyBase + earthBase + humanBase + variableBase;
  
  let interactionScore = 0;
  
  const extremeCards = [skyCard, earthCard, humanCard, variableCard]
    .filter(c => c.intensity === 'extreme').length;
  if (extremeCards >= 2) {
    interactionScore += extremeCards * 2;
  }
  
  const positiveCount = [skyCard, earthCard, humanCard, variableCard]
    .filter(c => c.direction > 0).length;
  const negativeCount = [skyCard, earthCard, humanCard, variableCard]
    .filter(c => c.direction < 0).length;
  
  if (positiveCount >= 3) {
    interactionScore += 3;
  } else if (negativeCount >= 3) {
    interactionScore -= 3;
  }
  
  if (variableCard.intensity === 'extreme') {
    interactionScore += variableCard.direction * 5;
  }
  
  const temporalAvg = (skyCard.temporal + earthCard.temporal + 
                       humanCard.temporal + variableCard.temporal) / 4;
  if (temporalAvg <= 1.5) {
    interactionScore += 2;
  } else if (temporalAvg >= 2.5) {
    interactionScore -= 1;
  }
  
  const totalScore = baseScore + interactionScore;
  
  let fortuneLevel;
  if (totalScore <= -15) fortuneLevel = '極差';
  else if (totalScore <= -5) fortuneLevel = '不佳';
  else if (totalScore <= 5) fortuneLevel = '普通';
  else if (totalScore <= 15) fortuneLevel = '良好';
  else fortuneLevel = '極佳';
  
  const directionSum = skyCard.direction + earthCard.direction + 
                       humanCard.direction + variableCard.direction;
  let fortuneDirection;
  if (directionSum <= -2) fortuneDirection = '下降';
  else if (directionSum >= 2) fortuneDirection = '上升';
  else fortuneDirection = '持平';
  
  let timePrediction;
  if (temporalAvg <= 1.5) timePrediction = '短期';
  else if (temporalAvg >= 2.5) timePrediction = '長期';
  else timePrediction = '中期';
  
  return {
    totalScore,
    fortuneLevel,
    fortuneDirection,
    timePrediction
  };
}

// 讀取並解析卡牌數據（簡化版 - 手動定義關鍵卡牌）
// 由於完整解析 TypeScript 較複雜，我們使用抽樣分析
console.log('使用抽樣分析方法（10,000 個隨機組合）...\n');

const skyCards = [
  { name: '立春', energy: 3, impact: 4, direction: 1, temporal: 3, intensity: 'low' },
  { name: '雨水', energy: 4, impact: 5, direction: 1, temporal: 2, intensity: 'low' },
  { name: '驚蟄', energy: 6, impact: 7, direction: 1, temporal: 1, intensity: 'medium' },
  { name: '春分', energy: 5, impact: 6, direction: 0, temporal: 2, intensity: 'medium' },
  { name: '清明', energy: 6, impact: 7, direction: 0, temporal: 2, intensity: 'medium' },
  { name: '穀雨', energy: 5, impact: 6, direction: 1, temporal: 2, intensity: 'medium' },
  { name: '立夏', energy: 7, impact: 7, direction: 1, temporal: 2, intensity: 'high' },
  { name: '小滿', energy: 6, impact: 6, direction: 1, temporal: 2, intensity: 'medium' },
  { name: '芒種', energy: 8, impact: 8, direction: 0, temporal: 1, intensity: 'high' },
  { name: '夏至', energy: 10, impact: 9, direction: 0, temporal: 2, intensity: 'extreme' },
  { name: '小暑', energy: 7, impact: 7, direction: -1, temporal: 1, intensity: 'high' },
  { name: '大暑', energy: 9, impact: 9, direction: -1, temporal: 1, intensity: 'extreme' },
  { name: '立秋', energy: 6, impact: 6, direction: 0, temporal: 2, intensity: 'medium' },
  { name: '處暑', energy: 5, impact: 6, direction: 0, temporal: 2, intensity: 'medium' },
  { name: '白露', energy: 5, impact: 6, direction: 0, temporal: 1, intensity: 'medium' },
  { name: '秋分', energy: 5, impact: 6, direction: 0, temporal: 2, intensity: 'medium' },
  { name: '寒露', energy: 4, impact: 5, direction: -1, temporal: 2, intensity: 'low' },
  { name: '霜降', energy: 6, impact: 7, direction: -1, temporal: 1, intensity: 'medium' },
  { name: '立冬', energy: 4, impact: 5, direction: 0, temporal: 3, intensity: 'low' },
  { name: '小雪', energy: 3, impact: 4, direction: 0, temporal: 2, intensity: 'low' },
  { name: '大雪', energy: 4, impact: 5, direction: 0, temporal: 3, intensity: 'low' },
  { name: '冬至', energy: 5, impact: 8, direction: 0, temporal: 2, intensity: 'high' },
  { name: '小寒', energy: 6, impact: 7, direction: -1, temporal: 1, intensity: 'medium' },
  { name: '大寒', energy: 7, impact: 8, direction: -1, temporal: 1, intensity: 'extreme' }
];

const earthCards = [
  { name: '孤峰', energy: 6, impact: 7, direction: 0, temporal: 2, intensity: 'high' },
  { name: '深淵', energy: 5, impact: 8, direction: 0, temporal: 2, intensity: 'high' },
  { name: '平原', energy: 5, impact: 6, direction: 0, temporal: 2, intensity: 'medium' },
  { name: '迷宮', energy: 4, impact: 6, direction: -1, temporal: 2, intensity: 'medium' },
  { name: '要塞', energy: 5, impact: 6, direction: 0, temporal: 3, intensity: 'medium' },
  { name: '孤島', energy: 6, impact: 7, direction: 0, temporal: 2, intensity: 'high' },
  { name: '十字路口', energy: 5, impact: 8, direction: 0, temporal: 1, intensity: 'high' },
  { name: '溫室', energy: 4, impact: 5, direction: 0, temporal: 3, intensity: 'low' },
  { name: '獨木橋', energy: 6, impact: 7, direction: 0, temporal: 1, intensity: 'high' },
  { name: '廢墟', energy: 5, impact: 8, direction: 0, temporal: 2, intensity: 'high' },
  { name: '劇場', energy: 7, impact: 7, direction: 1, temporal: 1, intensity: 'high' },
  { name: '後花園', energy: 3, impact: 4, direction: 1, temporal: 3, intensity: 'low' }
];

const humanCards = [
  { name: '繼承者', energy: 6, impact: 7, direction: 0, temporal: 3, intensity: 'high' },
  { name: '局外人', energy: 4, impact: 6, direction: 0, temporal: 2, intensity: 'medium' },
  { name: '調停者', energy: 6, impact: 7, direction: 0, temporal: 1, intensity: 'high' },
  { name: '領航員', energy: 8, impact: 9, direction: 1, temporal: 2, intensity: 'high' },
  { name: '隱士', energy: 4, impact: 6, direction: 0, temporal: 3, intensity: 'medium' },
  { name: '競爭者', energy: 7, impact: 8, direction: 0, temporal: 2, intensity: 'high' },
  { name: '後援者', energy: 5, impact: 6, direction: 1, temporal: 2, intensity: 'medium' },
  { name: '反叛者', energy: 7, impact: 8, direction: 0, temporal: 1, intensity: 'high' },
  { name: '崇拜者', energy: 5, impact: 6, direction: 0, temporal: 2, intensity: 'medium' },
  { name: '導師', energy: 7, impact: 7, direction: 1, temporal: 2, intensity: 'high' },
  { name: '流浪者', energy: 5, impact: 6, direction: 0, temporal: 1, intensity: 'medium' },
  { name: '救贖者', energy: 6, impact: 7, direction: 1, temporal: 2, intensity: 'high' },
  { name: '旁觀者', energy: 4, impact: 5, direction: 0, temporal: 2, intensity: 'low' },
  { name: '背叛者', energy: 6, impact: 8, direction: -1, temporal: 1, intensity: 'high' },
  { name: '學徒', energy: 5, impact: 6, direction: 1, temporal: 2, intensity: 'medium' },
  { name: '玩伴', energy: 4, impact: 5, direction: 1, temporal: 1, intensity: 'low' },
  { name: '守門人', energy: 6, impact: 7, direction: 0, temporal: 2, intensity: 'high' },
  { name: '陌生人', energy: 4, impact: 6, direction: -1, temporal: 2, intensity: 'medium' }
];

const variableCards = [
  { name: '閃電', energy: 9, impact: 10, direction: -1, temporal: 1, intensity: 'extreme' },
  { name: '地震', energy: 8, impact: 9, direction: -1, temporal: 1, intensity: 'extreme' },
  { name: '彩虹', energy: 6, impact: 5, direction: 1, temporal: 1, intensity: 'medium' },
  { name: '迷路', energy: 5, impact: 6, direction: 0, temporal: 1, intensity: 'medium' },
  { name: '止步', energy: 4, impact: 6, direction: -1, temporal: 1, intensity: 'medium' },
  { name: '加速', energy: 7, impact: 7, direction: 0, temporal: 1, intensity: 'high' },
  { name: '空白', energy: 3, impact: 5, direction: 0, temporal: 2, intensity: 'low' },
  { name: '禮物', energy: 6, impact: 6, direction: 1, temporal: 1, intensity: 'medium' },
  { name: '醜聞', energy: 7, impact: 8, direction: -1, temporal: 1, intensity: 'high' },
  { name: '遺失', energy: 6, impact: 7, direction: -1, temporal: 1, intensity: 'high' },
  { name: '相遇', energy: 6, impact: 7, direction: 1, temporal: 2, intensity: 'high' },
  { name: '重逢', energy: 6, impact: 7, direction: 0, temporal: 2, intensity: 'high' },
  { name: '崩塌', energy: 8, impact: 9, direction: -1, temporal: 1, intensity: 'extreme' },
  { name: '狂風', energy: 7, impact: 7, direction: -1, temporal: 1, intensity: 'high' },
  { name: '乾涸', energy: 4, impact: 6, direction: -1, temporal: 2, intensity: 'medium' },
  { name: '火花', energy: 6, impact: 8, direction: 1, temporal: 1, intensity: 'high' },
  { name: '陷阱', energy: 6, impact: 7, direction: -1, temporal: 1, intensity: 'high' },
  { name: '奇蹟', energy: 10, impact: 10, direction: 1, temporal: 1, intensity: 'extreme' }
];

// 執行抽樣分析
const sampleSize = 10000;
const scores = [];
const levelCounts = {
  '極差': 0,
  '不佳': 0,
  '普通': 0,
  '良好': 0,
  '極佳': 0
};
const directionCounts = {
  '上升': 0,
  '持平': 0,
  '下降': 0
};
const timeCounts = {
  '短期': 0,
  '中期': 0,
  '長期': 0
};

console.log(`正在分析 ${sampleSize.toLocaleString()} 個隨機組合...\n`);

for (let i = 0; i < sampleSize; i++) {
  const sky = skyCards[Math.floor(Math.random() * skyCards.length)];
  const earth = earthCards[Math.floor(Math.random() * earthCards.length)];
  const human = humanCards[Math.floor(Math.random() * humanCards.length)];
  const variable = variableCards[Math.floor(Math.random() * variableCards.length)];
  
  const result = calculateFortune(sky, earth, human, variable);
  
  scores.push(result.totalScore);
  levelCounts[result.fortuneLevel]++;
  directionCounts[result.fortuneDirection]++;
  timeCounts[result.timePrediction]++;
  
  if ((i + 1) % 1000 === 0) {
    console.log(`已處理 ${(i + 1).toLocaleString()} / ${sampleSize.toLocaleString()}...`);
  }
}

// 計算統計數據
scores.sort((a, b) => a - b);
const min = scores[0];
const max = scores[scores.length - 1];
const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
const median = scores[Math.floor(scores.length / 2)];

const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
const stdDev = Math.sqrt(variance);

// 輸出結果
console.log('\n' + '='.repeat(60));
console.log('運勢分布分析報告（基於 ' + sampleSize.toLocaleString() + ' 個隨機樣本）');
console.log('='.repeat(60) + '\n');

console.log('【運勢等級分布】');
console.log('─'.repeat(60));
console.log('等級\t\t數量\t\t百分比');
console.log('─'.repeat(60));
Object.entries(levelCounts).forEach(([level, count]) => {
  const percent = (count / sampleSize) * 100;
  console.log(`${level}\t\t${count.toLocaleString()}\t\t${percent.toFixed(2)}%`);
});

console.log('\n【分數統計】');
console.log('─'.repeat(60));
console.log(`最小值：${min.toFixed(2)}`);
console.log(`最大值：${max.toFixed(2)}`);
console.log(`平均值：${mean.toFixed(2)}`);
console.log(`中位數：${median.toFixed(2)}`);
console.log(`標準差：${stdDev.toFixed(2)}`);

console.log('\n【運勢方向分布】');
console.log('─'.repeat(60));
Object.entries(directionCounts).forEach(([direction, count]) => {
  const percent = (count / sampleSize) * 100;
  console.log(`${direction}：${count.toLocaleString()} (${percent.toFixed(2)}%)`);
});

console.log('\n【時間預測分布】');
console.log('─'.repeat(60));
Object.entries(timeCounts).forEach(([time, count]) => {
  const percent = (count / sampleSize) * 100;
  console.log(`${time}：${count.toLocaleString()} (${percent.toFixed(2)}%)`);
});

// 均勻性分析
console.log('\n【均勻性分析】');
console.log('─'.repeat(60));
const expectedPercent = 100 / 5;
const deviations = Object.values(levelCounts).map(count => 
  Math.abs((count / sampleSize) * 100 - expectedPercent)
);
const avgDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length;
const maxDeviation = Math.max(...deviations);

console.log(`理論均勻分布：每個等級 20.00%`);
console.log(`平均偏差：${avgDeviation.toFixed(2)}%`);
console.log(`最大偏差：${maxDeviation.toFixed(2)}%`);

console.log('\n【均勻性評估】');
if (avgDeviation < 5) {
  console.log('✅ 分布相當均勻（平均偏差 < 5%）');
} else if (avgDeviation < 10) {
  console.log('⚠️  分布略有不均（平均偏差 5-10%）');
} else {
  console.log('❌ 分布明顯不均（平均偏差 > 10%）');
}

const cv = (stdDev / Math.abs(mean)) * 100;
console.log(`變異係數：${cv.toFixed(2)}% (值越大表示分布越分散)`);

