import { NextResponse } from 'next/server';
import { skyCards, earthCards, humanCards, variableCards } from '@/lib/cards';
import { calculateFortune } from '@/lib/fortune';

export async function GET() {
  const scores: number[] = [];
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

  const levelScores: Record<string, number[]> = {
    '極差': [],
    '不佳': [],
    '普通': [],
    '良好': [],
    '極佳': []
  };

  let total = 0;

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
  
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  const levelPercent = {
    '極差': (levelCounts['極差'] / total) * 100,
    '不佳': (levelCounts['不佳'] / total) * 100,
    '普通': (levelCounts['普通'] / total) * 100,
    '良好': (levelCounts['良好'] / total) * 100,
    '極佳': (levelCounts['極佳'] / total) * 100
  };

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

  const expectedPercent = 100 / 5;
  const deviations = Object.values(levelPercent).map(percent => 
    Math.abs(percent - expectedPercent)
  );
  const avgDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length;
  const maxDeviation = Math.max(...deviations);

  const cv = (stdDev / Math.abs(mean)) * 100;

  return NextResponse.json({
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
    scoreDistribution,
    uniformity: {
      expectedPercent,
      avgDeviation,
      maxDeviation,
      cv,
      assessment: avgDeviation < 5 ? '均勻' : avgDeviation < 10 ? '略有不均' : '明顯不均'
    }
  });
}

