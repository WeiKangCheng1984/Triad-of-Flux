import { Situation, SituationResult } from '@/types/situation';
import { CardWeight } from '@/types/card';

// 計算整體狀態指標
function calculateSituationMetrics(cards: CardWeight[]) {
  const energyAvg = cards.reduce((sum, c) => sum + c.energy, 0) / cards.length;
  const impactAvg = cards.reduce((sum, c) => sum + c.impact, 0) / cards.length;
  const directionSum = cards.reduce((sum, c) => sum + c.direction, 0);
  const temporalAvg = cards.reduce((sum, c) => sum + c.temporal, 0) / cards.length;
  
  const extremeCount = cards.filter(c => c.intensity === 'extreme').length;
  const highIntensityCount = cards.filter(c => c.intensity === 'high' || c.intensity === 'extreme').length;
  const positiveCount = cards.filter(c => c.direction > 0).length;
  const negativeCount = cards.filter(c => c.direction < 0).length;
  
  // 判斷整體狀態
  let overallState: 'excellent' | 'good' | 'neutral' | 'challenging' | 'critical';
  if (directionSum >= 2 && energyAvg >= 7 && impactAvg >= 7) {
    overallState = 'excellent';
  } else if (directionSum >= 1 && energyAvg >= 5) {
    overallState = 'good';
  } else if (directionSum === 0 && energyAvg >= 4 && energyAvg <= 6) {
    overallState = 'neutral';
  } else if (directionSum >= -1) {
    overallState = 'challenging';
  } else {
    overallState = 'critical';
  }
  
  return {
    energyAvg,
    impactAvg,
    directionSum,
    temporalAvg,
    extremeCount,
    highIntensityCount,
    positiveCount,
    negativeCount,
    overallState
  };
}

// 分析卡牌組合模式
function analyzeCardCombination(cards: CardWeight[]) {
  const categories = cards.map(c => c.category);
  const categoryCounts = {
    天: categories.filter(c => c === '天').length,
    地: categories.filter(c => c === '地').length,
    人: categories.filter(c => c === '人').length,
    變數: categories.filter(c => c === '變數').length
  };
  
  const patterns: string[] = [];
  
  // 極端組合
  if (cards.filter(c => c.intensity === 'extreme').length >= 2) {
    patterns.push('極端組合');
  }
  
  // 能量高峰
  if (cards.filter(c => c.energy >= 8).length >= 2) {
    patterns.push('能量高峰');
  }
  
  // 轉折點
  if (cards.some(c => c.name === '冬至' || c.name === '夏至' || c.name === '奇蹟')) {
    patterns.push('轉折點');
  }
  
  // 危機四伏
  if (cards.filter(c => c.direction < 0 && c.impact >= 7).length >= 2) {
    patterns.push('危機四伏');
  }
  
  // 重生契機
  if (cards.some(c => c.name === '廢墟' || c.name === '大寒') && 
      cards.some(c => c.name === '奇蹟' || c.name === '立春')) {
    patterns.push('重生契機');
  }
  
  // 完美平衡
  if (cards.every(c => c.direction === 0) && 
      cards.every(c => c.energy >= 4 && c.energy <= 6)) {
    patterns.push('完美平衡');
  }
  
  // 類別集中
  if (categoryCounts.天 >= 2) patterns.push('能量集中');
  if (categoryCounts.地 >= 2) patterns.push('環境集中');
  if (categoryCounts.人 >= 2) patterns.push('關係集中');
  if (categoryCounts.變數 >= 2) patterns.push('變數集中');
  
  return { patterns, categoryCounts };
}

// 情境化解讀模板
const interpretationTemplates: Record<string, {
  opening: (cards: CardWeight[], metrics: ReturnType<typeof calculateSituationMetrics>, situation: Situation) => string;
  analysis: (cards: CardWeight[], metrics: ReturnType<typeof calculateSituationMetrics>, combination: ReturnType<typeof analyzeCardCombination>, situation: Situation) => string;
  advice: (cards: CardWeight[], metrics: ReturnType<typeof calculateSituationMetrics>, combination: ReturnType<typeof analyzeCardCombination>, situation: Situation) => string[];
  closing: (cards: CardWeight[], metrics: ReturnType<typeof calculateSituationMetrics>, situation: Situation) => string;
}> = {
  work: {
    opening: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '在工作事業方面，你正處於一個能量充沛的階段。',
          '從卡牌來看，你的工作狀態非常積極，充滿可能性。',
          '在工作領域，你現在擁有的條件足以支撐你走向更高的層次。',
          '當前的職場能量流動非常順暢，這是展現能力的好時機。',
          '工作方面，你正站在一個有利的起點上，機會就在眼前。'
        ],
        good: [
          '在工作事業方面，整體趨勢是穩步上升的。',
          '從卡牌來看，你的工作狀態雖然不是完美，但已經足夠支撐你的目標。',
          '在工作領域，雖然有些挑戰，但你有足夠的資源應對。',
          '當前的職場狀態正在改善，現在是行動的好時機。',
          '工作方面，你正處於一個上升的軌道上，持續努力會有回報。'
        ],
        neutral: [
          '在工作事業方面，你正處於一個轉換期，需要仔細觀察。',
          '從卡牌來看，你的工作狀態相對平穩，但也暗藏變化。',
          '在工作領域，這是一個需要耐心等待的階段。',
          '當前的職場能量流動平穩，但需要留意細微的變化。',
          '工作方面，你正處在一個過渡的時期，需要保持平衡。'
        ],
        challenging: [
          '在工作事業方面，你現在面臨一些困難，需要謹慎應對。',
          '從卡牌來看，你的工作狀態需要調整策略。',
          '在工作領域，當前的環境對你不太友善，需要重新規劃。',
          '當前的職場能量流動受阻，這是一個考驗你韌性的時刻。',
          '工作方面，你正處在一個需要調整的階段，保持冷靜很重要。'
        ],
        critical: [
          '在工作事業方面，你正處於一個極具挑戰的階段。',
          '從卡牌來看，你正面臨一個重大的工作考驗。',
          '在工作領域，當前的困境雖然嚴峻，但也可能是轉機的開始。',
          '當前的職場能量流動非常低弱，但這也意味著轉機即將到來。',
          '工作方面，這是最需要堅持的時刻，相信你的努力會帶來改變。'
        ]
      };
      
      if (metrics.overallState === 'excellent' && cards.some(c => c.name === '領航員' || c.name === '夏至')) {
        return '在工作事業方面，你正處於領導力和影響力的高峰，這是展現才華的最佳時機。';
      }
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    },
    analysis: (cards, metrics, combination, situation) => {
      const parts: string[] = [];
      
      // 第一張卡牌分析
      const firstCard = cards[0];
      if (firstCard.category === '天') {
        const energyTemplates = {
          high: [
            `「${firstCard.name}」顯示你的工作能量非常充沛，這股力量將推動你在職場上前進。`,
            `從「${firstCard.name}」來看，你現在擁有足夠的能量來應對各種工作挑戰。`,
            `「${firstCard.name}」帶來的能量流動非常強勁，適合展開重要的工作計劃。`
          ],
          medium: [
            `「${firstCard.name}」顯示你的工作能量狀態相對穩定，這是一個可以持續發展的基礎。`,
            `從「${firstCard.name}」來看，你的職場能量流動平穩，適合按部就班地推進。`,
            `「${firstCard.name}」帶來的能量雖然不強烈，但穩定可靠，適合長期規劃。`
          ],
          low: [
            `「${firstCard.name}」顯示你的工作能量較為低弱，需要先恢復再行動。`,
            `從「${firstCard.name}」來看，你現在的能量不足以支撐大規模的工作行動。`,
            `「${firstCard.name}」帶來的能量流動較弱，這是休息和積蓄的時機。`
          ]
        };
        const energyLevel = firstCard.energy >= 7 ? 'high' : firstCard.energy >= 5 ? 'medium' : 'low';
        parts.push(energyTemplates[energyLevel][Math.floor(Math.random() * energyTemplates[energyLevel].length)]);
      } else if (firstCard.category === '地') {
        const envTemplates = {
          positive: [
            `在「${firstCard.name}」的工作環境中，你面臨非常有利的條件，可以充分利用這些資源。`,
            `「${firstCard.name}」為你提供了一個良好的職場環境，這是行動的好時機。`,
            `從「${firstCard.name}」來看，當前的職場環境對你非常友善，適合展開計劃。`
          ],
          neutral: [
            `在「${firstCard.name}」的工作環境中，你面臨中性的條件，需要自己創造機會。`,
            `「${firstCard.name}」提供的職場環境既不特別有利也不特別不利，關鍵在於你的選擇。`,
            `從「${firstCard.name}」來看，當前的職場環境是中性的，你的行動將決定結果。`
          ],
          negative: [
            `在「${firstCard.name}」的工作環境中，你面臨不小的挑戰，需要謹慎應對。`,
            `「${firstCard.name}」為你提供了一個充滿挑戰的職場環境，這是考驗你能力的時刻。`,
            `從「${firstCard.name}」來看，當前的職場環境對你不太友善，需要調整策略。`
          ]
        };
        const envType = firstCard.direction > 0 ? 'positive' : firstCard.direction < 0 ? 'negative' : 'neutral';
        parts.push(envTemplates[envType][Math.floor(Math.random() * envTemplates[envType].length)]);
      } else if (firstCard.category === '人') {
        parts.push(`作為「${firstCard.name}」，你在職場中扮演這個角色，${firstCard.direction > 0 ? '這將為你帶來支持' : firstCard.direction < 0 ? '這需要你調整互動方式' : '這需要你維持平衡'}。`);
      } else if (firstCard.category === '變數') {
        if (firstCard.intensity === 'extreme') {
          parts.push(`特別要注意「${firstCard.name}」這個變數，它將${firstCard.direction > 0 ? '帶來重大轉機' : '造成重大衝擊'}，你需要做好充分準備。`);
        } else {
          parts.push(`「${firstCard.name}」這個變數會${firstCard.direction > 0 ? '為你提供一些機會' : '帶來一些挑戰'}，需要你${firstCard.direction > 0 ? '把握機會' : '謹慎應對'}。`);
        }
      }
      
      // 第二張卡牌分析
      if (cards.length > 1) {
        const secondCard = cards[1];
        if (secondCard.category === '人') {
          parts.push(`在職場關係中，你正處於「${secondCard.name}」的位置，${secondCard.infoB ? secondCard.infoB.replace(/「|」/g, '') : '這需要你仔細思考自己的角色定位'}。`);
        } else {
          parts.push(`「${secondCard.name}」${secondCard.direction > 0 ? '為你的工作帶來正面影響' : secondCard.direction < 0 ? '為你的工作帶來挑戰' : '對你的工作保持中性影響'}，${secondCard.impact >= 7 ? '影響力相當重大' : '影響力中等'}。`);
        }
      }
      
      // 第三張卡牌分析
      if (cards.length > 2) {
        const thirdCard = cards[2];
        parts.push(`最後，「${thirdCard.name}」${thirdCard.temporal <= 1 ? '在短期內' : thirdCard.temporal >= 3 ? '在長期內' : '在中期內'}將${thirdCard.direction > 0 ? '為你帶來機會' : thirdCard.direction < 0 ? '帶來考驗' : '保持現狀'}。`);
      }
      
      // 組合模式分析
      if (combination.patterns.includes('極端組合')) {
        parts.push('這是一個極端的工作組合，所有因素都指向同一個方向，影響力將被放大，你需要做好充分準備。');
      } else if (combination.patterns.includes('能量高峰')) {
        parts.push('你正處於工作能量的高峰，這是展現影響力和領導力的最佳時機。');
      } else if (combination.patterns.includes('轉折點')) {
        parts.push('這是一個關鍵的工作轉折點，你的選擇將決定未來的職場走向。');
      } else if (combination.patterns.includes('危機四伏')) {
        parts.push('你正處於一個危機四伏的職場境地，但危機中也藏著轉機，需要保持冷靜。');
      } else if (combination.patterns.includes('重生契機')) {
        parts.push('從最深的低谷中，你看到了重生的曙光，這是一個重新開始工作機會的完美時機。');
      }
      
      // 整體趨勢
      if (metrics.directionSum >= 2) {
        parts.push('整體而言，你的工作運勢正在強勁上升，適合積極行動。');
      } else if (metrics.directionSum >= 1) {
        parts.push('整體而言，你的工作運勢正在穩步上升，保持當前節奏即可。');
      } else if (metrics.directionSum === 0) {
        parts.push('整體而言，你的工作運勢處於平衡狀態，需要耐心等待時機。');
      } else if (metrics.directionSum >= -1) {
        parts.push('整體而言，你的工作運勢面臨一些挑戰，需要調整策略。');
      } else {
        parts.push('整體而言，你的工作運勢處於低谷，但這也是轉機的開始。');
      }
      
      return parts.join(' ');
    },
    advice: (cards, metrics, combination, situation) => {
      const advice: string[] = [];
      
      // 基於能量等級的建議
      if (metrics.energyAvg >= 7) {
        advice.push('把握當前的工作機會，積極展現你的能力和才華');
        advice.push('可以考慮承擔更多責任或挑戰新的工作項目');
        if (cards.some(c => c.name === '領航員' || c.name === '導師')) {
          advice.push('作為領導者，要善用你的影響力，帶領團隊前進');
        }
      } else if (metrics.energyAvg < 5) {
        advice.push('需要調整工作節奏，給自己充分的休息和恢復時間');
        advice.push('考慮與上司或同事溝通，尋求工作負擔的平衡');
        if (cards.some(c => c.name === '小雪' || c.name === '立冬')) {
          advice.push('現在是休息和積蓄能量的好時機，不要急於行動');
        }
      }
      
      // 基於方向的建議
      if (metrics.directionSum >= 2) {
        advice.push('運勢正在上升，要把握機會，但也要保持謙遜和理性');
      } else if (metrics.directionSum < 0) {
        advice.push('面對工作挑戰時，保持冷靜和理性，尋求同事或導師的建議和支持');
        if (cards.some(c => c.intensity === 'extreme' && c.direction < 0)) {
          advice.push('面對重大挑戰時，不要孤軍奮戰，尋求團隊支持很重要');
        }
      }
      
      // 基於特定卡牌的建議
      cards.forEach(card => {
        if (card.name === '十字路口') {
          advice.push('你正站在關鍵的抉擇點，需要相信自己的直覺，但也要收集足夠資訊');
        } else if (card.name === '競爭者') {
          advice.push('在競爭環境中，要專注於提升自己的能力，而不是與他人比較');
        } else if (card.name === '閃電' || card.name === '地震') {
          advice.push('面對突如其來的變化，保護核心價值和目標比什麼都重要');
        } else if (card.name === '奇蹟') {
          advice.push('當機會出現時，要思考它帶來的意義，而不只是慶幸，要做好準備');
        } else if (card.name === '陷阱') {
          advice.push('要仔細評估工作決策，避免掉入陷阱，多聽取不同角度的意見');
        }
      });
      
      // 基於時間性的建議
      const temporalAvg = metrics.temporalAvg;
      if (temporalAvg <= 1.5) {
        advice.push('短期內會有明顯變化，需要密切關注局勢發展');
      } else if (temporalAvg >= 2.5) {
        advice.push('這是一個長期的趨勢，需要持續關注和規劃，不要急於求成');
      }
      
      // 基於組合模式的建議
      if (combination.patterns.includes('危機四伏')) {
        advice.push('在危機中，保持冷靜和理性，制定應對計劃，準備好應對最壞情況');
      } else if (combination.patterns.includes('重生契機')) {
        advice.push('這是重新開始的好時機，放下過去的包袱，勇敢迎接新的挑戰');
      }
      
      // 確保至少有3條建議
      if (advice.length < 3) {
        advice.push('保持當前的工作節奏，持續累積經驗和技能');
        advice.push('關注長期發展，不要急於求成，穩健前進更重要');
        advice.push('與同事和上司保持良好的溝通，建立信任關係');
      }
      
      return advice.slice(0, 5); // 最多5條建議
    },
    closing: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '在工作上，保持專注和耐心，相信你的努力會帶來豐碩的回報。',
          '職場之路雖然充滿挑戰，但你有足夠的能力和資源來應對。',
          '把握當前的機會，展現你的才華，未來會更加光明。'
        ],
        good: [
          '在工作上，保持專注和耐心，相信你的努力會帶來回報。',
          '持續努力，穩健前進，你的職場發展會越來越好。',
          '保持當前的節奏，累積經驗，機會會在不經意間出現。'
        ],
        neutral: [
          '在工作上，保持耐心和觀察，等待合適的時機再行動。',
          '當前的平穩是暫時的，保持準備，機會來臨時要把握。',
          '不要急於求成，穩健發展，時間會證明你的價值。'
        ],
        challenging: [
          '在工作上，面對挑戰時要保持冷靜，尋求支持和幫助。',
          '困難是暫時的，調整策略，重新出發，你會找到出路。',
          '保持韌性和耐心，相信你的能力，困難終會過去。'
        ],
        critical: [
          '在工作上，這是最需要堅持的時刻，相信你的努力會帶來轉機。',
          '從低谷中學習，從困境中成長，這將是你職場生涯的重要轉折。',
          '保持希望和勇氣，最困難的時刻往往也是轉機的開始。'
        ]
      };
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    }
  },
  
  // 通用模板生成器（用於未完整實現的情境）
  _default: {
    opening: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [`在${situation.name}方面，你正處於一個能量充沛的階段。`],
        good: [`在${situation.name}方面，整體趨勢是穩步上升的。`],
        neutral: [`在${situation.name}方面，你正處於一個轉換期，需要仔細觀察。`],
        challenging: [`在${situation.name}方面，你現在面臨一些困難，需要謹慎應對。`],
        critical: [`在${situation.name}方面，你正處於一個極具挑戰的階段。`]
      };
      return templates[metrics.overallState][0];
    },
    analysis: (cards, metrics, combination, situation) => {
      const parts: string[] = [];
      cards.forEach((card, index) => {
        parts.push(generateCardAnalysis(card, index, situation.name));
      });
      if (metrics.directionSum >= 2) {
        parts.push('整體而言，運勢正在強勁上升，適合積極行動。');
      } else if (metrics.directionSum >= 1) {
        parts.push('整體而言，運勢正在穩步上升，保持當前節奏即可。');
      } else if (metrics.directionSum === 0) {
        parts.push('整體而言，運勢處於平衡狀態，需要耐心等待時機。');
      } else {
        parts.push('整體而言，運勢面臨一些挑戰，需要調整策略。');
      }
      return parts.join(' ');
    },
    advice: (cards, metrics, combination, situation) => {
      const advice: string[] = [];
      if (metrics.energyAvg >= 7) {
        advice.push('把握當前的機會，積極行動');
      } else if (metrics.energyAvg < 5) {
        advice.push('需要調整節奏，給自己充分的休息時間');
      }
      if (metrics.directionSum >= 1) {
        advice.push('運勢正在上升，保持當前節奏');
      } else if (metrics.directionSum < 0) {
        advice.push('面對挑戰時，保持冷靜和理性');
      }
      advice.push('保持耐心和專注', '尋求專業建議');
      return advice.slice(0, 5);
    },
    closing: (cards, metrics, situation) => {
      return `在${situation.name}方面，相信你的努力會帶來改變。`;
    }
  },
  
  love: {
    opening: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '在感情關係方面，你正處於一個能量充沛的階段。',
          '從卡牌來看，你的感情狀態非常積極，充滿可能性。',
          '在感情領域，你現在擁有的條件足以支撐關係走向更深的層次。',
          '當前的感情能量流動非常順暢，這是深化關係的好時機。',
          '感情方面，你正站在一個有利的起點上，機會就在眼前。'
        ],
        good: [
          '在感情關係方面，整體趨勢是穩步上升的。',
          '從卡牌來看，你的感情狀態雖然不是完美，但已經足夠支撐你的目標。',
          '在感情領域，雖然有些挑戰，但你有足夠的資源應對。',
          '當前的感情狀態正在改善，現在是行動的好時機。',
          '感情方面，你正處於一個上升的軌道上，持續努力會有回報。'
        ],
        neutral: [
          '在感情關係方面，你正處於一個轉換期，需要仔細觀察。',
          '從卡牌來看，你的感情狀態相對平穩，但也暗藏變化。',
          '在感情領域，這是一個需要耐心等待的階段。',
          '當前的感情能量流動平穩，但需要留意細微的變化。',
          '感情方面，你正處在一個過渡的時期，需要保持平衡。'
        ],
        challenging: [
          '在感情關係方面，你現在面臨一些困難，需要謹慎應對。',
          '從卡牌來看，你的感情狀態需要調整策略。',
          '在感情領域，當前的環境對你不太友善，需要重新規劃。',
          '當前的感情能量流動受阻，這是一個考驗你韌性的時刻。',
          '感情方面，你正處在一個需要調整的階段，保持冷靜很重要。'
        ],
        critical: [
          '在感情關係方面，你正處於一個極具挑戰的階段。',
          '從卡牌來看，你正面臨一個重大的感情考驗。',
          '在感情領域，當前的困境雖然嚴峻，但也可能是轉機的開始。',
          '當前的感情能量流動非常低弱，但這也意味著轉機即將到來。',
          '感情方面，這是最需要堅持的時刻，相信你的努力會帶來改變。'
        ]
      };
      
      const humanCards = cards.filter(c => c.category === '人');
      if (humanCards.length > 0 && (humanCards[0].name === '相遇' || humanCards[0].name === '重逢')) {
        return '在感情關係方面，一個特別的人正在進入或重新進入你的生命，這是一個重要的時刻。';
      }
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    },
    analysis: (cards, metrics, combination, situation) => {
      const parts: string[] = [];
      const humanCards = cards.filter(c => c.category === '人');
      
      // 第一張卡牌分析
      const firstCard = cards[0];
      if (firstCard.category === '人') {
        parts.push(`在感情關係中，你正處於「${firstCard.name}」的位置，${firstCard.infoB ? firstCard.infoB.replace(/「|」/g, '') : '這需要你仔細思考自己在關係中的角色'}。`);
      } else if (firstCard.category === '天') {
        const energyLevel = firstCard.energy >= 7 ? '非常充沛' : firstCard.energy >= 5 ? '相對穩定' : '較為低弱';
        parts.push(`「${firstCard.name}」顯示你的感情能量${energyLevel}，${firstCard.infoA || '這將影響關係的發展'}。`);
      } else if (firstCard.category === '地') {
        parts.push(`在「${firstCard.name}」的感情環境中，你面臨${firstCard.direction > 0 ? '有利' : firstCard.direction < 0 ? '充滿挑戰' : '中性'}的條件。`);
      } else if (firstCard.category === '變數') {
        if (firstCard.name === '相遇' || firstCard.name === '重逢') {
          parts.push(`「${firstCard.name}」這個變數將${firstCard.name === '相遇' ? '帶來新的緣分' : '重新連接過去的緣分'}，這是一個重要的時刻。`);
        } else {
          parts.push(`「${firstCard.name}」這個變數會${firstCard.direction > 0 ? '為你的感情帶來正面影響' : firstCard.direction < 0 ? '帶來挑戰' : '保持現狀'}。`);
        }
      }
      
      // 第二張卡牌分析
      if (cards.length > 1) {
        const secondCard = cards[1];
        if (secondCard.category === '人') {
          parts.push(`在關係動態中，「${secondCard.name}」這個角色${secondCard.direction > 0 ? '為關係帶來和諧' : secondCard.direction < 0 ? '需要調整互動方式' : '需要維持平衡'}。`);
        } else {
          parts.push(`「${secondCard.name}」${secondCard.impact >= 7 ? '對關係有重大影響' : '對關係有中等影響'}，${secondCard.temporal <= 1 ? '短期內' : secondCard.temporal >= 3 ? '長期內' : '中期內'}會${secondCard.direction > 0 ? '帶來機會' : secondCard.direction < 0 ? '帶來考驗' : '保持現狀'}。`);
        }
      }
      
      // 第三張卡牌分析
      if (cards.length > 2) {
        const thirdCard = cards[2];
        parts.push(`最後，「${thirdCard.name}」${thirdCard.intensity === 'extreme' ? '將帶來重大影響' : '會帶來一定影響'}，${thirdCard.infoB ? thirdCard.infoB.replace(/「|」/g, '') : '需要你仔細思考'}。`);
      }
      
      // 組合模式分析
      if (combination.patterns.includes('關係集中')) {
        parts.push('多張人牌出現，顯示關係動態非常活躍，需要仔細處理人際互動。');
      } else if (combination.patterns.includes('轉折點')) {
        parts.push('這是一個關鍵的感情轉折點，你的選擇將決定關係的未來走向。');
      } else if (combination.patterns.includes('危機四伏')) {
        parts.push('關係面臨多重挑戰，但危機中也藏著轉機，需要保持冷靜和溝通。');
      }
      
      // 整體趨勢
      if (metrics.directionSum >= 2) {
        parts.push('整體而言，你的感情運勢正在強勁上升，適合積極行動和深化關係。');
      } else if (metrics.directionSum >= 1) {
        parts.push('整體而言，你的感情運勢正在穩步上升，保持當前節奏和溝通即可。');
      } else if (metrics.directionSum === 0) {
        parts.push('整體而言，你的感情運勢處於平衡狀態，需要耐心等待和觀察。');
      } else {
        parts.push('整體而言，你的感情運勢面臨一些挑戰，需要調整策略和加強溝通。');
      }
      
      return parts.join(' ');
    },
    advice: (cards, metrics, combination, situation) => {
      const advice: string[] = [];
      const humanCards = cards.filter(c => c.category === '人');
      
      // 基於能量等級的建議
      if (metrics.energyAvg >= 7) {
        advice.push('把握當前的感情機會，積極展現你的真誠和關愛');
        if (humanCards.some(c => c.name === '相遇' || c.name === '重逢')) {
          advice.push('這是一個重要的相遇時刻，要珍惜並好好把握');
        }
      } else if (metrics.energyAvg < 5) {
        advice.push('需要調整感情節奏，給彼此充分的空間和時間');
        if (cards.some(c => c.name === '小雪' || c.name === '立冬')) {
          advice.push('現在是休息和積蓄感情能量的好時機，不要急於行動');
        }
      }
      
      // 基於方向的建議
      if (metrics.directionSum >= 2) {
        advice.push('感情運勢正在上升，要把握機會，但也要保持真誠和尊重');
      } else if (metrics.directionSum < 0) {
        advice.push('面對感情挑戰時，保持冷靜和同理心，嘗試站在對方的角度思考');
        if (cards.some(c => c.name === '衝突' || c.name === '背叛者')) {
          advice.push('面對衝突時，不要逃避，主動溝通表達你的感受');
        }
      }
      
      // 基於特定卡牌的建議
      cards.forEach(card => {
        if (card.name === '相遇') {
          advice.push('新的緣分正在出現，保持開放的心態，但也要保持理性');
        } else if (card.name === '重逢') {
          advice.push('過去的緣分重新出現，要思考這是否真的是你想要的');
        } else if (card.name === '調停者') {
          advice.push('作為調停者，要平衡各方需求，但也不要忽略自己的感受');
        } else if (card.name === '距離' || card.name === '陌生人') {
          advice.push('如果感到距離，主動溝通表達你的感受，給彼此一些空間但不要完全疏遠');
        } else if (card.name === '奇蹟') {
          advice.push('當奇蹟出現時，要思考它帶來的意義，而不只是慶幸');
        }
      });
      
      // 基於時間性的建議
      if (metrics.temporalAvg <= 1.5) {
        advice.push('短期內會有明顯的感情變化，需要密切關注關係發展');
      } else if (metrics.temporalAvg >= 2.5) {
        advice.push('這是一個長期的感情趨勢，需要持續關注和經營，不要急於求成');
      }
      
      // 確保至少有3條建議
      if (advice.length < 3) {
        advice.push('關係需要時間和耐心來發展，保持開放的心態');
        advice.push('在感情中，真誠和溝通是維繫關係的關鍵');
        advice.push('珍惜當下的關係，繼續深化彼此的了解');
      }
      
      return advice.slice(0, 5);
    },
    closing: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '在感情中，真誠和溝通是維繫關係的關鍵，相信你的努力會帶來豐碩的回報。',
          '感情之路雖然充滿挑戰，但你有足夠的愛和智慧來應對。',
          '把握當前的機會，展現你的真誠，未來會更加美好。'
        ],
        good: [
          '在感情中，真誠和溝通是維繫關係的關鍵，相信你的努力會帶來回報。',
          '持續努力，穩健經營，你的感情關係會越來越好。',
          '保持當前的節奏，累積感情經驗，機會會在不經意間出現。'
        ],
        neutral: [
          '在感情中，保持耐心和觀察，等待合適的時機再行動。',
          '當前的平穩是暫時的，保持準備，機會來臨時要把握。',
          '不要急於求成，穩健發展，時間會證明你的價值。'
        ],
        challenging: [
          '在感情中，面對挑戰時要保持冷靜，尋求支持和幫助。',
          '困難是暫時的，調整策略，重新出發，你會找到出路。',
          '保持韌性和耐心，相信你的能力，困難終會過去。'
        ],
        critical: [
          '在感情中，這是最需要堅持的時刻，相信你的努力會帶來轉機。',
          '從低谷中學習，從困境中成長，這將是你感情生涯的重要轉折。',
          '保持希望和勇氣，最困難的時刻往往也是轉機的開始。'
        ]
      };
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    }
  },
  
  health: {
    opening: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '在健康狀態方面，你的身體能量充沛，健康狀態良好。',
          '從卡牌來看，你的健康狀態非常積極，充滿活力。',
          '在健康領域，你現在擁有的條件足以支撐你保持良好的身體狀態。',
          '當前的健康能量流動非常順暢，這是維持健康的好時機。',
          '健康方面，你正處於一個有利的狀態，保持當前習慣即可。'
        ],
        good: [
          '在健康狀態方面，整體趨勢是穩步改善的。',
          '從卡牌來看，你的健康狀態雖然不是完美，但已經足夠支撐你的日常活動。',
          '在健康領域，雖然有些挑戰，但你有足夠的資源應對。',
          '當前的健康狀態正在改善，現在是建立健康習慣的好時機。',
          '健康方面，你正處於一個上升的軌道上，持續努力會有回報。'
        ],
        neutral: [
          '在健康狀態方面，你正處於一個轉換期，需要仔細觀察。',
          '從卡牌來看，你的健康狀態相對平穩，但也暗藏變化。',
          '在健康領域，這是一個需要耐心等待的階段。',
          '當前的健康能量流動平穩，但需要留意細微的變化。',
          '健康方面，你正處在一個過渡的時期，需要保持平衡。'
        ],
        challenging: [
          '在健康狀態方面，你現在面臨一些困難，需要謹慎應對。',
          '從卡牌來看，你的健康狀態需要調整策略。',
          '在健康領域，當前的環境對你不太友善，需要重新規劃。',
          '當前的健康能量流動受阻，這是一個需要關注的時刻。',
          '健康方面，你正處在一個需要調整的階段，保持冷靜很重要。'
        ],
        critical: [
          '在健康狀態方面，你正處於一個極具挑戰的階段。',
          '從卡牌來看，你正面臨一個重大的健康考驗。',
          '在健康領域，當前的困境雖然嚴峻，但也可能是轉機的開始。',
          '當前的健康能量流動非常低弱，但這也意味著轉機即將到來。',
          '健康方面，這是最需要關注的時刻，相信你的努力會帶來改變。'
        ]
      };
      
      if (cards.some(c => c.name === '小雪' || c.name === '立冬')) {
        return '在健康狀態方面，現在是休息和恢復的好時機，給身體充分的時間來恢復能量。';
      }
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    },
    analysis: (cards, metrics, combination, situation) => {
      const parts: string[] = [];
      
      // 第一張卡牌分析
      const firstCard = cards[0];
      if (firstCard.category === '天') {
        const energyLevel = firstCard.energy >= 7 ? '非常充沛' : firstCard.energy >= 5 ? '相對穩定' : '較為低弱';
        parts.push(`「${firstCard.name}」顯示你的身體能量${energyLevel}，${firstCard.infoA || '這將影響你的健康狀態'}。`);
        if (firstCard.energy < 5) {
          parts.push('你的身體需要充分的休息和恢復，不要勉強自己。');
        }
      } else if (firstCard.category === '地') {
        parts.push(`在「${firstCard.name}」的健康環境中，你面臨${firstCard.direction > 0 ? '有利' : firstCard.direction < 0 ? '充滿挑戰' : '中性'}的條件。`);
      } else if (firstCard.category === '變數') {
        if (firstCard.name === '閃電' || firstCard.name === '地震') {
          parts.push(`「${firstCard.name}」這個變數將帶來重大健康影響，需要特別注意身體狀況。`);
        } else {
          parts.push(`「${firstCard.name}」這個變數會${firstCard.direction > 0 ? '為你的健康帶來正面影響' : firstCard.direction < 0 ? '帶來挑戰' : '保持現狀'}。`);
        }
      }
      
      // 第二張和第三張卡牌分析
      if (cards.length > 1) {
        cards.slice(1).forEach((card, index) => {
          if (card.category === '天' && card.energy < 5) {
            parts.push(`「${card.name}」提醒你需要關注能量恢復，${card.temporal <= 1 ? '短期內' : '長期內'}需要調整生活節奏。`);
          } else if (card.name === '大暑' || card.name === '小暑') {
            parts.push(`「${card.name}」顯示你可能面臨壓力過大的情況，需要減壓和放鬆。`);
          } else {
            parts.push(`「${card.name}」${card.impact >= 7 ? '對健康有重大影響' : '對健康有中等影響'}，${card.temporal <= 1 ? '短期內' : card.temporal >= 3 ? '長期內' : '中期內'}會${card.direction > 0 ? '帶來改善' : card.direction < 0 ? '帶來挑戰' : '保持現狀'}。`);
          }
        });
      }
      
      // 組合模式分析
      if (combination.patterns.includes('能量高峰')) {
        parts.push('你正處於身體能量的高峰，這是建立健康習慣的最佳時機。');
      } else if (combination.patterns.includes('危機四伏')) {
        parts.push('健康面臨多重挑戰，但危機中也藏著轉機，需要保持冷靜和理性。');
      }
      
      // 整體趨勢
      if (metrics.energyAvg >= 7) {
        parts.push('整體而言，你的健康運勢良好，適合維持當前的健康習慣。');
      } else if (metrics.energyAvg < 5) {
        parts.push('整體而言，你的健康運勢需要關注，需要調整生活節奏和休息。');
      } else {
        parts.push('整體而言，你的健康運勢處於平衡狀態，需要持續關注和維護。');
      }
      
      return parts.join(' ');
    },
    advice: (cards, metrics, combination, situation) => {
      const advice: string[] = [];
      
      // 基於能量等級的建議
      if (metrics.energyAvg >= 7) {
        advice.push('保持當前的健康習慣，繼續維持良好的身體狀態');
        advice.push('可以考慮增加運動強度或嘗試新的健康活動');
      } else if (metrics.energyAvg < 5) {
        advice.push('確保充足的睡眠和休息時間，給身體充分的恢復機會');
        advice.push('調整生活節奏，避免過度勞累，學會說不');
        if (cards.some(c => c.name === '小雪' || c.name === '立冬')) {
          advice.push('現在是休息和積蓄健康能量的好時機，不要急於行動');
        }
      }
      
      // 基於特定卡牌的建議
      cards.forEach(card => {
        if (card.name === '大暑' || card.name === '小暑') {
          advice.push('學習減壓技巧，如冥想、運動或深呼吸，緩解壓力');
          advice.push('考慮尋求專業的心理健康支持，不要獨自承受壓力');
        } else if (card.name === '閃電' || card.name === '地震') {
          advice.push('面對突如其來的健康變化，要及時就醫，不要拖延');
        } else if (card.name === '小雪' || card.name === '立冬') {
          advice.push('給自己充分的休息時間，讓身體自然恢復');
        }
      });
      
      // 基於時間性的建議
      if (metrics.temporalAvg <= 1.5) {
        advice.push('短期內會有明顯的健康變化，需要密切關注身體狀況');
      } else if (metrics.temporalAvg >= 2.5) {
        advice.push('這是一個長期的健康趨勢，需要持續關注和規劃，建立長期健康習慣');
      }
      
      // 確保至少有3條建議
      if (advice.length < 3) {
        advice.push('保持規律的作息和健康的飲食習慣');
        advice.push('適度的運動有助於維持身體能量');
        advice.push('定期進行健康檢查，及早發現問題');
      }
      
      return advice.slice(0, 5);
    },
    closing: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '健康是生活的基礎，照顧好自己的身心是最重要的投資，相信你的努力會帶來豐碩的回報。',
          '保持當前的健康習慣，你的身體會越來越強健。',
          '把握當前的健康狀態，繼續維持，未來會更加美好。'
        ],
        good: [
          '健康是生活的基礎，照顧好自己的身心是最重要的投資，相信你的努力會帶來回報。',
          '持續努力，穩健維護，你的健康狀態會越來越好。',
          '保持當前的節奏，累積健康習慣，身體會在不經意間改善。'
        ],
        neutral: [
          '健康是生活的基礎，保持耐心和觀察，等待合適的時機再調整。',
          '當前的平穩是暫時的，保持準備，機會來臨時要把握。',
          '不要急於求成，穩健發展，時間會證明你的努力。'
        ],
        challenging: [
          '健康是生活的基礎，面對挑戰時要保持冷靜，尋求專業幫助。',
          '困難是暫時的，調整策略，重新出發，你會找到出路。',
          '保持韌性和耐心，相信你的能力，困難終會過去。'
        ],
        critical: [
          '健康是生活的基礎，這是最需要關注的時刻，相信你的努力會帶來轉機。',
          '從低谷中學習，從困境中成長，這將是你健康的重要轉折。',
          '保持希望和勇氣，最困難的時刻往往也是轉機的開始。'
        ]
      };
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    }
  },
  
  growth: {
    opening: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '在個人成長方面，你正處於一個能量充沛的成長階段。',
          '從卡牌來看，你的成長狀態非常積極，充滿可能性。',
          '在成長領域，你現在擁有的條件足以支撐你走向更高的層次。',
          '當前的成長能量流動非常順暢，這是學習和突破的好時機。',
          '成長方面，你正站在一個有利的起點上，機會就在眼前。'
        ],
        good: [
          '在個人成長方面，整體趨勢是穩步上升的。',
          '從卡牌來看，你的成長狀態雖然不是完美，但已經足夠支撐你的目標。',
          '在成長領域，雖然有些挑戰，但你有足夠的資源應對。',
          '當前的成長狀態正在改善，現在是行動的好時機。',
          '成長方面，你正處於一個上升的軌道上，持續努力會有回報。'
        ],
        neutral: [
          '在個人成長方面，你正處於一個轉換期，需要仔細觀察。',
          '從卡牌來看，你的成長狀態相對平穩，但也暗藏變化。',
          '在成長領域，這是一個需要耐心等待的階段。',
          '當前的成長能量流動平穩，但需要留意細微的變化。',
          '成長方面，你正處在一個過渡的時期，需要保持平衡。'
        ],
        challenging: [
          '在個人成長方面，你現在面臨一些困難，需要謹慎應對。',
          '從卡牌來看，你的成長狀態需要調整策略。',
          '在成長領域，當前的環境對你不太友善，需要重新規劃。',
          '當前的成長能量流動受阻，這是一個考驗你韌性的時刻。',
          '成長方面，你正處在一個需要調整的階段，保持冷靜很重要。'
        ],
        critical: [
          '在個人成長方面，你正處於一個極具挑戰的階段。',
          '從卡牌來看，你正面臨一個重大的成長考驗。',
          '在成長領域，當前的困境雖然嚴峻，但也可能是轉機的開始。',
          '當前的成長能量流動非常低弱，但這也意味著轉機即將到來。',
          '成長方面，這是最需要堅持的時刻，相信你的努力會帶來改變。'
        ]
      };
      
      if (cards.some(c => c.name === '立春' || c.name === '驚蟄')) {
        return '在個人成長方面，你正處於成長的啟動階段，新的能量正在湧現。';
      }
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    },
    analysis: (cards, metrics, combination, situation) => {
      const parts: string[] = [];
      
      // 第一張卡牌分析
      const firstCard = cards[0];
      if (firstCard.category === '天') {
        const energyLevel = firstCard.energy >= 7 ? '非常充沛' : firstCard.energy >= 5 ? '相對穩定' : '較為低弱';
        parts.push(`「${firstCard.name}」顯示你的成長能量${energyLevel}，${firstCard.infoA || '這將影響你的成長進程'}。`);
        if (firstCard.name === '立春' || firstCard.name === '驚蟄') {
          parts.push('你正處於成長的啟動階段，新的能量正在湧現，適合開始新的學習計劃。');
        }
      } else if (firstCard.category === '地') {
        parts.push(`在「${firstCard.name}」的成長環境中，你面臨${firstCard.direction > 0 ? '有利' : firstCard.direction < 0 ? '充滿挑戰' : '中性'}的條件。`);
        if (firstCard.name === '十字路口') {
          parts.push('你正站在成長的關鍵抉擇點，需要選擇正確的學習方向。');
        }
      } else if (firstCard.category === '人') {
        if (firstCard.name === '導師' || firstCard.name === '學徒') {
          parts.push(`作為「${firstCard.name}」，${firstCard.name === '導師' ? '你正在傳授經驗，這將深化你的理解' : '你正在學習，這是一個成長的好機會'}。`);
        } else {
          parts.push(`作為「${firstCard.name}」，你在成長中扮演這個角色，${firstCard.infoB ? firstCard.infoB.replace(/「|」/g, '') : '這需要你仔細思考'}。`);
        }
      } else if (firstCard.category === '變數') {
        if (firstCard.name === '火花' || firstCard.name === '奇蹟') {
          parts.push(`「${firstCard.name}」這個變數將帶來重要的成長機會，${firstCard.direction > 0 ? '這是一個突破的時刻' : '需要你把握機會'}。`);
        } else {
          parts.push(`「${firstCard.name}」這個變數會${firstCard.direction > 0 ? '為你的成長帶來正面影響' : firstCard.direction < 0 ? '帶來挑戰' : '保持現狀'}。`);
        }
      }
      
      // 第二張和第三張卡牌分析
      if (cards.length > 1) {
        cards.slice(1).forEach((card, index) => {
          if (card.category === '天' && (card.name === '立春' || card.name === '驚蟄' || card.name === '立夏')) {
            parts.push(`「${card.name}」顯示成長能量正在${card.name === '立夏' ? '快速擴張' : '啟動'}，${card.temporal <= 1 ? '短期內' : '長期內'}會有明顯進展。`);
          } else if (card.category === '人' && card.name === '導師') {
            parts.push(`「${card.name}」提醒你尋求導師或同儕的支持，這將加速你的成長。`);
          } else if (card.name === '突破' || card.name === '轉折') {
            parts.push(`「${card.name}」顯示你即將迎來成長的突破，需要勇敢面對挑戰。`);
          } else {
            parts.push(`「${card.name}」${card.impact >= 7 ? '對成長有重大影響' : '對成長有中等影響'}，${card.temporal <= 1 ? '短期內' : card.temporal >= 3 ? '長期內' : '中期內'}會${card.direction > 0 ? '帶來機會' : card.direction < 0 ? '帶來考驗' : '保持現狀'}。`);
          }
        });
      }
      
      // 組合模式分析
      if (combination.patterns.includes('能量高峰')) {
        parts.push('你正處於成長能量的高峰，這是學習和突破的最佳時機。');
      } else if (combination.patterns.includes('轉折點')) {
        parts.push('這是一個關鍵的成長轉折點，你的選擇將決定未來的發展方向。');
      } else if (combination.patterns.includes('重生契機')) {
        parts.push('從低谷中看到重生的曙光，這是一個重新開始成長的完美時機。');
      }
      
      // 整體趨勢
      if (metrics.directionSum >= 2) {
        parts.push('整體而言，你的成長運勢正在強勁上升，適合積極學習和實踐。');
      } else if (metrics.directionSum >= 1) {
        parts.push('整體而言，你的成長運勢正在穩步上升，保持當前學習節奏即可。');
      } else if (metrics.directionSum === 0) {
        parts.push('整體而言，你的成長運勢處於平衡狀態，需要耐心等待和持續學習。');
      } else {
        parts.push('整體而言，你的成長運勢面臨一些挑戰，需要調整學習策略和方向。');
      }
      
      return parts.join(' ');
    },
    advice: (cards, metrics, combination, situation) => {
      const advice: string[] = [];
      
      // 基於能量等級的建議
      if (metrics.energyAvg >= 7) {
        advice.push('把握當前的成長機會，積極學習和實踐新技能');
        if (cards.some(c => c.name === '立春' || c.name === '驚蟄')) {
          advice.push('這是一個成長的啟動時機，開始行動，設定明確的學習目標');
        }
      } else if (metrics.energyAvg < 5) {
        advice.push('需要調整學習節奏，給自己充分的休息和消化時間');
        if (cards.some(c => c.name === '小雪' || c.name === '立冬')) {
          advice.push('現在是休息和積蓄成長能量的好時機，不要急於行動');
        }
      }
      
      // 基於方向的建議
      if (metrics.directionSum >= 2) {
        advice.push('成長運勢正在上升，要把握機會，但也要保持謙遜和持續學習');
      } else if (metrics.directionSum < 0) {
        advice.push('面對成長挑戰時，保持冷靜和理性，尋求導師或同儕的支持');
        if (cards.some(c => c.intensity === 'extreme' && c.direction < 0)) {
          advice.push('面對重大挑戰時，不要孤軍奮戰，尋求支持很重要');
        }
      }
      
      // 基於特定卡牌的建議
      cards.forEach(card => {
        if (card.name === '立春' || card.name === '驚蟄') {
          advice.push('把握成長的啟動時機，開始行動，設定明確的學習目標和計劃');
        } else if (card.name === '導師') {
          advice.push('尋求導師或同儕的支持和指導，這將加速你的成長');
        } else if (card.name === '學徒') {
          advice.push('保持謙遜的學習態度，容許自己犯錯，從錯誤中學習');
        } else if (card.name === '十字路口') {
          advice.push('你正站在成長的關鍵抉擇點，需要選擇正確的學習方向');
        } else if (card.name === '火花') {
          advice.push('把握靈感湧現的時機，積極探索新的學習領域');
        } else if (card.name === '奇蹟') {
          advice.push('當成長機會出現時，要思考它帶來的意義，做好充分準備');
        }
      });
      
      // 基於時間性的建議
      if (metrics.temporalAvg <= 1.5) {
        advice.push('短期內會有明顯的成長變化，需要密切關注學習進展');
      } else if (metrics.temporalAvg >= 2.5) {
        advice.push('這是一個長期的成長趨勢，需要持續關注和規劃，不要急於求成');
      }
      
      // 確保至少有3條建議
      if (advice.length < 3) {
        advice.push('持續學習和實踐，累積成長經驗');
        advice.push('保持耐心，成長是一個漸進的過程');
        advice.push('設定明確的學習目標，定期檢視成長進度');
      }
      
      return advice.slice(0, 5);
    },
    closing: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '成長是一生的旅程，每一步都值得珍惜，相信你的努力會帶來豐碩的回報。',
          '保持當前的成長節奏，你的能力會越來越強。',
          '把握當前的機會，展現你的學習能力，未來會更加光明。'
        ],
        good: [
          '成長是一生的旅程，每一步都值得珍惜，相信你的努力會帶來回報。',
          '持續努力，穩健學習，你的成長會越來越好。',
          '保持當前的節奏，累積成長經驗，機會會在不經意間出現。'
        ],
        neutral: [
          '成長是一生的旅程，保持耐心和觀察，等待合適的時機再行動。',
          '當前的平穩是暫時的，保持準備，機會來臨時要把握。',
          '不要急於求成，穩健發展，時間會證明你的努力。'
        ],
        challenging: [
          '成長是一生的旅程，面對挑戰時要保持冷靜，尋求支持和幫助。',
          '困難是暫時的，調整策略，重新出發，你會找到出路。',
          '保持韌性和耐心，相信你的能力，困難終會過去。'
        ],
        critical: [
          '成長是一生的旅程，這是最需要堅持的時刻，相信你的努力會帶來轉機。',
          '從低谷中學習，從困境中成長，這將是你成長的重要轉折。',
          '保持希望和勇氣，最困難的時刻往往也是轉機的開始。'
        ]
      };
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    }
  },
  
  finance: {
    opening: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '在財務狀況方面，你正處於一個資源充沛的階段。',
          '從卡牌來看，你的財務狀態非常積極，充滿可能性。',
          '在財務領域，你現在擁有的條件足以支撐你進行更好的財務規劃。',
          '當前的財務能量流動非常順暢，這是理財和投資的好時機。',
          '財務方面，你正站在一個有利的起點上，機會就在眼前。'
        ],
        good: [
          '在財務狀況方面，整體趨勢是穩步上升的。',
          '從卡牌來看，你的財務狀態雖然不是完美，但已經足夠支撐你的目標。',
          '在財務領域，雖然有些挑戰，但你有足夠的資源應對。',
          '當前的財務狀態正在改善，現在是規劃的好時機。',
          '財務方面，你正處於一個上升的軌道上，持續努力會有回報。'
        ],
        neutral: [
          '在財務狀況方面，你正處於一個轉換期，需要仔細觀察。',
          '從卡牌來看，你的財務狀態相對平穩，但也暗藏變化。',
          '在財務領域，這是一個需要耐心等待的階段。',
          '當前的財務能量流動平穩，但需要留意細微的變化。',
          '財務方面，你正處在一個過渡的時期，需要保持平衡。'
        ],
        challenging: [
          '在財務狀況方面，你現在面臨一些困難，需要謹慎應對。',
          '從卡牌來看，你的財務狀態需要調整策略。',
          '在財務領域，當前的環境對你不太友善，需要重新規劃。',
          '當前的財務能量流動受阻，這是一個需要謹慎的時刻。',
          '財務方面，你正處在一個需要調整的階段，保持冷靜很重要。'
        ],
        critical: [
          '在財務狀況方面，你正處於一個極具挑戰的階段。',
          '從卡牌來看，你正面臨一個重大的財務考驗。',
          '在財務領域，當前的困境雖然嚴峻，但也可能是轉機的開始。',
          '當前的財務能量流動非常低弱，但這也意味著轉機即將到來。',
          '財務方面，這是最需要謹慎的時刻，相信你的努力會帶來改變。'
        ]
      };
      
      if (cards.some(c => c.name === '禮物' || c.name === '雨水')) {
        return '在財務狀況方面，財務資源正在累積，這是一個理財的好時機。';
      }
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    },
    analysis: (cards, metrics, combination, situation) => {
      const parts: string[] = [];
      
      // 第一張卡牌分析
      const firstCard = cards[0];
      if (firstCard.category === '地') {
        parts.push(`在「${firstCard.name}」的財務環境中，你面臨${firstCard.direction > 0 ? '有利' : firstCard.direction < 0 ? '充滿挑戰' : '中性'}的條件。`);
        if (firstCard.name === '平原') {
          parts.push('財務機會多但競爭也多，需要仔細選擇和規劃。');
        } else if (firstCard.name === '十字路口') {
          parts.push('你正站在財務的關鍵抉擇點，需要選擇正確的理財方向。');
        }
      } else if (firstCard.category === '變數') {
        if (firstCard.name === '禮物' || firstCard.name === '雨水') {
          parts.push(`「${firstCard.name}」這個變數將帶來財務資源，${firstCard.direction > 0 ? '這是一個累積財富的機會' : '需要謹慎管理'}。`);
        } else if (firstCard.name === '陷阱' || firstCard.name === '閃電') {
          parts.push(`「${firstCard.name}」這個變數將帶來財務風險，需要特別注意和謹慎應對。`);
        } else {
          parts.push(`「${firstCard.name}」這個變數會${firstCard.direction > 0 ? '為你的財務帶來正面影響' : firstCard.direction < 0 ? '帶來挑戰' : '保持現狀'}。`);
        }
      } else if (firstCard.category === '天') {
        const energyLevel = firstCard.energy >= 7 ? '非常充沛' : firstCard.energy >= 5 ? '相對穩定' : '較為低弱';
        parts.push(`「${firstCard.name}」顯示你的財務能量${energyLevel}，${firstCard.infoA || '這將影響你的財務狀況'}。`);
      } else if (firstCard.category === '人') {
        if (firstCard.name === '守門人' || firstCard.name === '導師') {
          parts.push(`作為「${firstCard.name}」，你在財務中扮演這個角色，${firstCard.infoB ? firstCard.infoB.replace(/「|」/g, '') : '需要仔細思考財務決策'}。`);
        }
      }
      
      // 第二張和第三張卡牌分析
      if (cards.length > 1) {
        cards.slice(1).forEach((card, index) => {
          if (card.name === '禮物' || card.name === '雨水') {
            parts.push(`「${card.name}」顯示財務資源正在${card.name === '禮物' ? '降臨' : '累積'}，${card.temporal <= 1 ? '短期內' : '長期內'}會有明顯改善。`);
          } else if (card.name === '陷阱' || card.name === '閃電') {
            parts.push(`「${card.name}」提醒你注意財務風險，${card.impact >= 7 ? '影響重大' : '影響中等'}，需要謹慎應對。`);
          } else if (card.name === '十字路口') {
            parts.push(`「${card.name}」顯示你正站在財務的關鍵抉擇點，需要仔細評估各種選項。`);
          } else {
            parts.push(`「${card.name}」${card.impact >= 7 ? '對財務有重大影響' : '對財務有中等影響'}，${card.temporal <= 1 ? '短期內' : card.temporal >= 3 ? '長期內' : '中期內'}會${card.direction > 0 ? '帶來機會' : card.direction < 0 ? '帶來挑戰' : '保持現狀'}。`);
          }
        });
      }
      
      // 組合模式分析
      if (combination.patterns.includes('變數集中') && cards.some(c => c.name === '陷阱' || c.name === '閃電')) {
        parts.push('多個財務風險變數同時出現，需要特別謹慎，避免衝動決策。');
      } else if (combination.patterns.includes('轉折點')) {
        parts.push('這是一個關鍵的財務轉折點，你的選擇將決定未來的財務狀況。');
      }
      
      // 整體趨勢
      if (metrics.directionSum >= 2) {
        parts.push('整體而言，你的財務運勢正在強勁上升，適合進行理性的財務規劃。');
      } else if (metrics.directionSum >= 1) {
        parts.push('整體而言，你的財務運勢正在穩步上升，保持當前理財策略即可。');
      } else if (metrics.directionSum === 0) {
        parts.push('整體而言，你的財務運勢處於平衡狀態，需要理性規劃和管理。');
      } else {
        parts.push('整體而言，你的財務運勢面臨一些挑戰，需要調整理財策略和風險管理。');
      }
      
      return parts.join(' ');
    },
    advice: (cards, metrics, combination, situation) => {
      const advice: string[] = [];
      
      // 基於能量等級的建議
      if (metrics.energyAvg >= 7) {
        advice.push('把握當前的財務機會，進行理性的財務規劃和投資');
        if (cards.some(c => c.name === '禮物' || c.name === '雨水')) {
          advice.push('財務資源正在累積，要善用這些資源，做好長期規劃');
        }
      } else if (metrics.energyAvg < 5) {
        advice.push('需要調整財務節奏，避免過度投資或冒險');
        advice.push('建立緊急預備金，應對突發財務狀況');
      }
      
      // 基於方向的建議
      if (metrics.directionSum >= 2) {
        advice.push('財務運勢正在上升，要把握機會，但也要保持理性和謹慎');
      } else if (metrics.directionSum < 0) {
        advice.push('面對財務挑戰時，保持冷靜和理性，避免衝動決策');
        if (cards.some(c => c.name === '陷阱' || c.name === '閃電')) {
          advice.push('面對財務風險時，要仔細評估，尋求專業人士的建議');
        }
      }
      
      // 基於特定卡牌的建議
      cards.forEach(card => {
        if (card.name === '禮物' || card.name === '雨水') {
          advice.push('善用現有資源，進行理性的財務規劃，考慮長期投資但要做好風險評估');
        } else if (card.name === '陷阱' || card.name === '閃電') {
          advice.push('謹慎處理財務決策，避免衝動投資，建立緊急預備金應對突發狀況');
        } else if (card.name === '十字路口') {
          advice.push('你正站在財務的關鍵抉擇點，需要仔細評估各種選項，尋求專業建議');
        } else if (card.name === '奇蹟') {
          advice.push('當財務機會出現時，要思考它帶來的意義，做好充分準備和風險評估');
        }
      });
      
      // 基於時間性的建議
      if (metrics.temporalAvg <= 1.5) {
        advice.push('短期內會有明顯的財務變化，需要密切關注財務狀況');
      } else if (metrics.temporalAvg >= 2.5) {
        advice.push('這是一個長期的財務趨勢，需要持續關注和規劃，建立長期理財策略');
      }
      
      // 確保至少有3條建議
      if (advice.length < 3) {
        advice.push('保持穩健的理財策略，持續累積財富');
        advice.push('定期檢視財務狀況，調整理財計劃');
        advice.push('建立緊急預備金，應對突發財務狀況');
      }
      
      return advice.slice(0, 5);
    },
    closing: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '財務管理需要理性和耐心，穩健的規劃勝過冒險，相信你的努力會帶來豐碩的回報。',
          '保持當前的理財策略，你的財務狀況會越來越好。',
          '把握當前的機會，展現你的理財智慧，未來會更加光明。'
        ],
        good: [
          '財務管理需要理性和耐心，穩健的規劃勝過冒險，相信你的努力會帶來回報。',
          '持續努力，穩健理財，你的財務狀況會越來越好。',
          '保持當前的節奏，累積財務經驗，機會會在不經意間出現。'
        ],
        neutral: [
          '財務管理需要理性和耐心，保持觀察和規劃，等待合適的時機再行動。',
          '當前的平穩是暫時的，保持準備，機會來臨時要把握。',
          '不要急於求成，穩健發展，時間會證明你的努力。'
        ],
        challenging: [
          '財務管理需要理性和耐心，面對挑戰時要保持冷靜，尋求專業幫助。',
          '困難是暫時的，調整策略，重新出發，你會找到出路。',
          '保持韌性和耐心，相信你的能力，困難終會過去。'
        ],
        critical: [
          '財務管理需要理性和耐心，這是最需要謹慎的時刻，相信你的努力會帶來轉機。',
          '從低谷中學習，從困境中成長，這將是你財務的重要轉折。',
          '保持希望和勇氣，最困難的時刻往往也是轉機的開始。'
        ]
      };
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    }
  },
  
  social: {
    opening: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '在人際關係方面，你正處於一個關係和諧的階段。',
          '從卡牌來看，你的人際狀態非常積極，充滿可能性。',
          '在人際領域，你現在擁有的條件足以支撐你建立更深層的連結。',
          '當前的社交能量流動非常順暢，這是建立關係的好時機。',
          '人際方面，你正站在一個有利的起點上，機會就在眼前。'
        ],
        good: [
          '在人際關係方面，整體趨勢是穩步改善的。',
          '從卡牌來看，你的人際狀態雖然不是完美，但已經足夠支撐你的社交目標。',
          '在人際領域，雖然有些挑戰，但你有足夠的資源應對。',
          '當前的社交狀態正在改善，現在是行動的好時機。',
          '人際方面，你正處於一個上升的軌道上，持續努力會有回報。'
        ],
        neutral: [
          '在人際關係方面，你正處於一個轉換期，需要仔細觀察。',
          '從卡牌來看，你的人際狀態相對平穩，但也暗藏變化。',
          '在人際領域，這是一個需要耐心等待的階段。',
          '當前的社交能量流動平穩，但需要留意細微的變化。',
          '人際方面，你正處在一個過渡的時期，需要保持平衡。'
        ],
        challenging: [
          '在人際關係方面，你現在面臨一些困難，需要謹慎應對。',
          '從卡牌來看，你的人際狀態需要調整策略。',
          '在人際領域，當前的環境對你不太友善，需要重新規劃。',
          '當前的社交能量流動受阻，這是一個需要溝通的時刻。',
          '人際方面，你正處在一個需要調整的階段，保持冷靜很重要。'
        ],
        critical: [
          '在人際關係方面，你正處於一個極具挑戰的階段。',
          '從卡牌來看，你正面臨一個重大的人際考驗。',
          '在人際領域，當前的困境雖然嚴峻，但也可能是轉機的開始。',
          '當前的社交能量流動非常低弱，但這也意味著轉機即將到來。',
          '人際方面，這是最需要溝通的時刻，相信你的努力會帶來改變。'
        ]
      };
      
      const humanCards = cards.filter(c => c.category === '人');
      if (humanCards.length > 0 && (humanCards[0].name === '調停者' || humanCards[0].name === '領航員')) {
        return '在人際關係方面，你正在人際中扮演重要的角色，這是一個建立影響力的時刻。';
      }
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    },
    analysis: (cards, metrics, combination, situation) => {
      const parts: string[] = [];
      const humanCards = cards.filter(c => c.category === '人');
      
      // 第一張卡牌分析
      const firstCard = cards[0];
      if (firstCard.category === '人') {
        parts.push(`在人際關係中，你正處於「${firstCard.name}」的位置，${firstCard.infoB ? firstCard.infoB.replace(/「|」/g, '') : '這需要你仔細思考自己在人際中的角色'}。`);
        if (firstCard.name === '調停者') {
          parts.push('作為調停者，你處在衝突的中心，需要平衡各方需求。');
        } else if (firstCard.name === '領航員') {
          parts.push('作為領航員，眾人的目光都在你身上，需要承擔責任。');
        }
      } else if (firstCard.category === '地') {
        parts.push(`在「${firstCard.name}」的社交環境中，你面臨${firstCard.direction > 0 ? '有利' : firstCard.direction < 0 ? '充滿挑戰' : '中性'}的條件。`);
        if (firstCard.name === '劇場') {
          parts.push('在劇場環境中，你需要在眾人面前展現自己，這是建立影響力的機會。');
        } else if (firstCard.name === '後花園') {
          parts.push('在後花園環境中，你有一個私密的社交空間，適合深度交流。');
        }
      } else if (firstCard.category === '變數') {
        if (firstCard.name === '相遇' || firstCard.name === '重逢') {
          parts.push(`「${firstCard.name}」這個變數將帶來${firstCard.name === '相遇' ? '新的緣分' : '重新連接的緣分'}，這是一個重要的社交時刻。`);
        } else if (firstCard.name === '狂風') {
          parts.push(`「${firstCard.name}」這個變數顯示環境變得嘈雜，謠言四起，需要保持冷靜。`);
        } else {
          parts.push(`「${firstCard.name}」這個變數會${firstCard.direction > 0 ? '為你的人際帶來正面影響' : firstCard.direction < 0 ? '帶來挑戰' : '保持現狀'}。`);
        }
      } else if (firstCard.category === '天') {
        const energyLevel = firstCard.energy >= 7 ? '非常充沛' : firstCard.energy >= 5 ? '相對穩定' : '較為低弱';
        parts.push(`「${firstCard.name}」顯示你的社交能量${energyLevel}，${firstCard.infoA || '這將影響你的人際互動'}。`);
      }
      
      // 第二張和第三張卡牌分析
      if (cards.length > 1) {
        cards.slice(1).forEach((card, index) => {
          if (card.category === '人') {
            parts.push(`在關係動態中，「${card.name}」這個角色${card.direction > 0 ? '為關係帶來和諧' : card.direction < 0 ? '需要調整互動方式' : '需要維持平衡'}。`);
            if (card.name === '競爭者') {
              parts.push('競爭者的出現提醒你，人際關係中既有合作也有競爭。');
            } else if (card.name === '陌生人') {
              parts.push('陌生人的出現顯示，你可能與某些人感到距離，需要主動溝通。');
            }
          } else if (card.name === '相遇' || card.name === '重逢') {
            parts.push(`「${card.name}」顯示${card.name === '相遇' ? '新的緣分正在出現' : '過去的緣分重新出現'}，這是一個重要的社交機會。`);
          } else {
            parts.push(`「${card.name}」${card.impact >= 7 ? '對人際有重大影響' : '對人際有中等影響'}，${card.temporal <= 1 ? '短期內' : card.temporal >= 3 ? '長期內' : '中期內'}會${card.direction > 0 ? '帶來機會' : card.direction < 0 ? '帶來挑戰' : '保持現狀'}。`);
          }
        });
      }
      
      // 組合模式分析
      if (combination.patterns.includes('關係集中')) {
        parts.push('多張人牌出現，顯示人際動態非常活躍，需要仔細處理各種關係。');
      } else if (combination.patterns.includes('轉折點')) {
        parts.push('這是一個關鍵的人際轉折點，你的選擇將決定關係的未來走向。');
      } else if (combination.patterns.includes('危機四伏')) {
        parts.push('人際關係面臨多重挑戰，但危機中也藏著轉機，需要保持冷靜和溝通。');
      }
      
      // 整體趨勢
      if (metrics.directionSum >= 2) {
        parts.push('整體而言，你的人際運勢正在強勁上升，適合積極建立和深化關係。');
      } else if (metrics.directionSum >= 1) {
        parts.push('整體而言，你的人際運勢正在穩步上升，保持當前溝通節奏即可。');
      } else if (metrics.directionSum === 0) {
        parts.push('整體而言，你的人際運勢處於平衡狀態，需要持續的溝通和理解。');
      } else {
        parts.push('整體而言，你的人際運勢面臨一些挑戰，需要調整互動策略和加強溝通。');
      }
      
      return parts.join(' ');
    },
    advice: (cards, metrics, combination, situation) => {
      const advice: string[] = [];
      const humanCards = cards.filter(c => c.category === '人');
      
      // 基於能量等級的建議
      if (metrics.energyAvg >= 7) {
        advice.push('把握當前的社交機會，積極建立和深化人際關係');
        if (cards.some(c => c.name === '相遇' || c.name === '重逢')) {
          advice.push('這是一個重要的相遇時刻，要珍惜並好好把握');
        }
      } else if (metrics.energyAvg < 5) {
        advice.push('需要調整社交節奏，給自己充分的空間和時間');
        if (cards.some(c => c.name === '隱士' || c.name === '旁觀者')) {
          advice.push('現在是獨處和思考的好時機，不要勉強自己社交');
        }
      }
      
      // 基於方向的建議
      if (metrics.directionSum >= 2) {
        advice.push('人際運勢正在上升，要把握機會，但也要保持真誠和尊重');
      } else if (metrics.directionSum < 0) {
        advice.push('面對人際挑戰時，保持冷靜和同理心，嘗試站在對方的角度思考');
        if (cards.some(c => c.name === '調停者')) {
          advice.push('作為調停者，要平衡各方需求，但也不要忽略自己的感受');
        }
      }
      
      // 基於特定卡牌的建議
      cards.forEach(card => {
        if (card.name === '調停者') {
          advice.push('作為調停者，要平衡各方需求，但也不要忽略自己的感受');
        } else if (card.name === '領航員') {
          advice.push('作為領航員，要承擔責任，但也需要坦誠面對不確定性');
        } else if (card.name === '競爭者') {
          advice.push('在競爭環境中，要專注於提升自己，而不是與他人比較');
        } else if (card.name === '相遇' || card.name === '重逢') {
          advice.push('新的緣分正在出現，保持開放的心態，但也要保持理性');
        } else if (card.name === '陌生人' || card.name === '距離') {
          advice.push('如果感到距離，主動溝通表達你的感受，給彼此一些空間但不要完全疏遠');
        } else if (card.name === '狂風') {
          advice.push('面對謠言和嘈雜環境時，保持冷靜，不要被外界影響');
        }
      });
      
      // 基於時間性的建議
      if (metrics.temporalAvg <= 1.5) {
        advice.push('短期內會有明顯的人際變化，需要密切關注關係發展');
      } else if (metrics.temporalAvg >= 2.5) {
        advice.push('這是一個長期的人際趨勢，需要持續關注和經營，不要急於求成');
      }
      
      // 確保至少有3條建議
      if (advice.length < 3) {
        advice.push('保持開放的心態，主動建立新的連結');
        advice.push('在人際互動中，真誠和尊重是關鍵');
        advice.push('珍惜現有的人際關係，繼續深化連結');
      }
      
      return advice.slice(0, 5);
    },
    closing: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '良好的人際關係需要時間和用心經營，相信你的努力會帶來豐碩的回報。',
          '保持當前的社交節奏，你的人際關係會越來越和諧。',
          '把握當前的機會，展現你的真誠，未來會更加美好。'
        ],
        good: [
          '良好的人際關係需要時間和用心經營，相信你的努力會帶來回報。',
          '持續努力，穩健經營，你的人際關係會越來越好。',
          '保持當前的節奏，累積社交經驗，機會會在不經意間出現。'
        ],
        neutral: [
          '良好的人際關係需要時間和用心經營，保持耐心和觀察，等待合適的時機。',
          '當前的平穩是暫時的，保持準備，機會來臨時要把握。',
          '不要急於求成，穩健發展，時間會證明你的努力。'
        ],
        challenging: [
          '良好的人際關係需要時間和用心經營，面對挑戰時要保持冷靜，尋求支持。',
          '困難是暫時的，調整策略，重新出發，你會找到出路。',
          '保持韌性和耐心，相信你的能力，困難終會過去。'
        ],
        critical: [
          '良好的人際關係需要時間和用心經營，這是最需要溝通的時刻，相信你的努力會帶來轉機。',
          '從低谷中學習，從困境中成長，這將是你人際關係的重要轉折。',
          '保持希望和勇氣，最困難的時刻往往也是轉機的開始。'
        ]
      };
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    }
  },
  
  creative: {
    opening: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '在創意靈感方面，你正處於一個靈感充沛的階段。',
          '從卡牌來看，你的創意狀態非常積極，充滿可能性。',
          '在創意領域，你現在擁有的條件足以支撐你進行大膽的創作。',
          '當前的創意能量流動非常順暢，這是創作和突破的好時機。',
          '創意方面，你正站在一個有利的起點上，靈感就在眼前。'
        ],
        good: [
          '在創意靈感方面，整體趨勢是穩步上升的。',
          '從卡牌來看，你的創意狀態雖然不是完美，但已經足夠支撐你的創作目標。',
          '在創意領域，雖然有些挑戰，但你有足夠的資源應對。',
          '當前的創意狀態正在改善，現在是行動的好時機。',
          '創意方面，你正處於一個上升的軌道上，持續努力會有回報。'
        ],
        neutral: [
          '在創意靈感方面，你正處於一個轉換期，需要仔細觀察。',
          '從卡牌來看，你的創意狀態相對平穩，但也暗藏變化。',
          '在創意領域，這是一個需要耐心等待的階段。',
          '當前的創意能量流動平穩，但需要留意細微的變化。',
          '創意方面，你正處在一個過渡的時期，需要保持平衡。'
        ],
        challenging: [
          '在創意靈感方面，你現在面臨一些困難，需要謹慎應對。',
          '從卡牌來看，你的創意狀態需要調整策略。',
          '在創意領域，當前的環境對你不太友善，需要重新規劃。',
          '當前的創意能量流動受阻，這是一個需要休息的時刻。',
          '創意方面，你正處在一個需要調整的階段，保持冷靜很重要。'
        ],
        critical: [
          '在創意靈感方面，你正處於一個極具挑戰的階段。',
          '從卡牌來看，你正面臨一個重大的創意考驗。',
          '在創意領域，當前的困境雖然嚴峻，但也可能是轉機的開始。',
          '當前的創意能量流動非常低弱，但這也意味著轉機即將到來。',
          '創意方面，這是最需要堅持的時刻，相信你的努力會帶來改變。'
        ]
      };
      
      if (cards.some(c => c.name === '火花')) {
        return '在創意靈感方面，創意靈感正在湧現，這是一個創作的好時機。';
      }
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    },
    analysis: (cards, metrics, combination, situation) => {
      const parts: string[] = [];
      
      // 第一張卡牌分析
      const firstCard = cards[0];
      if (firstCard.category === '變數' && firstCard.name === '火花') {
        parts.push(`「${firstCard.name}」這個變數將帶來創意靈感，${firstCard.direction > 0 ? '這是一個突破的時刻' : '需要你把握機會'}。`);
        parts.push('創意靈感正在湧現，雖然微弱，但足以點燃整片森林。');
      } else if (firstCard.category === '天') {
        const energyLevel = firstCard.energy >= 7 ? '非常充沛' : firstCard.energy >= 5 ? '相對穩定' : '較為低弱';
        parts.push(`「${firstCard.name}」顯示你的創意能量${energyLevel}，${firstCard.infoA || '這將影響你的創作狀態'}。`);
        if (firstCard.energy >= 7) {
          parts.push('創意能量充沛，適合積極創作和探索新的方向。');
        } else if (firstCard.energy < 5) {
          parts.push('創意能量較弱，需要放鬆和休息來恢復。');
        }
      } else if (firstCard.category === '地') {
        parts.push(`在「${firstCard.name}」的創意環境中，你面臨${firstCard.direction > 0 ? '有利' : firstCard.direction < 0 ? '充滿挑戰' : '中性'}的條件。`);
        if (firstCard.name === '劇場') {
          parts.push('在劇場環境中，你需要在眾人面前展現創意，這是建立影響力的機會。');
        } else if (firstCard.name === '後花園') {
          parts.push('在後花園環境中，你有一個私密的創作空間，適合深度探索。');
        }
      } else if (firstCard.category === '人') {
        if (firstCard.name === '反叛者' || firstCard.name === '流浪者') {
          parts.push(`作為「${firstCard.name}」，你在創意中扮演這個角色，${firstCard.infoB ? firstCard.infoB.replace(/「|」/g, '') : '這需要你打破常規'}。`);
        }
      } else {
        parts.push(`「${firstCard.name}」這個變數會${firstCard.direction > 0 ? '為你的創意帶來正面影響' : firstCard.direction < 0 ? '帶來挑戰' : '保持現狀'}。`);
      }
      
      // 第二張和第三張卡牌分析
      if (cards.length > 1) {
        cards.slice(1).forEach((card, index) => {
          if (card.name === '火花') {
            parts.push(`「${card.name}」顯示創意靈感正在湧現，${card.temporal <= 1 ? '短期內' : '長期內'}會有明顯突破。`);
          } else if (card.name === '乾涸') {
            parts.push(`「${card.name}」提醒你創意資源可能耗盡，需要休息和尋找新的靈感來源。`);
          } else if (card.category === '天' && card.energy >= 7) {
            parts.push(`「${card.name}」顯示創意能量正在${card.name === '立夏' ? '快速擴張' : '累積'}，適合積極創作。`);
          } else {
            parts.push(`「${card.name}」${card.impact >= 7 ? '對創意有重大影響' : '對創意有中等影響'}，${card.temporal <= 1 ? '短期內' : card.temporal >= 3 ? '長期內' : '中期內'}會${card.direction > 0 ? '帶來機會' : card.direction < 0 ? '帶來挑戰' : '保持現狀'}。`);
          }
        });
      }
      
      // 組合模式分析
      if (combination.patterns.includes('能量高峰')) {
        parts.push('你正處於創意能量的高峰，這是創作和突破的最佳時機。');
      } else if (combination.patterns.includes('轉折點')) {
        parts.push('這是一個關鍵的創意轉折點，你的選擇將決定未來的創作方向。');
      } else if (cards.some(c => c.name === '火花') && cards.some(c => c.energy >= 7)) {
        parts.push('靈感與能量同時出現，這是一個創作的完美時刻。');
      }
      
      // 整體趨勢
      if (metrics.directionSum >= 2) {
        parts.push('整體而言，你的創意運勢正在強勁上升，適合積極創作和探索。');
      } else if (metrics.directionSum >= 1) {
        parts.push('整體而言，你的創意運勢正在穩步上升，保持當前創作節奏即可。');
      } else if (metrics.directionSum === 0) {
        parts.push('整體而言，你的創意運勢處於平衡狀態，需要耐心等待和持續探索。');
      } else {
        parts.push('整體而言，你的創意運勢面臨一些挑戰，需要調整創作策略和尋找新的靈感。');
      }
      
      return parts.join(' ');
    },
    advice: (cards, metrics, combination, situation) => {
      const advice: string[] = [];
      
      // 基於能量等級的建議
      if (metrics.energyAvg >= 7) {
        advice.push('把握當前的創意機會，積極創作和探索新的方向');
        if (cards.some(c => c.name === '火花')) {
          advice.push('靈感正在湧現，要把握這個時機，積極創作，不要害怕嘗試新的創意方向');
        }
      } else if (metrics.energyAvg < 5) {
        advice.push('需要調整創作節奏，給自己充分的休息和恢復時間');
        if (cards.some(c => c.name === '乾涸')) {
          advice.push('創意資源可能耗盡，給自己一些休息時間，通過閱讀、旅行或觀察來尋找靈感');
        }
      }
      
      // 基於方向的建議
      if (metrics.directionSum >= 2) {
        advice.push('創意運勢正在上升，要把握機會，但也要保持開放和探索的心態');
      } else if (metrics.directionSum < 0) {
        advice.push('面對創意挑戰時，保持冷靜和理性，不要放棄，繼續探索');
      }
      
      // 基於特定卡牌的建議
      cards.forEach(card => {
        if (card.name === '火花') {
          advice.push('把握靈感湧現的時機，積極創作，不要害怕嘗試新的創意方向');
        } else if (card.name === '乾涸') {
          advice.push('創意資源可能耗盡，給自己一些休息時間，通過閱讀、旅行或觀察來尋找靈感');
        } else if (card.name === '反叛者') {
          advice.push('作為反叛者，要打破常規，挑戰既有的創意框架');
        } else if (card.name === '奇蹟') {
          advice.push('當創意機會出現時，要思考它帶來的意義，做好充分準備');
        } else if (card.name === '劇場') {
          advice.push('在劇場環境中，要勇敢展現你的創意，不要害怕他人的評價');
        }
      });
      
      // 基於時間性的建議
      if (metrics.temporalAvg <= 1.5) {
        advice.push('短期內會有明顯的創意變化，需要密切關注靈感發展');
      } else if (metrics.temporalAvg >= 2.5) {
        advice.push('這是一個長期的創意趨勢，需要持續關注和探索，不要急於求成');
      }
      
      // 確保至少有3條建議
      if (advice.length < 3) {
        advice.push('持續練習和探索，累積創意經驗');
        advice.push('保持對新事物的好奇心');
        advice.push('給創意一些時間和空間來孕育');
      }
      
      return advice.slice(0, 5);
    },
    closing: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '創意需要時間和空間來孕育，保持開放的心態，相信你的努力會帶來豐碩的回報。',
          '保持當前的創作節奏，你的創意會越來越豐富。',
          '把握當前的機會，展現你的創意才華，未來會更加光明。'
        ],
        good: [
          '創意需要時間和空間來孕育，保持開放的心態，相信你的努力會帶來回報。',
          '持續努力，穩健創作，你的創意會越來越好。',
          '保持當前的節奏，累積創意經驗，機會會在不經意間出現。'
        ],
        neutral: [
          '創意需要時間和空間來孕育，保持開放的心態，保持耐心和觀察，等待合適的時機。',
          '當前的平穩是暫時的，保持準備，機會來臨時要把握。',
          '不要急於求成，穩健發展，時間會證明你的努力。'
        ],
        challenging: [
          '創意需要時間和空間來孕育，保持開放的心態，面對挑戰時要保持冷靜，尋求靈感。',
          '困難是暫時的，調整策略，重新出發，你會找到出路。',
          '保持韌性和耐心，相信你的能力，困難終會過去。'
        ],
        critical: [
          '創意需要時間和空間來孕育，保持開放的心態，這是最需要堅持的時刻，相信你的努力會帶來轉機。',
          '從低谷中學習，從困境中成長，這將是你創意的重要轉折。',
          '保持希望和勇氣，最困難的時刻往往也是轉機的開始。'
        ]
      };
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    }
  },
  
  decision: {
    opening: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '在重大決策方面，你正處於一個決策的關鍵時刻。',
          '從卡牌來看，你的決策環境非常有利，充滿可能性。',
          '在決策領域，你現在擁有的條件足以支撐你做出正確的選擇。',
          '當前的決策能量流動非常順暢，這是行動的好時機。',
          '決策方面，你正站在一個有利的起點上，機會就在眼前。'
        ],
        good: [
          '在重大決策方面，整體趨勢是穩步改善的。',
          '從卡牌來看，你的決策環境雖然不是完美，但已經足夠支撐你的目標。',
          '在決策領域，雖然有些挑戰，但你有足夠的資源應對。',
          '當前的決策狀態正在改善，現在是行動的好時機。',
          '決策方面，你正處於一個上升的軌道上，持續努力會有回報。'
        ],
        neutral: [
          '在重大決策方面，你正處於一個轉換期，需要仔細觀察。',
          '從卡牌來看，你的決策環境相對平穩，但也暗藏變化。',
          '在決策領域，這是一個需要耐心等待的階段。',
          '當前的決策能量流動平穩，但需要留意細微的變化。',
          '決策方面，你正處在一個過渡的時期，需要保持平衡。'
        ],
        challenging: [
          '在重大決策方面，你現在面臨一些困難，需要謹慎應對。',
          '從卡牌來看，你的決策環境需要調整策略。',
          '在決策領域，當前的環境對你不太友善，需要重新規劃。',
          '當前的決策能量流動受阻，這是一個需要謹慎的時刻。',
          '決策方面，你正處在一個需要調整的階段，保持冷靜很重要。'
        ],
        critical: [
          '在重大決策方面，你正處於一個極具挑戰的階段。',
          '從卡牌來看，你正面臨一個重大的決策考驗。',
          '在決策領域，當前的困境雖然嚴峻，但也可能是轉機的開始。',
          '當前的決策能量流動非常低弱，但這也意味著轉機即將到來。',
          '決策方面，這是最需要謹慎的時刻，相信你的努力會帶來改變。'
        ]
      };
      
      if (cards.some(c => c.name === '十字路口')) {
        return '在重大決策方面，你正站在重要的抉擇點，這是一個關鍵的決策時刻。';
      }
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    },
    analysis: (cards, metrics, combination, situation) => {
      const parts: string[] = [];
      
      // 第一張卡牌分析
      const firstCard = cards[0];
      if (firstCard.category === '地' && firstCard.name === '十字路口') {
        parts.push(`在「${firstCard.name}」的決策環境中，你正面臨重要的抉擇，${firstCard.infoB ? firstCard.infoB.replace(/「|」/g, '') : '需要仔細評估各種選項'}。`);
        parts.push('你正站在關鍵的抉擇點，必須做出方向性的決定。');
      } else if (firstCard.category === '變數') {
        if (firstCard.name === '陷阱' || firstCard.name === '閃電') {
          parts.push(`「${firstCard.name}」這個變數將帶來決策風險，需要特別注意和謹慎應對。`);
        } else if (firstCard.name === '奇蹟' || firstCard.name === '禮物') {
          parts.push(`「${firstCard.name}」這個變數將帶來決策機會，${firstCard.direction > 0 ? '這是一個重要的轉機' : '需要你把握機會'}。`);
        } else {
          parts.push(`「${firstCard.name}」這個變數會${firstCard.direction > 0 ? '為你的決策帶來正面影響' : firstCard.direction < 0 ? '帶來挑戰' : '保持現狀'}。`);
        }
      } else if (firstCard.category === '天') {
        const energyLevel = firstCard.energy >= 7 ? '非常充沛' : firstCard.energy >= 5 ? '相對穩定' : '較為低弱';
        parts.push(`「${firstCard.name}」顯示你的決策能量${energyLevel}，${firstCard.infoA || '這將影響你的決策能力'}。`);
        if (firstCard.energy < 5) {
          parts.push('決策能量較弱，需要先恢復再做出重要決定。');
        }
      } else if (firstCard.category === '人') {
        if (firstCard.name === '領航員' || firstCard.name === '守門人') {
          parts.push(`作為「${firstCard.name}」，你在決策中扮演重要角色，${firstCard.infoB ? firstCard.infoB.replace(/「|」/g, '') : '需要仔細思考決策的影響'}。`);
        }
      }
      
      // 第二張和第三張卡牌分析
      if (cards.length > 1) {
        cards.slice(1).forEach((card, index) => {
          if (card.name === '十字路口') {
            parts.push(`「${card.name}」顯示你正站在決策的關鍵抉擇點，需要仔細評估各種選項。`);
          } else if (card.name === '陷阱' || card.name === '閃電') {
            parts.push(`「${card.name}」提醒你注意決策風險，${card.impact >= 7 ? '影響重大' : '影響中等'}，需要謹慎應對。`);
          } else if (card.name === '奇蹟' || card.name === '禮物') {
            parts.push(`「${card.name}」顯示決策機會正在${card.name === '奇蹟' ? '出現' : '降臨'}，${card.temporal <= 1 ? '短期內' : '長期內'}會有明顯變化。`);
          } else {
            parts.push(`「${card.name}」${card.impact >= 7 ? '對決策有重大影響' : '對決策有中等影響'}，${card.temporal <= 1 ? '短期內' : card.temporal >= 3 ? '長期內' : '中期內'}會${card.direction > 0 ? '帶來機會' : card.direction < 0 ? '帶來挑戰' : '保持現狀'}。`);
          }
        });
      }
      
      // 組合模式分析
      if (combination.patterns.includes('轉折點')) {
        parts.push('這是一個關鍵的決策轉折點，你的選擇將決定未來的方向。');
      } else if (combination.patterns.includes('危機四伏')) {
        parts.push('決策面臨多重風險，但危機中也藏著轉機，需要保持冷靜和理性。');
      } else if (cards.some(c => c.name === '十字路口') && cards.some(c => c.name === '奇蹟')) {
        parts.push('抉擇與機會同時出現，這是一個重要的決策時刻，需要仔細評估。');
      }
      
      // 整體趨勢
      const hasRisk = cards.some(c => c.name === '陷阱' || c.name === '閃電');
      const hasOpportunity = cards.some(c => c.name === '奇蹟' || c.name === '禮物');
      
      if (hasOpportunity && !hasRisk && metrics.directionSum >= 1) {
        parts.push('整體而言，你的決策運勢有利，機會大於風險，可以積極考慮。');
      } else if (hasRisk) {
        parts.push('整體而言，你的決策運勢面臨風險，需要謹慎評估，做好充分準備。');
      } else if (metrics.directionSum >= 2) {
        parts.push('整體而言，你的決策運勢正在強勁上升，適合積極行動。');
      } else if (metrics.directionSum >= 1) {
        parts.push('整體而言，你的決策運勢正在穩步上升，保持當前決策節奏即可。');
      } else if (metrics.directionSum === 0) {
        parts.push('整體而言，你的決策運勢處於平衡狀態，需要更多資訊和時間來做決定。');
      } else {
        parts.push('整體而言，你的決策運勢面臨一些挑戰，需要調整策略和重新評估。');
      }
      
      return parts.join(' ');
    },
    advice: (cards, metrics, combination, situation) => {
      const advice: string[] = [];
      const hasRisk = cards.some(c => c.name === '陷阱' || c.name === '閃電');
      const hasOpportunity = cards.some(c => c.name === '奇蹟' || c.name === '禮物');
      
      // 基於能量等級的建議
      if (metrics.energyAvg >= 7) {
        advice.push('把握當前的決策機會，積極行動，但要做好充分的準備');
        if (hasOpportunity) {
          advice.push('決策機會正在出現，要把握機會，但也要做好風險評估');
        }
      } else if (metrics.energyAvg < 5) {
        advice.push('需要調整決策節奏，給自己充分的思考時間，不要急於做決定');
        if (cards.some(c => c.name === '小雪' || c.name === '立冬')) {
          advice.push('現在是休息和思考的好時機，不要急於行動');
        }
      }
      
      // 基於方向的建議
      if (hasOpportunity && !hasRisk && metrics.directionSum >= 1) {
        advice.push('決策機會大於風險，可以積極考慮，但要做好充分的準備');
        advice.push('收集足夠的資訊，諮詢專業人士的意見');
      } else if (hasRisk) {
        advice.push('仔細評估決策的風險和後果，制定應對計劃，準備好應對最壞情況');
        if (cards.some(c => c.intensity === 'extreme' && c.name === '陷阱')) {
          advice.push('面對重大風險時，要特別謹慎，尋求專業建議很重要');
        }
      } else if (metrics.directionSum >= 2) {
        advice.push('決策運勢正在上升，要把握機會，但也要保持理性和謹慎');
      } else if (metrics.directionSum < 0) {
        advice.push('面對決策挑戰時，保持冷靜和理性，不要急於做決定');
      }
      
      // 基於特定卡牌的建議
      cards.forEach(card => {
        if (card.name === '十字路口') {
          advice.push('你正站在決策的關鍵抉擇點，需要相信自己的直覺，但也要收集足夠資訊');
        } else if (card.name === '陷阱' || card.name === '閃電') {
          advice.push('面對決策風險時，要仔細評估，避免掉入陷阱，多聽取不同角度的意見');
        } else if (card.name === '奇蹟' || card.name === '禮物') {
          advice.push('當決策機會出現時，要思考它帶來的意義，做好充分準備和風險評估');
        } else if (card.name === '領航員') {
          advice.push('作為領航員，要承擔決策責任，但也需要坦誠面對不確定性');
        }
      });
      
      // 基於時間性的建議
      if (metrics.temporalAvg <= 1.5) {
        advice.push('短期內會有明顯的決策變化，需要密切關注局勢發展');
      } else if (metrics.temporalAvg >= 2.5) {
        advice.push('這是一個長期的決策趨勢，需要持續關注和規劃，不要急於求成');
      }
      
      // 確保至少有3條建議
      if (advice.length < 3) {
        advice.push('不要急於做決定，給自己充分的思考時間');
        advice.push('列出決策的利弊，尋求信任的人的建議');
        advice.push('收集足夠的資訊，諮詢專業人士的意見');
      }
      
      return advice.slice(0, 5);
    },
    closing: (cards, metrics, situation) => {
      const templates: Record<typeof metrics.overallState, string[]> = {
        excellent: [
          '重大決策需要理性分析，但也要相信自己的直覺，相信你的努力會帶來豐碩的回報。',
          '保持當前的決策節奏，你的選擇會越來越明智。',
          '把握當前的機會，展現你的決策智慧，未來會更加光明。'
        ],
        good: [
          '重大決策需要理性分析，但也要相信自己的直覺，相信你的努力會帶來回報。',
          '持續努力，穩健決策，你的選擇會越來越好。',
          '保持當前的節奏，累積決策經驗，機會會在不經意間出現。'
        ],
        neutral: [
          '重大決策需要理性分析，但也要相信自己的直覺，保持耐心和觀察，等待合適的時機。',
          '當前的平穩是暫時的，保持準備，機會來臨時要把握。',
          '不要急於求成，穩健發展，時間會證明你的努力。'
        ],
        challenging: [
          '重大決策需要理性分析，但也要相信自己的直覺，面對挑戰時要保持冷靜，尋求專業幫助。',
          '困難是暫時的，調整策略，重新出發，你會找到出路。',
          '保持韌性和耐心，相信你的能力，困難終會過去。'
        ],
        critical: [
          '重大決策需要理性分析，但也要相信自己的直覺，這是最需要謹慎的時刻，相信你的努力會帶來轉機。',
          '從低谷中學習，從困境中成長，這將是你決策的重要轉折。',
          '保持希望和勇氣，最困難的時刻往往也是轉機的開始。'
        ]
      };
      
      return templates[metrics.overallState][
        Math.floor(Math.random() * templates[metrics.overallState].length)
      ];
    }
  }
};

// 生成通用分析段落（基於卡牌類別）
function generateCardAnalysis(card: CardWeight, position: number, situationName: string): string {
  const positionNames = ['第一張', '第二張', '第三張'];
  const positionName = positionNames[position] || '';
  
  if (card.category === '天') {
    const energyLevel = card.energy >= 7 ? '非常充沛' : card.energy >= 5 ? '相對穩定' : '較為低弱';
    return `「${positionName}「${card.name}」顯示你的能量狀態${energyLevel}，${card.infoA || '這將影響你的整體狀態'}。`;
  } else if (card.category === '地') {
    const envType = card.direction > 0 ? '有利' : card.direction < 0 ? '充滿挑戰' : '中性';
    return `在「${positionName}「${card.name}」的環境中，你面臨${envType}的條件，${card.infoA || '需要仔細評估環境因素'}。`;
  } else if (card.category === '人') {
    return `作為「${positionName}「${card.name}」，${card.infoB || '你在關係中的位置需要仔細思考'}。`;
  } else if (card.category === '變數') {
    const impactLevel = card.intensity === 'extreme' ? '重大' : card.intensity === 'high' ? '中等' : '輕微';
    return `「${positionName}「${card.name}」這個變數將帶來${impactLevel}影響，${card.infoA || '需要特別注意'}。`;
  }
  return '';
}

// 生成情境化解讀
export function generateSituationInterpretation(
  cards: CardWeight[],
  situation: Situation
): SituationResult['interpretation'] {
  const metrics = calculateSituationMetrics(cards);
  const combination = analyzeCardCombination(cards);
  const template = interpretationTemplates[situation.id];
  
  if (!template) {
    // 默認模板（使用通用生成器）
    const opening = `在${situation.name}方面，`;
    const analysisParts: string[] = [];
    cards.forEach((card, index) => {
      analysisParts.push(generateCardAnalysis(card, index, situation.name));
    });
    const analysis = analysisParts.join(' ');
    
    const advice: string[] = [];
    if (metrics.energyAvg >= 7) {
      advice.push('把握當前的機會，積極行動');
    } else if (metrics.energyAvg < 5) {
      advice.push('需要調整節奏，給自己充分的休息時間');
    }
    if (metrics.directionSum >= 1) {
      advice.push('運勢正在上升，保持當前節奏');
    } else if (metrics.directionSum < 0) {
      advice.push('面對挑戰時，保持冷靜和理性');
    }
    advice.push('保持耐心和專注', '尋求專業建議');
    
    const closing = '相信你的努力會帶來改變。';
    
    // 提取關鍵洞察
    const keyInsights: string[] = [];
    cards.forEach(card => {
      if (card.intensity === 'extreme') {
        keyInsights.push(`${card.name}：這是一個關鍵時刻，需要特別關注`);
      }
      if (card.direction < 0 && card.impact >= 7) {
        keyInsights.push(`需要注意${card.name}帶來的挑戰`);
      }
      if (card.direction > 0 && card.impact >= 8) {
        keyInsights.push(`${card.name}：這是一個重要的機會，值得把握`);
      }
    });
    
    return {
      opening,
      analysis,
      advice: advice.slice(0, 5),
      closing,
      keyInsights: keyInsights.slice(0, 3)
    };
  }
  
  const opening = template.opening(cards, metrics, situation);
  const analysis = template.analysis(cards, metrics, combination, situation);
  const advice = template.advice(cards, metrics, combination, situation);
  const closing = template.closing(cards, metrics, situation);
  
  // 提取關鍵洞察（更豐富的邏輯）
  const keyInsights: string[] = [];
  
  // 極端卡牌
  cards.forEach(card => {
    if (card.intensity === 'extreme') {
      keyInsights.push(`${card.name}：這是一個關鍵時刻，${card.direction > 0 ? '機會難得' : '挑戰嚴峻'}，需要特別關注`);
    }
  });
  
  // 高影響力負面卡牌
  cards.forEach(card => {
    if (card.direction < 0 && card.impact >= 7) {
      keyInsights.push(`需要注意${card.name}帶來的挑戰，${card.infoB ? card.infoB.replace(/「|」/g, '') : '需要謹慎應對'}`);
    }
  });
  
  // 高影響力正面卡牌
  cards.forEach(card => {
    if (card.direction > 0 && card.impact >= 8 && !keyInsights.some(ki => ki.includes(card.name))) {
      keyInsights.push(`${card.name}：這是一個重要的機會，${card.infoB ? card.infoB.replace(/「|」/g, '') : '值得把握'}`);
    }
  });
  
  // 特殊組合洞察
  if (combination.patterns.includes('轉折點')) {
    keyInsights.push('這是一個關鍵的轉折點，你的選擇將決定未來的方向');
  } else if (combination.patterns.includes('重生契機')) {
    keyInsights.push('從低谷中看到重生的曙光，這是重新開始的好時機');
  } else if (combination.patterns.includes('危機四伏')) {
    keyInsights.push('多重危機同時出現，但危機中也藏著轉機');
  }
  
  return {
    opening,
    analysis,
    advice,
    closing,
    keyInsights: keyInsights.slice(0, 4) // 最多4個關鍵洞察
  };
}

// 生成摘要
export function generateSituationSummary(
  cards: CardWeight[],
  situation: Situation
): SituationResult['summary'] {
  const energyAvg = cards.reduce((sum, c) => sum + c.energy, 0) / cards.length;
  const impactAvg = cards.reduce((sum, c) => sum + c.impact, 0) / cards.length;
  const directionSum = cards.reduce((sum, c) => sum + c.direction, 0);
  const hasRisk = cards.some(c => c.direction < 0 && c.impact >= 7);
  const hasOpportunity = cards.some(c => c.direction > 0 && c.impact >= 7);
  
  // 整體狀態
  let overallState: SituationResult['summary']['overallState'];
  if (directionSum >= 2 && energyAvg >= 7) {
    overallState = 'excellent';
  } else if (directionSum >= 1) {
    overallState = 'good';
  } else if (directionSum === 0) {
    overallState = 'neutral';
  } else if (directionSum >= -1) {
    overallState = 'challenging';
  } else {
    overallState = 'critical';
  }
  
  // 能量等級
  const energyLevel: SituationResult['summary']['energyLevel'] = 
    energyAvg >= 7 ? 'high' : energyAvg >= 5 ? 'medium' : 'low';
  
  // 風險等級
  const riskLevel: SituationResult['summary']['riskLevel'] = 
    hasRisk ? 'high' : impactAvg >= 7 ? 'medium' : 'low';
  
  // 機會等級
  const opportunityLevel: SituationResult['summary']['opportunityLevel'] = 
    hasOpportunity ? 'high' : directionSum > 0 ? 'medium' : 'low';
  
  return {
    overallState,
    energyLevel,
    riskLevel,
    opportunityLevel
  };
}
