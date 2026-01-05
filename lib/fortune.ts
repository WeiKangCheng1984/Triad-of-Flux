import { CardWeight, FortuneCalculation, FortuneText, FortuneLevel, FortuneDirection, TimePrediction } from '@/types/card';

export function calculateFortune(
  skyCard: CardWeight,
  earthCard: CardWeight,
  humanCard: CardWeight,
  variableCard: CardWeight
): FortuneCalculation {
  
  // 1. 類別基礎權重
  const categoryWeights = {
    天: 0.30,  // 能量基礎
    地: 0.25,  // 環境基礎
    人: 0.25,  // 關係基礎
    變數: 0.20 // 變動基礎
  };
  
  // 2. 基礎分數計算
  const skyBase = (skyCard.energy * 0.4 + skyCard.impact * 0.6) 
                  * categoryWeights.天 * skyCard.direction;
  const earthBase = (earthCard.energy * 0.4 + earthCard.impact * 0.6) 
                    * categoryWeights.地 * earthCard.direction;
  const humanBase = (humanCard.energy * 0.4 + humanCard.impact * 0.6) 
                    * categoryWeights.人 * humanCard.direction;
  const variableBase = (variableCard.energy * 0.5 + variableCard.impact * 0.5) 
                       * categoryWeights.變數 * variableCard.direction;
  
  const baseScore = skyBase + earthBase + humanBase + variableBase;
  
  // 3. 交互作用計算（卡牌相性）
  let interactionScore = 0;
  
  // 3.1 極端卡牌組合加成
  const extremeCards = [skyCard, earthCard, humanCard, variableCard]
    .filter(c => c.intensity === 'extreme').length;
  if (extremeCards >= 2) {
    interactionScore += extremeCards * 2; // 多張極端卡牌會放大效果
  }
  
  // 3.2 方向性衝突/協調
  const positiveCount = [skyCard, earthCard, humanCard, variableCard]
    .filter(c => c.direction > 0).length;
  const negativeCount = [skyCard, earthCard, humanCard, variableCard]
    .filter(c => c.direction < 0).length;
  
  if (positiveCount >= 3) {
    interactionScore += 3; // 多數正面，協調加成
  } else if (negativeCount >= 3) {
    interactionScore -= 3; // 多數負面，衝突減分
  }
  
  // 3.3 變數卡牌的特殊影響
  if (variableCard.intensity === 'extreme') {
    interactionScore += variableCard.direction * 5; // 極端變數放大影響
  }
  
  // 3.4 時間性協調
  const temporalAvg = (skyCard.temporal + earthCard.temporal + 
                       humanCard.temporal + variableCard.temporal) / 4;
  if (temporalAvg <= 1.5) {
    interactionScore += 2; // 短期集中，影響明顯
  } else if (temporalAvg >= 2.5) {
    interactionScore -= 1; // 長期分散，影響緩和
  }
  
  // 4. 綜合分數
  const totalScore = baseScore + interactionScore;
  
  // 5. 運勢等級判定
  let fortuneLevel: FortuneLevel;
  if (totalScore <= -15) fortuneLevel = '極差';
  else if (totalScore <= -5) fortuneLevel = '不佳';
  else if (totalScore <= 5) fortuneLevel = '普通';
  else if (totalScore <= 15) fortuneLevel = '良好';
  else fortuneLevel = '極佳';
  
  // 6. 運勢方向判定
  const directionSum = skyCard.direction + earthCard.direction + 
                       humanCard.direction + variableCard.direction;
  let fortuneDirection: FortuneDirection;
  if (directionSum <= -2) fortuneDirection = '下降';
  else if (directionSum >= 2) fortuneDirection = '上升';
  else fortuneDirection = '持平';
  
  // 7. 時間預測（取平均時間性）
  let timePrediction: TimePrediction;
  if (temporalAvg <= 1.5) timePrediction = '短期';
  else if (temporalAvg >= 2.5) timePrediction = '長期';
  else timePrediction = '中期';
  
  // 8. 多維度分析
  // 8.1 能量流動分析
  const energyAvg = (skyCard.energy + earthCard.energy + humanCard.energy + variableCard.energy) / 4;
  let energyFlow: '充沛' | '穩定' | '低弱' | '波動';
  if (energyAvg >= 7) energyFlow = '充沛';
  else if (energyAvg <= 4) energyFlow = '低弱';
  else {
    const energyVariance = Math.abs(skyCard.energy - energyAvg) + 
                           Math.abs(earthCard.energy - energyAvg) +
                           Math.abs(humanCard.energy - energyAvg) +
                           Math.abs(variableCard.energy - energyAvg);
    energyFlow = energyVariance > 8 ? '波動' : '穩定';
  }
  
  // 8.2 環境適應分析
  let environmentAdaptation: '有利' | '中性' | '挑戰';
  const earthScore = earthCard.direction * earthCard.impact;
  if (earthScore > 3) environmentAdaptation = '有利';
  else if (earthScore < -3) environmentAdaptation = '挑戰';
  else environmentAdaptation = '中性';
  
  // 8.3 人際動態分析
  let relationshipDynamics: '和諧' | '平衡' | '緊張';
  const humanScore = humanCard.direction * humanCard.impact;
  if (humanScore > 3) relationshipDynamics = '和諧';
  else if (humanScore < -3) relationshipDynamics = '緊張';
  else relationshipDynamics = '平衡';
  
  // 8.4 變數影響分析
  let variableImpact: '重大' | '中等' | '輕微';
  if (variableCard.intensity === 'extreme') variableImpact = '重大';
  else if (variableCard.intensity === 'high') variableImpact = '中等';
  else variableImpact = '輕微';
  
  // 9. 特殊組合檢測（擴展更多組合）
  const specialCombinations: string[] = [];
  
  // 9.1 極端組合
  if (extremeCards >= 3) {
    specialCombinations.push('極端組合');
  }
  
  // 9.2 能量高峰組合（夏至 + 劇場 + 領航員）
  if (skyCard.name === '夏至' && earthCard.name === '劇場' && humanCard.name === '領航員') {
    specialCombinations.push('能量高峰');
  }
  
  // 9.3 轉折點組合（冬至 + 十字路口 + 重逢）
  if (skyCard.name === '冬至' && earthCard.name === '十字路口' && variableCard.name === '重逢') {
    specialCombinations.push('轉折點');
  }
  
  // 9.4 危機組合（大暑 + 深淵 + 背叛者 + 閃電）
  if (skyCard.name === '大暑' && earthCard.name === '深淵' && 
      humanCard.name === '背叛者' && variableCard.name === '閃電') {
    specialCombinations.push('危機四伏');
  }
  
  // 9.5 重生組合（大寒 + 廢墟 + 學徒 + 奇蹟）
  if (skyCard.name === '大寒' && earthCard.name === '廢墟' && 
      humanCard.name === '學徒' && variableCard.name === '奇蹟') {
    specialCombinations.push('重生契機');
  }
  
  // 9.6 平衡組合（春分 + 平原 + 調停者）
  if (skyCard.name === '春分' && earthCard.name === '平原' && humanCard.name === '調停者') {
    specialCombinations.push('完美平衡');
  }
  
  // 9.7 孤獨組合（立冬 + 孤島 + 隱士）
  if (skyCard.name === '立冬' && earthCard.name === '孤島' && humanCard.name === '隱士') {
    specialCombinations.push('深度內省');
  }
  
  // 9.8 新生組合（立春 + 後花園 + 學徒 + 火花）
  if (skyCard.name === '立春' && earthCard.name === '後花園' && 
      humanCard.name === '學徒' && variableCard.name === '火花') {
    specialCombinations.push('新生萌芽');
  }
  
  // 9.9 擴張組合（立夏 + 平原 + 競爭者 + 加速）
  if (skyCard.name === '立夏' && earthCard.name === '平原' && 
      humanCard.name === '競爭者' && variableCard.name === '加速') {
    specialCombinations.push('快速擴張');
  }
  
  // 9.10 終結組合（霜降 + 廢墟 + 背叛者 + 崩塌）
  if (skyCard.name === '霜降' && earthCard.name === '廢墟' && 
      humanCard.name === '背叛者' && variableCard.name === '崩塌') {
    specialCombinations.push('終結與重啟');
  }
  
  // 9.11 領導組合（夏至 + 劇場 + 領航員 + 奇蹟）
  if (skyCard.name === '夏至' && earthCard.name === '劇場' && 
      humanCard.name === '領航員' && variableCard.name === '奇蹟') {
    specialCombinations.push('領導高峰');
  }
  
  // 9.12 內省組合（立冬 + 孤島 + 隱士 + 空白）
  if (skyCard.name === '立冬' && earthCard.name === '孤島' && 
      humanCard.name === '隱士' && variableCard.name === '空白') {
    specialCombinations.push('深度內省');
  }
  
  // 9.13 衝突組合（大暑 + 迷宮 + 競爭者 + 狂風）
  if (skyCard.name === '大暑' && earthCard.name === '迷宮' && 
      humanCard.name === '競爭者' && variableCard.name === '狂風') {
    specialCombinations.push('激烈衝突');
  }
  
  // 9.14 和諧組合（春分 + 後花園 + 調停者 + 彩虹）
  if (skyCard.name === '春分' && earthCard.name === '後花園' && 
      humanCard.name === '調停者' && variableCard.name === '彩虹') {
    specialCombinations.push('和諧美好');
  }
  
  // 9.15 成長組合（穀雨 + 溫室 + 學徒 + 相遇）
  if (skyCard.name === '穀雨' && earthCard.name === '溫室' && 
      humanCard.name === '學徒' && variableCard.name === '相遇') {
    specialCombinations.push('學習成長');
  }
  
  // 9.16 權力組合（夏至 + 要塞 + 守門人 + 禮物）
  if (skyCard.name === '夏至' && earthCard.name === '要塞' && 
      humanCard.name === '守門人' && variableCard.name === '禮物') {
    specialCombinations.push('權力集中');
  }
  
  // 9.17 流動組合（雨水 + 平原 + 流浪者 + 迷路）
  if (skyCard.name === '雨水' && earthCard.name === '平原' && 
      humanCard.name === '流浪者' && variableCard.name === '迷路') {
    specialCombinations.push('流動不定');
  }
  
  // 9.18 救贖組合（冬至 + 深淵 + 救贖者 + 奇蹟）
  if (skyCard.name === '冬至' && earthCard.name === '深淵' && 
      humanCard.name === '救贖者' && variableCard.name === '奇蹟') {
    specialCombinations.push('救贖之光');
  }
  
  // 9.19 反叛組合（驚蟄 + 廢墟 + 反叛者 + 地震）
  if (skyCard.name === '驚蟄' && earthCard.name === '廢墟' && 
      humanCard.name === '反叛者' && variableCard.name === '地震') {
    specialCombinations.push('打破舊制');
  }
  
  // 9.20 傳承組合（立春 + 孤峰 + 繼承者 + 重逢）
  if (skyCard.name === '立春' && earthCard.name === '孤峰' && 
      humanCard.name === '繼承者' && variableCard.name === '重逢') {
    specialCombinations.push('傳承延續');
  }
  
  // 10. 關鍵主題提取（從關鍵詞中提取）
  const allKeywords = [
    ...skyCard.keywords,
    ...earthCard.keywords,
    ...humanCard.keywords,
    ...variableCard.keywords
  ];
  
  // 統計關鍵詞頻率，選出最重要的3-5個
  const keywordCount: Record<string, number> = {};
  allKeywords.forEach(kw => {
    keywordCount[kw] = (keywordCount[kw] || 0) + 1;
  });
  
  const keyThemes = Object.entries(keywordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([kw]) => kw);
  
  return {
    baseScore,
    interactionScore,
    totalScore,
    fortuneLevel,
    fortuneDirection,
    timePrediction,
    energyFlow,
    environmentAdaptation,
    relationshipDynamics,
    variableImpact,
    specialCombinations,
    keyThemes
  };
}

export function generateFortuneText(
  cards: [CardWeight, CardWeight, CardWeight, CardWeight],
  calculation: FortuneCalculation
): FortuneText {
  const [skyCard, earthCard, humanCard, variableCard] = cards;
  
  // 1. 開場白（根據運勢等級和特殊組合）
  const openingTemplates: Record<FortuneLevel, string[]> = {
    '極佳': [
      '此刻的你，正處於一個能量充沛的階段。',
      '你現在擁有的條件，足以支撐你走向更高的層次。',
      '這是一個充滿可能性的時刻。',
      '從卡牌來看，你正站在一個有利的起點上。',
      '當前的能量流動非常順暢，適合展開重要行動。'
    ],
    '良好': [
      '整體而言，你的運勢正在穩步上升。',
      '雖然有些挑戰，但你有足夠的資源應對。',
      '現在是行動的好時機。',
      '從整體來看，你正處於一個上升的軌道上。',
      '當前的狀態雖然不是完美，但已經足夠支撐你的目標。'
    ],
    '普通': [
      '你正處於一個轉換期，需要仔細觀察。',
      '當前的狀態相對平穩，但也暗藏變化。',
      '這是一個需要耐心等待的階段。',
      '從卡牌來看，你正處在一個過渡的時期。',
      '當前的能量流動平穩，但需要留意細微的變化。'
    ],
    '不佳': [
      '你現在面臨一些困難，需要謹慎應對。',
      '當前的環境對你不太友善，需要調整策略。',
      '這是一個考驗你韌性的時刻。',
      '從卡牌來看，你正處在一個需要調整的階段。',
      '當前的能量流動受阻，需要重新規劃方向。'
    ],
    '極差': [
      '你正處於一個極具挑戰的階段。',
      '當前的困境雖然嚴峻，但也可能是轉機的開始。',
      '這是最需要堅持的時刻。',
      '從卡牌來看，你正面臨一個重大的考驗。',
      '當前的能量流動非常低弱，但這也意味著轉機即將到來。'
    ]
  };
  
  // 如果有特殊組合，調整開場白
  let opening = openingTemplates[calculation.fortuneLevel][
    Math.floor(Math.random() * openingTemplates[calculation.fortuneLevel].length)
  ];
  
  if (calculation.specialCombinations.includes('重生契機')) {
    opening = '從最深的低谷中，你看到了重生的曙光。';
  } else if (calculation.specialCombinations.includes('危機四伏')) {
    opening = '你正處於一個極度危險的境地，但危機中也藏著轉機。';
  } else if (calculation.specialCombinations.includes('轉折點')) {
    opening = '這是一個關鍵的轉折點，你的選擇將決定未來的方向。';
  } else if (calculation.specialCombinations.includes('能量高峰')) {
    opening = '你正處於能量的高峰，這是展現影響力的最佳時機。';
  }
  
  // 2. 分析段落（多角度深度分析）
  const analysisParts: string[] = [];
  
  // 2.1 能量流動分析（基於天牌和整體能量）
  const energyDescriptions: Record<typeof calculation.energyFlow, string[]> = {
    '充沛': [
      `「${skyCard.name}」顯示你的能量狀態非常充沛，這股力量將推動你前進。`,
      `從「${skyCard.name}」來看，你現在擁有足夠的能量來應對各種挑戰。`,
      `「${skyCard.name}」帶來的能量流動非常強勁，適合展開重要計劃。`
    ],
    '穩定': [
      `「${skyCard.name}」顯示你的能量狀態相對穩定，這是一個可以持續發展的基礎。`,
      `從「${skyCard.name}」來看，你的能量流動平穩，適合按部就班地推進。`,
      `「${skyCard.name}」帶來的能量雖然不強烈，但穩定可靠。`
    ],
    '低弱': [
      `「${skyCard.name}」顯示你的能量狀態較為低弱，需要先恢復再行動。`,
      `從「${skyCard.name}」來看，你現在的能量不足以支撐大規模的行動。`,
      `「${skyCard.name}」帶來的能量流動較弱，這是休息和積蓄的時機。`
    ],
    '波動': [
      `「${skyCard.name}」顯示你的能量狀態波動較大，需要找到穩定的節奏。`,
      `從「${skyCard.name}」來看，你的能量流動不穩定，需要調節和平衡。`,
      `「${skyCard.name}」帶來的能量時高時低，需要靈活應對。`
    ]
  };
  
  analysisParts.push(
    energyDescriptions[calculation.energyFlow][
      Math.floor(Math.random() * energyDescriptions[calculation.energyFlow].length)
    ]
  );
  
  // 2.2 環境適應分析（基於地牌）
  const environmentDescriptions: Record<typeof calculation.environmentAdaptation, string[]> = {
    '有利': [
      `在「${earthCard.name}」的環境中，你面臨非常有利的條件，可以充分利用這些資源。`,
      `「${earthCard.name}」為你提供了一個良好的環境，這是行動的好時機。`,
      `從「${earthCard.name}」來看，當前的環境對你非常友善，適合展開計劃。`
    ],
    '中性': [
      `在「${earthCard.name}」的環境中，你面臨中性的條件，需要自己創造機會。`,
      `「${earthCard.name}」提供的環境既不特別有利也不特別不利，關鍵在於你的選擇。`,
      `從「${earthCard.name}」來看，當前的環境是中性的，你的行動將決定結果。`
    ],
    '挑戰': [
      `在「${earthCard.name}」的環境中，你面臨不小的挑戰，需要謹慎應對。`,
      `「${earthCard.name}」為你提供了一個充滿挑戰的環境，這是考驗你能力的時刻。`,
      `從「${earthCard.name}」來看，當前的環境對你不太友善，需要調整策略。`
    ]
  };
  
  analysisParts.push(
    environmentDescriptions[calculation.environmentAdaptation][
      Math.floor(Math.random() * environmentDescriptions[calculation.environmentAdaptation].length)
    ]
  );
  
  // 2.3 人際動態分析（基於人牌）
  const relationshipDescriptions: Record<typeof calculation.relationshipDynamics, string[]> = {
    '和諧': [
      `作為「${humanCard.name}」，你在關係中的位置非常和諧，這將為你帶來支持。`,
      `「${humanCard.name}」這個角色讓你在人際關係中處於有利的位置。`,
      `從「${humanCard.name}」來看，你的人際關係正處於和諧的狀態。`
    ],
    '平衡': [
      `作為「${humanCard.name}」，你在關係中的位置相對平衡，需要維持這種狀態。`,
      `「${humanCard.name}」這個角色讓你在人際關係中處於平衡的位置。`,
      `從「${humanCard.name}」來看，你的人際關係需要保持平衡。`
    ],
    '緊張': [
      `作為「${humanCard.name}」，你在關係中的位置有些緊張，需要調整互動方式。`,
      `「${humanCard.name}」這個角色讓你在人際關係中面臨一些挑戰。`,
      `從「${humanCard.name}」來看，你的人際關係需要重新調整。`
    ]
  };
  
  analysisParts.push(
    relationshipDescriptions[calculation.relationshipDynamics][
      Math.floor(Math.random() * relationshipDescriptions[calculation.relationshipDynamics].length)
    ]
  );
  
  // 2.4 變數影響分析（基於變數牌）
  const variableDescriptions: Record<typeof calculation.variableImpact, string[]> = {
    '重大': [
      `「${variableCard.name}」這個變數將帶來重大影響，${variableCard.direction > 0 ? '這是一個關鍵的轉機' : '這是一個嚴峻的考驗'}，你需要做好充分準備。`,
      `特別要注意「${variableCard.name}」這個變數，它的影響力非常重大，將${variableCard.direction > 0 ? '徹底改變局勢' : '帶來重大衝擊'}。`,
      `「${variableCard.name}」是一個關鍵變數，它的出現將${variableCard.direction > 0 ? '開啟新的可能性' : '帶來重大挑戰'}。`
    ],
    '中等': [
      `「${variableCard.name}」這個變數會帶來中等程度的影響，${variableCard.direction > 0 ? '為你提供一些機會' : '帶來一些挑戰'}。`,
      `「${variableCard.name}」這個變數的影響力中等，需要你${variableCard.direction > 0 ? '把握機會' : '謹慎應對'}。`,
      `從「${variableCard.name}」來看，這個變數會${variableCard.direction > 0 ? '帶來一些正面影響' : '帶來一些負面影響'}。`
    ],
    '輕微': [
      `「${variableCard.name}」這個變數的影響較為輕微，${variableCard.direction > 0 ? '可能會帶來一些小驚喜' : '可能會帶來一些小波折'}。`,
      `「${variableCard.name}」這個變數的影響力不大，${variableCard.direction > 0 ? '但仍有其意義' : '但也不可忽視'}。`,
      `從「${variableCard.name}」來看，這個變數的影響較為輕微，不會造成太大波動。`
    ]
  };
  
  analysisParts.push(
    variableDescriptions[calculation.variableImpact][
      Math.floor(Math.random() * variableDescriptions[calculation.variableImpact].length)
    ]
  );
  
  // 2.5 特殊組合分析
  if (calculation.specialCombinations.length > 0) {
    const combinationDescriptions: Record<string, string[]> = {
      '極端組合': [
        '這是一個極端的組合，所有因素都指向同一個方向，影響力將被放大。',
        '極端的卡牌組合意味著強烈的能量流動，這將帶來深刻的變化。',
        '當極端因素匯聚時，它們會相互放大，形成不可忽視的力量。'
      ],
      '能量高峰': [
        '你正處於能量的高峰，這是展現影響力和領導力的最佳時機。',
        '能量、環境和角色都達到高峰，這是一個展現實力的完美時刻。',
        '所有因素都指向能量高峰，要善用這股強大的力量。'
      ],
      '轉折點': [
        '這是一個關鍵的轉折點，你的選擇將決定未來的走向。',
        '轉折時刻已經到來，過去的陰影和未來的可能性同時出現。',
        '你正站在人生的轉折點上，每個選擇都將影響深遠。'
      ],
      '危機四伏': [
        '你正處於一個危機四伏的境地，但危機中也藏著轉機。',
        '多重危機同時出現，這是最危險也最可能突破的時刻。',
        '危機四伏的環境考驗你的韌性，但也可能帶來意想不到的轉機。'
      ],
      '重生契機': [
        '從最深的低谷中，你看到了重生的曙光，這是一個重新開始的機會。',
        '在最冷的時刻，奇蹟出現了，這是一個徹底重生的契機。',
        '從廢墟中學習，從奇蹟中獲得力量，這是重新開始的完美時機。'
      ],
      '完美平衡': [
        '所有因素都達到了完美的平衡，這是一個和諧穩定的狀態。',
        '能量、環境和關係都處於平衡點，這是一個可以持續發展的狀態。',
        '完美的平衡帶來穩定，但也需要你主動維持這種和諧。'
      ],
      '深度內省': [
        '你正處於一個深度內省的階段，這是重新認識自己的好時機。',
        '孤獨的環境和內省的狀態，讓你有機會深入思考自己的方向。',
        '在寂靜中，你聽到了內心的聲音，這是重新認識自己的時刻。'
      ],
      '新生萌芽': [
        '新的生命正在萌芽，這是一個充滿希望的開始。',
        '在舒適的環境中學習，新的靈感正在點燃，這是成長的開始。',
        '新生力量正在累積，雖然微弱但充滿潛力。'
      ],
      '快速擴張': [
        '你正處於快速擴張的階段，機會和競爭同時增加。',
        '能量快速增長，環境充滿機會，競爭也隨之而來，需要快速適應。',
        '擴張期來臨，要把握機會，但也要注意不要過度擴張。'
      ],
      '終結與重啟': [
        '舊的正在終結，新的即將開始，這是一個徹底轉換的時刻。',
        '終結帶來痛苦，但也帶來重新開始的機會，不要害怕改變。',
        '當一切崩塌時，也是重建的最佳時機，要勇敢面對終結。'
      ],
      '領導高峰': [
        '你正處於領導力的高峰，這是展現影響力的最佳時機。',
        '能量、舞台和奇蹟同時出現，這是領導者最輝煌的時刻。',
        '領導高峰來臨，要善用這股力量，但也要思考如何維持。'
      ],
      '激烈衝突': [
        '你正處於激烈衝突的中心，需要保持冷靜尋找解決方案。',
        '多重衝突同時爆發，這是最需要智慧和勇氣的時刻。',
        '衝突激烈但也是突破的機會，要從對抗中找到出路。'
      ],
      '和諧美好': [
        '所有因素都指向和諧，這是一個美好而穩定的狀態。',
        '能量、環境和關係都處於和諧狀態，要珍惜這個時刻。',
        '和諧的組合帶來美好，但也要思考如何維持這種狀態。'
      ],
      '學習成長': [
        '你正處於學習成長的階段，這是累積知識和經驗的好時機。',
        '在保護的環境中學習，遇到新的啟發，這是成長的黃金期。',
        '學習和成長同時進行，要把握這個累積實力的機會。'
      ],
      '權力集中': [
        '你正掌握著重要的權力，這是展現影響力的時刻。',
        '權力集中在你手中，要善用這股力量，但也要思考責任。',
        '權力和機會同時出現，這是展現領導力的好時機。'
      ],
      '流動不定': [
        '你正處於流動不定的狀態，需要找到穩定的方向。',
        '資源、環境和關係都不穩定，這是一個需要適應的時期。',
        '流動的狀態帶來不確定性，但也帶來新的可能性。'
      ],
      '救贖之光': [
        '在最黑暗的時刻，救贖之光出現了，這是一個轉機。',
        '從深淵中看到希望，救贖的力量正在發揮作用。',
        '救贖的時刻來臨，要把握這個從困境中解脫的機會。'
      ],
      '打破舊制': [
        '你正在打破舊的體制，這是改變的開始。',
        '反叛的力量和環境的變化同時出現，這是改革的時刻。',
        '打破舊制需要勇氣，但也是建立新秩序的開始。'
      ],
      '傳承延續': [
        '你正在繼承和延續，這是連接過去與未來的橋樑。',
        '站在高處繼承，與過去重逢，這是傳承的時刻。',
        '傳承的力量正在發揮，要思考如何延續和創新。'
      ]
    };
    
    calculation.specialCombinations.forEach(combo => {
      if (combinationDescriptions[combo]) {
        const descriptions = combinationDescriptions[combo];
        analysisParts.push(
          descriptions[Math.floor(Math.random() * descriptions.length)]
        );
      }
    });
  }
  
  // 2.6 綜合分析（根據交互作用分數）
  const synthesisTemplates: string[] = [];
  
  if (calculation.interactionScore > 8) {
    synthesisTemplates.push(
      '這些因素相互強烈強化，形成了一個不可阻擋的趨勢。',
      '所有卡牌都指向同一個方向，這股力量將推動你前進。',
      '這些因素完美協調，創造了一個強大的合力。'
    );
  } else if (calculation.interactionScore > 5) {
    synthesisTemplates.push(
      '這些因素相互強化，形成了一個強烈的趨勢。',
      '卡牌之間的協調性很高，這將放大整體的影響。',
      '這些因素相互呼應，形成了一個穩定的發展方向。'
    );
  } else if (calculation.interactionScore < -8) {
    synthesisTemplates.push(
      '這些因素相互強烈衝突，形成了一個極度不穩定的局面。',
      '所有卡牌都指向不同的方向，你需要找到平衡點。',
      '這些因素相互對抗，這是一個需要謹慎處理的時期。'
    );
  } else if (calculation.interactionScore < -5) {
    synthesisTemplates.push(
      '這些因素相互衝突，你需要找到平衡點。',
      '卡牌之間的矛盾較大，需要調和不同的力量。',
      '這些因素相互對立，這是一個需要智慧應對的時期。'
    );
  } else {
    synthesisTemplates.push(
      '這些因素相互影響，形成了一個複雜的局面。',
      '卡牌之間的關係複雜，需要仔細分析每個因素。',
      '這些因素相互交織，形成了一個多層次的狀態。'
    );
  }
  
  analysisParts.push(
    synthesisTemplates[Math.floor(Math.random() * synthesisTemplates.length)]
  );
  
  const analysis = analysisParts.join(' ');
  
  // 3. 建議生成（多角度、多層次的建議）
  const advice: string[] = [];
  
  // 3.1 基於能量流動的建議
  const energyAdvice: Record<typeof calculation.energyFlow, string[]> = {
    '充沛': [
      '你現在能量充沛，適合展開重要計劃，但要注意不要過度消耗。',
      '能量充沛的時期，要善用這股力量，同時也要為未來儲備能量。',
      '充分利用當前的能量高峰，但也要思考如何維持這股動力。'
    ],
    '穩定': [
      '能量流動穩定，適合按部就班地推進計劃，不要急於求成。',
      '穩定的能量狀態是持續發展的基礎，保持這個節奏很重要。',
      '能量穩定時，適合建立長期計劃，為未來打好基礎。'
    ],
    '低弱': [
      '能量較為低弱，這是休息和恢復的時機，不要勉強自己行動。',
      '能量不足時，先照顧好自己的身心，恢復後再重新出發。',
      '低能量時期，適合反思和調整，為下一個階段做準備。'
    ],
    '波動': [
      '能量波動較大，需要找到穩定的節奏，避免在低點時做重要決定。',
      '能量不穩定時，要學會調節，在高點行動，在低點休息。',
      '波動的能量需要你更加靈活，根據狀態調整行動策略。'
    ]
  };
  
  advice.push(
    energyAdvice[calculation.energyFlow][
      Math.floor(Math.random() * energyAdvice[calculation.energyFlow].length)
    ]
  );
  
  // 3.2 基於環境適應的建議
  const environmentAdvice: Record<typeof calculation.environmentAdaptation, string[]> = {
    '有利': [
      '環境對你有利，要充分利用這些條件，但也要保持謙遜。',
      '有利的環境是機會，要把握時機，但不要過度依賴環境。',
      '在有利的環境中，要思考如何最大化利用資源，同時建立自己的優勢。'
    ],
    '中性': [
      '環境是中性的，你的行動將決定結果，要主動創造機會。',
      '中性環境中，關鍵在於你的選擇和行動，不要等待環境改變。',
      '環境不偏不倚，這是你展現能力的時候，用行動證明自己。'
    ],
    '挑戰': [
      '環境充滿挑戰，需要調整策略，但不要輕易放棄。',
      '挑戰的環境是考驗，也是成長的機會，要學會在困難中前進。',
      '面對挑戰的環境，要保持冷靜，尋找突破口，化危機為轉機。'
    ]
  };
  
  advice.push(
    environmentAdvice[calculation.environmentAdaptation][
      Math.floor(Math.random() * environmentAdvice[calculation.environmentAdaptation].length)
    ]
  );
  
  // 3.3 基於人際動態的建議
  const relationshipAdvice: Record<typeof calculation.relationshipDynamics, string[]> = {
    '和諧': [
      '人際關係和諧，要珍惜這種狀態，同時也要思考如何維持。',
      '和諧的關係是寶貴的資源，要善用這些支持，但也要給予回饋。',
      '在和諧的關係中，要思考如何深化連結，建立更穩固的基礎。'
    ],
    '平衡': [
      '人際關係需要保持平衡，不要過度依賴或過度疏離。',
      '平衡的關係狀態需要你主動維護，找到合適的互動方式。',
      '在平衡的關係中，要思考如何進一步發展，但不要破壞現有的和諧。'
    ],
    '緊張': [
      '人際關係有些緊張，需要調整互動方式，但不要完全逃避。',
      '緊張的關係需要溝通和理解，嘗試從對方的角度思考問題。',
      '面對緊張的關係，要保持冷靜，尋找解決方案，而不是加劇衝突。'
    ]
  };
  
  advice.push(
    relationshipAdvice[calculation.relationshipDynamics][
      Math.floor(Math.random() * relationshipAdvice[calculation.relationshipDynamics].length)
    ]
  );
  
  // 3.4 基於變數影響的建議
  if (calculation.variableImpact === '重大') {
    if (variableCard.direction > 0) {
      advice.push(`「${variableCard.name}」帶來重大轉機，要把握這個機會，但也要思考如何維持。`);
    } else {
      advice.push(`「${variableCard.name}」帶來重大衝擊，要保護核心價值，同時尋找轉機。`);
    }
  } else if (calculation.variableImpact === '中等') {
    advice.push(`「${variableCard.name}」的影響中等，需要${variableCard.direction > 0 ? '把握機會' : '謹慎應對'}，但不必過度反應。`);
  }
  
  // 3.5 基於特殊組合的建議
  if (calculation.specialCombinations.includes('轉折點')) {
    advice.push('這是一個關鍵轉折點，你的選擇很重要，要相信自己的判斷。');
  } else if (calculation.specialCombinations.includes('重生契機')) {
    advice.push('從低谷中看到重生的機會，不要害怕重新開始，這可能是更好的開始。');
  } else if (calculation.specialCombinations.includes('危機四伏')) {
    advice.push('危機四伏的時刻，要保持冷靜，尋找突破口，危機中往往藏著轉機。');
  } else if (calculation.specialCombinations.includes('深度內省')) {
    advice.push('這是深度內省的時機，要好好思考自己的方向，不要急於行動。');
  }
  
  // 3.6 基於運勢方向的建議
  if (calculation.fortuneDirection === '上升') {
    advice.push('運勢正在上升，要把握機會，但也要保持謙遜，不要過度自信。');
  } else if (calculation.fortuneDirection === '下降') {
    advice.push('運勢暫時下降，這是調整和準備的好時機，不要灰心，轉機即將到來。');
  } else {
    advice.push('運勢處於持平狀態，需要耐心等待，同時也要主動創造機會。');
  }
  
  // 3.7 基於關鍵主題的建議（從關鍵詞中提取）
  if (calculation.keyThemes.includes('轉折') || calculation.keyThemes.includes('轉機')) {
    advice.push('你正處於一個轉折點，要仔細思考每個選擇的後果。');
  }
  if (calculation.keyThemes.includes('重新') || calculation.keyThemes.includes('重新開始')) {
    advice.push('這是一個重新開始的機會，不要被過去的失敗束縛。');
  }
  if (calculation.keyThemes.includes('平衡')) {
    advice.push('平衡是關鍵，要學會在不同力量之間找到平衡點。');
  }
  
  // 4. 結語（根據時間預測和特殊組合）
  const closingTemplates: Record<TimePrediction, string[]> = {
    '短期': [
      '在未來一週內，這些影響會逐漸顯現，你需要密切關注局勢的變化。',
      '短期內，這些卡牌所揭示的趨勢將開始發揮作用，保持警覺很重要。',
      '接下來幾天是關鍵的觀察期，你的每個決定都可能影響結果。',
      '在未來一週，這些能量將開始流動，要準備好應對變化。',
      '短期來看，這些因素會快速顯現，需要你靈活應對。'
    ],
    '中期': [
      '在未來一個月內，這些趨勢會持續發展，你需要有耐心等待結果。',
      '中期來看，這些卡牌所揭示的狀態將逐漸穩定，這是建立基礎的時期。',
      '這個月是重要的轉換期，你的行動將決定未來的走向。',
      '在未來一個月，這些影響會逐漸深化，要保持持續的關注。',
      '中期階段，這些能量會持續作用，需要你堅持和調整。'
    ],
    '長期': [
      '這是一個長期的趨勢，需要持續關注，你的堅持將帶來回報。',
      '長期來看，這些影響會逐漸深化，現在的努力將在未來開花結果。',
      '未來幾個月是重要的發展階段，要為長遠目標做好規劃。',
      '這是一個持續的過程，需要你保持耐心和毅力。',
      '長期趨勢已經形成，你的選擇將影響未來很長一段時間。'
    ]
  };
  
  let closing = closingTemplates[calculation.timePrediction][
    Math.floor(Math.random() * closingTemplates[calculation.timePrediction].length)
  ];
  
  // 如果有特殊組合，調整結語
  if (calculation.specialCombinations.includes('轉折點')) {
    closing = '這是一個關鍵的轉折點，你的選擇將決定未來的方向，要謹慎思考。';
  } else if (calculation.specialCombinations.includes('重生契機')) {
    closing = '從低谷中看到重生的機會，未來將是重新開始的旅程。';
  }
  
  // 5. 多維度分析摘要
  const dimensionLabels = {
    energyFlow: { '充沛': '能量充沛', '穩定': '能量穩定', '低弱': '能量低弱', '波動': '能量波動' },
    environmentAdaptation: { '有利': '環境有利', '中性': '環境中性', '挑戰': '環境挑戰' },
    relationshipDynamics: { '和諧': '關係和諧', '平衡': '關係平衡', '緊張': '關係緊張' },
    variableImpact: { '重大': '變數重大', '中等': '變數中等', '輕微': '變數輕微' }
  };
  
  return { 
    opening, 
    analysis, 
    advice, 
    closing,
    dimensions: {
      energyFlow: dimensionLabels.energyFlow[calculation.energyFlow],
      environmentAdaptation: dimensionLabels.environmentAdaptation[calculation.environmentAdaptation],
      relationshipDynamics: dimensionLabels.relationshipDynamics[calculation.relationshipDynamics],
      variableImpact: dimensionLabels.variableImpact[calculation.variableImpact]
    },
    keyThemes: calculation.keyThemes
  };
}

