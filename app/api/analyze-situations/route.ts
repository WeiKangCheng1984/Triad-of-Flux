import { NextResponse } from 'next/server';
import { allCards } from '@/lib/cards';
import { situations } from '@/lib/situations';

export async function GET() {
  const results = situations.map(situation => {
    // 計算匹配的卡牌
    const matchedCards = allCards.filter(card => {
      return card.keywords.some(k => 
        situation.keywordMatches.some(sk => k.includes(sk) || sk.includes(k))
      );
    });
    
    // 統計類別分布
    const categoryDistribution = { 天: 0, 地: 0, 人: 0, 變數: 0 };
    matchedCards.forEach(card => {
      categoryDistribution[card.category]++;
    });
    
    // 計算每個類別的匹配率
    const categoryMatchRate = {
      天: (categoryDistribution.天 / 24) * 100,  // 天有24張
      地: (categoryDistribution.地 / 12) * 100,  // 地有12張
      人: (categoryDistribution.人 / 18) * 100,  // 人有18張
      變數: (categoryDistribution.變數 / 18) * 100  // 變數有18張
    };
    
    // 計算關鍵詞重複率
    const uniqueKeywords = new Set(situation.keywordMatches);
    const duplicateCount = situation.keywordMatches.length - uniqueKeywords.size;
    
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
    }
  });
}
