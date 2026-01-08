import { NextResponse } from 'next/server';
import { allCards } from '@/lib/cards';
import { situations, drawSituationCards } from '@/lib/situations';
import { CardWeight } from '@/types/card';

export async function GET() {
  const SIMULATION_COUNT = 1000; // 模擬抽卡次數
  
  const results = situations.map(situation => {
    // 1. 計算匹配的卡牌（關鍵詞匹配）
    const matchedCards = allCards.filter(card => {
      return card.keywords.some(k => 
        situation.keywordMatches.some(sk => k.includes(sk) || sk.includes(k))
      );
    });
    
    // 2. 統計類別分布（關鍵詞匹配）
    const categoryDistribution = { 天: 0, 地: 0, 人: 0, 變數: 0 };
    matchedCards.forEach(card => {
      categoryDistribution[card.category]++;
    });
    
    // 3. 計算每個類別的匹配率
    const categoryMatchRate = {
      天: (categoryDistribution.天 / 24) * 100,
      地: (categoryDistribution.地 / 12) * 100,
      人: (categoryDistribution.人 / 18) * 100,
      變數: (categoryDistribution.變數 / 18) * 100
    };
    
    // 4. 模擬抽卡統計（第一、二、三張卡牌的分布）
    const cardPositionStats: Record<string, { first: number; second: number; third: number; total: number }> = {};
    const positionCategoryStats = {
      first: { 天: 0, 地: 0, 人: 0, 變數: 0 },
      second: { 天: 0, 地: 0, 人: 0, 變數: 0 },
      third: { 天: 0, 地: 0, 人: 0, 變數: 0 }
    };
    
    // 模擬抽卡
    for (let i = 0; i < SIMULATION_COUNT; i++) {
      const drawnCards = drawSituationCards(situation, 3);
      
      drawnCards.forEach((card, index) => {
        const position = index === 0 ? 'first' : index === 1 ? 'second' : 'third';
        
        // 統計卡牌出現位置
        if (!cardPositionStats[card.id]) {
          cardPositionStats[card.id] = { first: 0, second: 0, third: 0, total: 0 };
        }
        cardPositionStats[card.id][position]++;
        cardPositionStats[card.id].total++;
        
        // 統計類別分布
        positionCategoryStats[position][card.category]++;
      });
    }
    
    // 5. 計算每張卡牌出現的頻率
    const cardFrequency = Object.entries(cardPositionStats)
      .map(([cardId, stats]) => {
        const card = allCards.find(c => c.id === cardId);
        return {
          cardId,
          cardName: card?.name || '未知',
          category: card?.category || '未知',
          first: stats.first,
          second: stats.second,
          third: stats.third,
          total: stats.total,
          frequency: ((stats.total / (SIMULATION_COUNT * 3)) * 100).toFixed(2) + '%'
        };
      })
      .sort((a, b) => b.total - a.total);
    
    // 6. 計算位置類別分布百分比
    const positionCategoryPercent = {
      first: {
        天: ((positionCategoryStats.first.天 / SIMULATION_COUNT) * 100).toFixed(1) + '%',
        地: ((positionCategoryStats.first.地 / SIMULATION_COUNT) * 100).toFixed(1) + '%',
        人: ((positionCategoryStats.first.人 / SIMULATION_COUNT) * 100).toFixed(1) + '%',
        變數: ((positionCategoryStats.first.變數 / SIMULATION_COUNT) * 100).toFixed(1) + '%'
      },
      second: {
        天: ((positionCategoryStats.second.天 / SIMULATION_COUNT) * 100).toFixed(1) + '%',
        地: ((positionCategoryStats.second.地 / SIMULATION_COUNT) * 100).toFixed(1) + '%',
        人: ((positionCategoryStats.second.人 / SIMULATION_COUNT) * 100).toFixed(1) + '%',
        變數: ((positionCategoryStats.second.變數 / SIMULATION_COUNT) * 100).toFixed(1) + '%'
      },
      third: {
        天: ((positionCategoryStats.third.天 / SIMULATION_COUNT) * 100).toFixed(1) + '%',
        地: ((positionCategoryStats.third.地 / SIMULATION_COUNT) * 100).toFixed(1) + '%',
        人: ((positionCategoryStats.third.人 / SIMULATION_COUNT) * 100).toFixed(1) + '%',
        變數: ((positionCategoryStats.third.變數 / SIMULATION_COUNT) * 100).toFixed(1) + '%'
      }
    };
    
    // 7. 計算唯一關鍵詞
    const uniqueKeywords = new Set(situation.keywordMatches);
    const duplicateCount = situation.keywordMatches.length - uniqueKeywords.size;
    
    // 8. 計算實際抽到的卡牌種類數
    const uniqueCardsDrawn = Object.keys(cardPositionStats).length;
    
    return {
      id: situation.id,
      name: situation.name,
      keywordCount: situation.keywordMatches.length,
      uniqueKeywordCount: uniqueKeywords.size,
      duplicateKeywords: duplicateCount,
      totalMatched: matchedCards.length,
      matchRate: ((matchedCards.length / 72) * 100).toFixed(1) + '%',
      categoryDistribution,
      categoryMatchRate,
      categoryWeights: situation.categoryWeights,
      // 模擬抽卡統計
      simulation: {
        count: SIMULATION_COUNT,
        uniqueCardsDrawn,
        uniqueCardsRate: ((uniqueCardsDrawn / 72) * 100).toFixed(1) + '%',
        positionCategoryStats: positionCategoryPercent,
        topCards: cardFrequency.slice(0, 10), // 前10張最常出現的卡牌
        cardFrequency: cardFrequency.slice(0, 20) // 前20張卡牌的詳細統計
      },
      // 檢查類別權重與匹配率的差異
      categoryWeightVsMatch: {
        天: {
          weight: (situation.categoryWeights.天 * 100).toFixed(0) + '%',
          matchRate: categoryMatchRate.天.toFixed(1) + '%',
          difference: (categoryMatchRate.天 - situation.categoryWeights.天 * 100).toFixed(1) + '%'
        },
        地: {
          weight: (situation.categoryWeights.地 * 100).toFixed(0) + '%',
          matchRate: categoryMatchRate.地.toFixed(1) + '%',
          difference: (categoryMatchRate.地 - situation.categoryWeights.地 * 100).toFixed(1) + '%'
        },
        人: {
          weight: (situation.categoryWeights.人 * 100).toFixed(0) + '%',
          matchRate: categoryMatchRate.人.toFixed(1) + '%',
          difference: (categoryMatchRate.人 - situation.categoryWeights.人 * 100).toFixed(1) + '%'
        },
        變數: {
          weight: (situation.categoryWeights.變數 * 100).toFixed(0) + '%',
          matchRate: categoryMatchRate.變數.toFixed(1) + '%',
          difference: (categoryMatchRate.變數 - situation.categoryWeights.變數 * 100).toFixed(1) + '%'
        }
      }
    };
  });
  
  // 計算總體統計
  const totalStats = {
    averageMatched: (results.reduce((sum, r) => sum + r.totalMatched, 0) / results.length).toFixed(1),
    averageMatchRate: (results.reduce((sum, r) => sum + parseFloat(r.matchRate.replace('%', '')), 0) / results.length).toFixed(1) + '%',
    minMatched: Math.min(...results.map(r => r.totalMatched)),
    maxMatched: Math.max(...results.map(r => r.totalMatched)),
    averageUniqueCardsDrawn: (results.reduce((sum, r) => sum + r.simulation.uniqueCardsDrawn, 0) / results.length).toFixed(1),
    totalUniqueKeywords: new Set(results.flatMap(r => r.name)).size
  };
  
  return NextResponse.json({
    situations: results,
    summary: totalStats,
    cardPool: {
      total: 72,
      天: 24,
      地: 12,
      人: 18,
      變數: 18
    },
    simulationInfo: {
      count: SIMULATION_COUNT,
      description: `每個情境模擬 ${SIMULATION_COUNT} 次抽卡，統計第一、二、三張卡牌的分布情況`
    }
  });
}
