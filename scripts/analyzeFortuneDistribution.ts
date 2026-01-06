import { skyCards, earthCards, humanCards, variableCards } from '../lib/cards';
import { calculateFortune } from '../lib/fortune';
import { FortuneLevel } from '../types/card';

interface DistributionStats {
  total: number;
  byLevel: Record<FortuneLevel, number>;
  byLevelPercent: Record<FortuneLevel, number>;
  scoreRange: {
    min: number;
    max: number;
    mean: number;
    median: number;
    stdDev: number;
  };
  directionDistribution: {
    '上升': number;
    '持平': number;
    '下降': number;
  };
  timeDistribution: {
    '短期': number;
    '中期': number;
    '長期': number;
  };
  scoreDistribution: {
    '極差': { min: number; max: number; count: number };
    '不佳': { min: number; max: number; count: number };
    '普通': { min: number; max: number; count: number };
    '良好': { min: number; max: number; count: number };
    '極佳': { min: number; max: number; count: number };
  };
}

function analyzeFortuneDistribution(): DistributionStats {
  const scores: number[] = [];
  const levelCounts: Record<FortuneLevel, number> = {
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

  // 記錄每個等級的分數範圍
  const levelScores: Record<FortuneLevel, number[]> = {
    '極差': [],
    '不佳': [],
    '普通': [],
    '良好': [],
    '極佳': []
  };

  let total = 0;
  let processed = 0;

  // 遍歷所有組合
  for (const skyCard of skyCards) {
    for (const earthCard of earthCards) {
      for (const humanCard of humanCards) {
        for (const variableCard of variableCards) {
          const calculation = calculateFortune(skyCard, earthCard, humanCard, variableCard);
          
          scores.push(calculation.totalScore);
          levelCounts[calculation.fortuneLevel]++;
          levelScores[calculation.fortuneLevel].push(calculation.totalScore);
          directionCounts[calculation.fortuneDirection]++;
          timeCounts[calculation.timePrediction]++;
          total++;
          
          processed++;
          if (processed % 10000 === 0) {
            console.log(`已處理 ${processed.toLocaleString()} / ${(24 * 12 * 18 * 18).toLocaleString()} 組合...`);
          }
        }
      }
    }
  }

  // 計算統計數據
  scores.sort((a, b) => a - b);
  const min = scores[0];
  const max = scores[scores.length - 1];
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const median = scores[Math.floor(scores.length / 2)];
  
  // 計算標準差
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // 計算百分比
  const levelPercent: Record<FortuneLevel, number> = {
    '極差': (levelCounts['極差'] / total) * 100,
    '不佳': (levelCounts['不佳'] / total) * 100,
    '普通': (levelCounts['普通'] / total) * 100,
    '良好': (levelCounts['良好'] / total) * 100,
    '極佳': (levelCounts['極佳'] / total) * 100
  };

  // 計算每個等級的分數範圍
  const scoreDistribution = {
    '極差': {
      min: levelScores['極差'].length > 0 ? Math.min(...levelScores['極差']) : 0,
      max: levelScores['極差'].length > 0 ? Math.max(...levelScores['極差']) : 0,
      count: levelCounts['極差']
    },
    '不佳': {
      min: levelScores['不佳'].length > 0 ? Math.min(...levelScores['不佳']) : 0,
      max: levelScores['不佳'].length > 0 ? Math.max(...levelScores['不佳']) : 0,
      count: levelCounts['不佳']
    },
    '普通': {
      min: levelScores['普通'].length > 0 ? Math.min(...levelScores['普通']) : 0,
      max: levelScores['普通'].length > 0 ? Math.max(...levelScores['普通']) : 0,
      count: levelCounts['普通']
    },
    '良好': {
      min: levelScores['良好'].length > 0 ? Math.min(...levelScores['良好']) : 0,
      max: levelScores['良好'].length > 0 ? Math.max(...levelScores['良好']) : 0,
      count: levelCounts['良好']
    },
    '極佳': {
      min: levelScores['極佳'].length > 0 ? Math.min(...levelScores['極佳']) : 0,
      max: levelScores['極佳'].length > 0 ? Math.max(...levelScores['極佳']) : 0,
      count: levelCounts['極佳']
    }
  };

  return {
    total,
    byLevel: levelCounts,
    byLevelPercent: levelPercent,
    scoreRange: {
      min,
      max,
      mean,
      median,
      stdDev
    },
    directionDistribution: directionCounts,
    timeDistribution: timeCounts,
    scoreDistribution
  };
}

// 執行分析
console.log('開始分析運勢分布...\n');
const stats = analyzeFortuneDistribution();

console.log('\n' + '='.repeat(60));
console.log('運勢分布分析報告');
console.log('='.repeat(60) + '\n');

console.log(`總組合數：${stats.total.toLocaleString()}\n`);

console.log('【運勢等級分布】');
console.log('─'.repeat(60));
console.log('等級\t\t數量\t\t百分比\t\t分數範圍');
console.log('─'.repeat(60));
Object.entries(stats.byLevel).forEach(([level, count]) => {
  const percent = stats.byLevelPercent[level as FortuneLevel];
  const range = stats.scoreDistribution[level as FortuneLevel];
  console.log(
    `${level}\t\t${count.toLocaleString()}\t\t${percent.toFixed(2)}%\t\t[${range.min.toFixed(2)}, ${range.max.toFixed(2)}]`
  );
});

console.log('\n【分數統計】');
console.log('─'.repeat(60));
console.log(`最小值：${stats.scoreRange.min.toFixed(2)}`);
console.log(`最大值：${stats.scoreRange.max.toFixed(2)}`);
console.log(`平均值：${stats.scoreRange.mean.toFixed(2)}`);
console.log(`中位數：${stats.scoreRange.median.toFixed(2)}`);
console.log(`標準差：${stats.scoreRange.stdDev.toFixed(2)}`);

console.log('\n【運勢方向分布】');
console.log('─'.repeat(60));
Object.entries(stats.directionDistribution).forEach(([direction, count]) => {
  const percent = (count / stats.total) * 100;
  console.log(`${direction}：${count.toLocaleString()} (${percent.toFixed(2)}%)`);
});

console.log('\n【時間預測分布】');
console.log('─'.repeat(60));
Object.entries(stats.timeDistribution).forEach(([time, count]) => {
  const percent = (count / stats.total) * 100;
  console.log(`${time}：${count.toLocaleString()} (${percent.toFixed(2)}%)`);
});

// 均勻性分析
console.log('\n【均勻性分析】');
console.log('─'.repeat(60));
const expectedPercent = 100 / 5; // 理論上每個等級應該佔20%
const deviations = Object.values(stats.byLevelPercent).map(percent => 
  Math.abs(percent - expectedPercent)
);
const avgDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length;
const maxDeviation = Math.max(...deviations);

console.log(`理論均勻分布：每個等級 20.00%`);
console.log(`平均偏差：${avgDeviation.toFixed(2)}%`);
console.log(`最大偏差：${maxDeviation.toFixed(2)}%`);

// 判斷均勻性
console.log('\n【均勻性評估】');
if (avgDeviation < 5) {
  console.log('✅ 分布相當均勻（平均偏差 < 5%）');
} else if (avgDeviation < 10) {
  console.log('⚠️  分布略有不均（平均偏差 5-10%）');
} else {
  console.log('❌ 分布明顯不均（平均偏差 > 10%）');
}

// 計算變異係數（CV = 標準差 / 平均值）
const cv = (stats.scoreRange.stdDev / Math.abs(stats.scoreRange.mean)) * 100;
console.log(`變異係數：${cv.toFixed(2)}% (值越大表示分布越分散)`);

export { stats };
