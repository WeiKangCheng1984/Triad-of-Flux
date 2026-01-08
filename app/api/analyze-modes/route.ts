import { NextResponse } from 'next/server';
import { allCards, drawRandomCard } from '@/lib/cards';
import { situations, drawSituationCards } from '@/lib/situations';
import { CardWeight } from '@/types/card';

export async function GET() {
  const SIMULATION_COUNT = 1000; // 模擬抽卡次數
  
  // 單卡模式統計
  const singleCardStats: Record<string, { count: number; frequency: number }> = {};
  const singleCategoryStats = { 天: 0, 地: 0, 人: 0, 變數: 0 };
  
  for (let i = 0; i < SIMULATION_COUNT; i++) {
    const card = drawRandomCard();
    singleCardStats[card.id] = {
      count: (singleCardStats[card.id]?.count || 0) + 1,
      frequency: 0
    };
    singleCategoryStats[card.category]++;
  }
  
  // 計算頻率
  Object.keys(singleCardStats).forEach(cardId => {
    singleCardStats[cardId].frequency = (singleCardStats[cardId].count / SIMULATION_COUNT) * 100;
  });
  
  // 四卡模式統計
  const fortuneCardStats: Record<string, { count: number; frequency: number; positions: { first: number; second: number; third: number; fourth: number } }> = {};
  const fortuneCategoryStats = {
    first: { 天: 0, 地: 0, 人: 0, 變數: 0 },
    second: { 天: 0, 地: 0, 人: 0, 變數: 0 },
    third: { 天: 0, 地: 0, 人: 0, 變數: 0 },
    fourth: { 天: 0, 地: 0, 人: 0, 變數: 0 }
  };
  const categories: CardWeight['category'][] = ['天', '地', '人', '變數'];
  
  for (let i = 0; i < SIMULATION_COUNT; i++) {
    const cards = [
      drawRandomCard('天'),
      drawRandomCard('地'),
      drawRandomCard('人'),
      drawRandomCard('變數')
    ];
    
    cards.forEach((card, index) => {
      const position = index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : 'fourth';
      
      if (!fortuneCardStats[card.id]) {
        fortuneCardStats[card.id] = {
          count: 0,
          frequency: 0,
          positions: { first: 0, second: 0, third: 0, fourth: 0 }
        };
      }
      
      fortuneCardStats[card.id].count++;
      fortuneCardStats[card.id].positions[position]++;
      fortuneCategoryStats[position][card.category]++;
    });
  }
  
  // 計算頻率
  Object.keys(fortuneCardStats).forEach(cardId => {
    fortuneCardStats[cardId].frequency = (fortuneCardStats[cardId].count / (SIMULATION_COUNT * 4)) * 100;
  });
  
  // 情境模式統計
  const situationStats: Record<string, {
    uniqueCards: number;
    cardFrequency: Record<string, number>;
    categoryDistribution: { 天: number; 地: number; 人: number; 變數: number };
    positionStats: {
      first: { 天: number; 地: number; 人: number; 變數: number };
      second: { 天: number; 地: number; 人: number; 變數: number };
      third: { 天: number; 地: number; 人: number; 變數: number };
    };
  }> = {};
  
  situations.forEach(situation => {
    const cardFrequency: Record<string, number> = {};
    const categoryDistribution = { 天: 0, 地: 0, 人: 0, 變數: 0 };
    const positionStats = {
      first: { 天: 0, 地: 0, 人: 0, 變數: 0 },
      second: { 天: 0, 地: 0, 人: 0, 變數: 0 },
      third: { 天: 0, 地: 0, 人: 0, 變數: 0 }
    };
    
    for (let i = 0; i < SIMULATION_COUNT; i++) {
      const cards = drawSituationCards(situation, 3);
      
      cards.forEach((card, index) => {
        cardFrequency[card.id] = (cardFrequency[card.id] || 0) + 1;
        categoryDistribution[card.category]++;
        
        const position = index === 0 ? 'first' : index === 1 ? 'second' : 'third';
        positionStats[position][card.category]++;
      });
    }
    
    situationStats[situation.id] = {
      uniqueCards: Object.keys(cardFrequency).length,
      cardFrequency,
      categoryDistribution,
      positionStats
    };
  });
  
  // 計算均勻度指標（使用變異係數 CV = 標準差 / 平均值）
  function calculateUniformity(frequencies: number[]): { cv: number; isUniform: boolean; rating: string } {
    if (frequencies.length === 0) return { cv: 0, isUniform: false, rating: '無數據' };
    
    const mean = frequencies.reduce((sum, val) => sum + val, 0) / frequencies.length;
    const variance = frequencies.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / frequencies.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? stdDev / mean : 0; // 變異係數
    
    // CV < 0.3 為均勻，0.3-0.6 為較均勻，> 0.6 為不均勻
    let rating: string;
    let isUniform: boolean;
    if (cv < 0.3) {
      rating = '非常均勻';
      isUniform = true;
    } else if (cv < 0.6) {
      rating = '較為均勻';
      isUniform = true;
    } else {
      rating = '不均勻';
      isUniform = false;
    }
    
    return { cv, isUniform, rating };
  }
  
  // 單卡模式均勻度
  const singleFrequencies = Object.values(singleCardStats).map(s => s.frequency);
  const singleUniformity = calculateUniformity(singleFrequencies);
  
  // 四卡模式均勻度
  const fortuneFrequencies = Object.values(fortuneCardStats).map(s => s.frequency);
  const fortuneUniformity = calculateUniformity(fortuneFrequencies);
  
  // 情境模式均勻度（每個情境分別計算）
  const situationUniformities: Record<string, { cv: number; isUniform: boolean; rating: string }> = {};
  situations.forEach(situation => {
    const frequencies = Object.values(situationStats[situation.id].cardFrequency);
    situationUniformities[situation.id] = calculateUniformity(frequencies);
  });
  
  // 類別分布合理性檢查
  function checkCategoryDistribution(
    actual: { 天: number; 地: number; 人: number; 變數: number },
    expected?: { 天: number; 地: number; 人: number; 變數: number }
  ): { isReasonable: boolean; rating: string; details: Record<string, { actual: number; expected: number; diff: number }> } {
    const total = actual.天 + actual.地 + actual.人 + actual.變數;
    if (total === 0) {
      return { isReasonable: false, rating: '無數據', details: {} };
    }
    
    const actualRatios = {
      天: (actual.天 / total) * 100,
      地: (actual.地 / total) * 100,
      人: (actual.人 / total) * 100,
      變數: (actual.變數 / total) * 100
    };
    
    if (!expected) {
      // 單卡和四卡模式：期望均勻分布（各 25%）
      expected = { 天: 25, 地: 25, 人: 25, 變數: 25 };
    } else {
      // 情境模式：使用情境的類別權重
      expected = {
        天: expected.天 * 100,
        地: expected.地 * 100,
        人: expected.人 * 100,
        變數: expected.變數 * 100
      };
    }
    
    const details: Record<string, { actual: number; expected: number; diff: number }> = {};
    let maxDiff = 0;
    
    (['天', '地', '人', '變數'] as const).forEach(category => {
      const diff = Math.abs(actualRatios[category] - expected[category]);
      details[category] = {
        actual: actualRatios[category],
        expected: expected[category],
        diff
      };
      maxDiff = Math.max(maxDiff, diff);
    });
    
    // 最大差異 < 10% 為合理，10-20% 為較合理，> 20% 為不合理
    let rating: string;
    let isReasonable: boolean;
    if (maxDiff < 10) {
      rating = '非常合理';
      isReasonable = true;
    } else if (maxDiff < 20) {
      rating = '較為合理';
      isReasonable = true;
    } else {
      rating = '不合理';
      isReasonable = false;
    }
    
    return { isReasonable, rating, details };
  }
  
  // 單卡模式類別分布
  const singleCategoryDistribution = checkCategoryDistribution(singleCategoryStats);
  
  // 四卡模式類別分布（應該各位置都是 100% 對應類別）
  const fortuneCategoryDistribution = {
    first: checkCategoryDistribution(fortuneCategoryStats.first, { 天: 1, 地: 0, 人: 0, 變數: 0 }),
    second: checkCategoryDistribution(fortuneCategoryStats.second, { 天: 0, 地: 1, 人: 0, 變數: 0 }),
    third: checkCategoryDistribution(fortuneCategoryStats.third, { 天: 0, 地: 0, 人: 1, 變數: 0 }),
    fourth: checkCategoryDistribution(fortuneCategoryStats.fourth, { 天: 0, 地: 0, 人: 0, 變數: 1 })
  };
  
  // 情境模式類別分布
  const situationCategoryDistributions: Record<string, ReturnType<typeof checkCategoryDistribution>> = {};
  situations.forEach(situation => {
    situationCategoryDistributions[situation.id] = checkCategoryDistribution(
      situationStats[situation.id].categoryDistribution,
      situation.categoryWeights
    );
  });
  
  return NextResponse.json({
    simulation: {
      count: SIMULATION_COUNT,
      description: '三個模式的統計分析'
    },
    single: {
      totalCards: allCards.length,
      uniqueCardsDrawn: Object.keys(singleCardStats).length,
      uniqueCardsRate: ((Object.keys(singleCardStats).length / allCards.length) * 100).toFixed(1) + '%',
      categoryDistribution: singleCategoryStats,
      categoryDistributionCheck: singleCategoryDistribution,
      uniformity: singleUniformity,
      topCards: Object.entries(singleCardStats)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([cardId, stats]) => {
          const card = allCards.find(c => c.id === cardId);
          return {
            cardId,
            cardName: card?.name || '未知',
            category: card?.category || '未知',
            count: stats.count,
            frequency: stats.frequency.toFixed(2) + '%'
          };
        })
    },
    fortune: {
      totalCards: allCards.length,
      uniqueCardsDrawn: Object.keys(fortuneCardStats).length,
      uniqueCardsRate: ((Object.keys(fortuneCardStats).length / allCards.length) * 100).toFixed(1) + '%',
      categoryDistribution: fortuneCategoryStats,
      categoryDistributionCheck: fortuneCategoryDistribution,
      uniformity: fortuneUniformity,
      topCards: Object.entries(fortuneCardStats)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([cardId, stats]) => {
          const card = allCards.find(c => c.id === cardId);
          return {
            cardId,
            cardName: card?.name || '未知',
            category: card?.category || '未知',
            count: stats.count,
            frequency: stats.frequency.toFixed(2) + '%',
            positions: stats.positions
          };
        })
    },
    situation: {
      situations: situations.map(situation => ({
        id: situation.id,
        name: situation.name,
        uniqueCards: situationStats[situation.id].uniqueCards,
        uniqueCardsRate: ((situationStats[situation.id].uniqueCards / allCards.length) * 100).toFixed(1) + '%',
        categoryDistribution: situationStats[situation.id].categoryDistribution,
        categoryDistributionCheck: situationCategoryDistributions[situation.id],
        uniformity: situationUniformities[situation.id],
        positionStats: situationStats[situation.id].positionStats,
        topCards: Object.entries(situationStats[situation.id].cardFrequency)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([cardId, count]) => {
            const card = allCards.find(c => c.id === cardId);
            return {
              cardId,
              cardName: card?.name || '未知',
              category: card?.category || '未知',
              count,
              frequency: ((count / (SIMULATION_COUNT * 3)) * 100).toFixed(2) + '%'
            };
          })
      }))
    },
    summary: {
      single: {
        uniformity: singleUniformity.rating,
        categoryDistribution: singleCategoryDistribution.rating,
        overall: singleUniformity.isUniform && singleCategoryDistribution.isReasonable ? '良好' : '需改善'
      },
      fortune: {
        uniformity: fortuneUniformity.rating,
        categoryDistribution: Object.values(fortuneCategoryDistribution).every(c => c.isReasonable) ? '非常合理' : '需改善',
        overall: fortuneUniformity.isUniform ? '良好' : '需改善'
      },
      situation: {
        averageUniqueCards: (situations.reduce((sum, s) => sum + situationStats[s.id].uniqueCards, 0) / situations.length).toFixed(1),
        averageUniformity: Object.values(situationUniformities).every(u => u.isUniform) ? '良好' : '需改善',
        categoryDistribution: Object.values(situationCategoryDistributions).every(c => c.isReasonable) ? '良好' : '需改善',
        overall: Object.values(situationUniformities).every(u => u.isUniform) && 
                 Object.values(situationCategoryDistributions).every(c => c.isReasonable) ? '良好' : '需改善'
      }
    }
  });
}
