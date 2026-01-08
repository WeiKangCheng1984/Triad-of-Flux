import { Situation, SituationResult } from '@/types/situation';
import { CardWeight } from '@/types/card';

// 情境化解讀模板
const interpretationTemplates: Record<string, {
  opening: (situation: Situation) => string;
  analysis: (cards: CardWeight[], situation: Situation) => string;
  advice: (cards: CardWeight[], situation: Situation) => string[];
  closing: (situation: Situation) => string;
}> = {
  work: {
    opening: () => '在工作事業方面，',
    analysis: (cards, situation) => {
      const energyAvg = cards.reduce((sum, c) => sum + c.energy, 0) / cards.length;
      const impactAvg = cards.reduce((sum, c) => sum + c.impact, 0) / cards.length;
      const directionSum = cards.reduce((sum, c) => sum + c.direction, 0);
      
      let analysis = '';
      
      if (energyAvg >= 7) {
        analysis += '你目前的工作能量充沛，';
      } else if (energyAvg >= 5) {
        analysis += '你的工作狀態相對穩定，';
      } else {
        analysis += '你的工作能量需要恢復，';
      }
      
      if (directionSum > 0) {
        analysis += '整體趨勢是積極向上的。';
      } else if (directionSum < 0) {
        analysis += '但面臨一些挑戰需要克服。';
      } else {
        analysis += '處於一個需要調整的階段。';
      }
      
      // 根據卡牌關鍵詞添加具體分析
      const workKeywords = cards.flatMap(c => c.keywords).filter(k => 
        ['忙碌', '領導', '競爭', '機會', '擴張'].includes(k)
      );
      
      if (workKeywords.length > 0) {
        analysis += `從卡牌中可以看到${workKeywords[0]}的跡象，`;
      }
      
      return analysis;
    },
    advice: (cards, situation) => {
      const advice: string[] = [];
      const energyAvg = cards.reduce((sum, c) => sum + c.energy, 0) / cards.length;
      const directionSum = cards.reduce((sum, c) => sum + c.direction, 0);
      
      if (energyAvg >= 7 && directionSum > 0) {
        advice.push('把握當前的工作機會，積極展現你的能力');
        advice.push('可以考慮承擔更多責任或挑戰新項目');
      } else if (energyAvg < 5) {
        advice.push('需要調整工作節奏，給自己充分的休息時間');
        advice.push('考慮與上司溝通，尋求工作負擔的平衡');
      } else if (directionSum < 0) {
        advice.push('面對工作挑戰時，保持冷靜和理性');
        advice.push('尋求同事或導師的建議和支持');
      } else {
        advice.push('保持當前的工作節奏，持續累積經驗');
        advice.push('關注長期發展，不要急於求成');
      }
      
      return advice;
    },
    closing: () => '在工作上，保持專注和耐心，相信你的努力會帶來回報。'
  },
  
  love: {
    opening: () => '在感情關係方面，',
    analysis: (cards, situation) => {
      const humanCards = cards.filter(c => c.category === '人');
      const directionSum = cards.reduce((sum, c) => sum + c.direction, 0);
      
      let analysis = '';
      
      if (humanCards.length > 0) {
        const role = humanCards[0].name;
        analysis += `你在關係中扮演著「${role}」的角色，`;
      }
      
      if (directionSum > 0) {
        analysis += '關係發展趨勢是積極的，';
      } else if (directionSum < 0) {
        analysis += '關係面臨一些考驗，';
      } else {
        analysis += '關係處於一個需要溝通的階段，';
      }
      
      const loveKeywords = cards.flatMap(c => c.keywords).filter(k =>
        ['溫暖', '相遇', '和諧', '距離', '衝突'].includes(k)
      );
      
      if (loveKeywords.length > 0) {
        analysis += `卡牌顯示${loveKeywords[0]}的狀態。`;
      }
      
      return analysis;
    },
    advice: (cards, situation) => {
      const advice: string[] = [];
      const directionSum = cards.reduce((sum, c) => sum + c.direction, 0);
      const hasConflict = cards.some(c => c.keywords.includes('衝突'));
      const hasDistance = cards.some(c => c.keywords.includes('距離'));
      
      if (directionSum > 0 && !hasConflict) {
        advice.push('珍惜當下的關係，繼續深化彼此的了解');
        advice.push('可以計劃一些共同活動，增進感情');
      } else if (hasConflict) {
        advice.push('面對衝突時，保持冷靜和同理心');
        advice.push('嘗試站在對方的角度思考問題');
      } else if (hasDistance) {
        advice.push('如果感到距離，主動溝通表達你的感受');
        advice.push('給彼此一些空間，但不要完全疏遠');
      } else {
        advice.push('關係需要時間和耐心來發展');
        advice.push('保持開放的心態，接受關係的自然流動');
      }
      
      return advice;
    },
    closing: () => '在感情中，真誠和溝通是維繫關係的關鍵。'
  },
  
  health: {
    opening: () => '在健康狀態方面，',
    analysis: (cards, situation) => {
      const energyAvg = cards.reduce((sum, c) => sum + c.energy, 0) / cards.length;
      const hasRest = cards.some(c => c.keywords.includes('休息') || c.keywords.includes('恢復'));
      const hasPressure = cards.some(c => c.keywords.includes('壓力') || c.keywords.includes('煩躁'));
      
      let analysis = '';
      
      if (energyAvg >= 7 && !hasPressure) {
        analysis += '你的身體能量充沛，健康狀態良好，';
      } else if (energyAvg < 5 || hasPressure) {
        analysis += '你的身體能量需要恢復，可能面臨壓力過大的情況，';
      } else {
        analysis += '你的健康狀態相對穩定，';
      }
      
      if (hasRest) {
        analysis += '需要充分的休息和恢復。';
      } else if (hasPressure) {
        analysis += '需要減壓和放鬆。';
      } else {
        analysis += '保持當前的健康習慣。';
      }
      
      return analysis;
    },
    advice: (cards, situation) => {
      const advice: string[] = [];
      const energyAvg = cards.reduce((sum, c) => sum + c.energy, 0) / cards.length;
      const hasPressure = cards.some(c => c.keywords.includes('壓力'));
      
      if (energyAvg < 5) {
        advice.push('確保充足的睡眠和休息時間');
        advice.push('調整生活節奏，避免過度勞累');
      } else if (hasPressure) {
        advice.push('學習減壓技巧，如冥想、運動或深呼吸');
        advice.push('考慮尋求專業的心理健康支持');
      } else {
        advice.push('保持規律的作息和健康的飲食習慣');
        advice.push('適度的運動有助於維持身體能量');
      }
      
      return advice;
    },
    closing: () => '健康是生活的基礎，照顧好自己的身心是最重要的投資。'
  },
  
  growth: {
    opening: () => '在個人成長方面，',
    analysis: (cards, situation) => {
      const hasStart = cards.some(c => c.keywords.includes('啟動') || c.keywords.includes('新生'));
      const hasBreakthrough = cards.some(c => c.keywords.includes('突破') || c.keywords.includes('轉折'));
      const directionSum = cards.reduce((sum, c) => sum + c.direction, 0);
      
      let analysis = '';
      
      if (hasStart) {
        analysis += '你正處於成長的啟動階段，';
      } else if (hasBreakthrough) {
        analysis += '你即將迎來成長的突破，';
      } else {
        analysis += '你的成長之路正在穩步前進，';
      }
      
      if (directionSum > 0) {
        analysis += '發展趨勢是積極向上的。';
      } else {
        analysis += '需要持續的努力和堅持。';
      }
      
      return analysis;
    },
    advice: (cards, situation) => {
      const advice: string[] = [];
      const hasStart = cards.some(c => c.keywords.includes('啟動'));
      const hasBreakthrough = cards.some(c => c.keywords.includes('突破'));
      
      if (hasStart) {
        advice.push('把握成長的啟動時機，開始行動');
        advice.push('設定明確的學習目標和計劃');
      } else if (hasBreakthrough) {
        advice.push('勇敢面對成長的挑戰，突破舒適圈');
        advice.push('尋求導師或同儕的支持和指導');
      } else {
        advice.push('持續學習和實踐，累積成長經驗');
        advice.push('保持耐心，成長是一個漸進的過程');
      }
      
      return advice;
    },
    closing: () => '成長是一生的旅程，每一步都值得珍惜。'
  },
  
  finance: {
    opening: () => '在財務狀況方面，',
    analysis: (cards, situation) => {
      const hasResource = cards.some(c => c.keywords.includes('資源') || c.keywords.includes('禮物'));
      const hasRisk = cards.some(c => c.keywords.includes('風險') || c.keywords.includes('陷阱'));
      const directionSum = cards.reduce((sum, c) => sum + c.direction, 0);
      
      let analysis = '';
      
      if (hasResource && directionSum > 0) {
        analysis += '財務資源正在累積，';
      } else if (hasRisk) {
        analysis += '需要謹慎管理財務，避免風險，';
      } else {
        analysis += '財務狀況相對穩定，';
      }
      
      analysis += '需要理性規劃和管理。';
      
      return analysis;
    },
    advice: (cards, situation) => {
      const advice: string[] = [];
      const hasResource = cards.some(c => c.keywords.includes('資源'));
      const hasRisk = cards.some(c => c.keywords.includes('風險') || c.keywords.includes('陷阱'));
      
      if (hasResource) {
        advice.push('善用現有資源，進行理性的財務規劃');
        advice.push('考慮長期投資，但要做好風險評估');
      } else if (hasRisk) {
        advice.push('謹慎處理財務決策，避免衝動投資');
        advice.push('建立緊急預備金，應對突發狀況');
      } else {
        advice.push('保持穩健的理財策略，持續累積財富');
        advice.push('定期檢視財務狀況，調整理財計劃');
      }
      
      return advice;
    },
    closing: () => '財務管理需要理性和耐心，穩健的規劃勝過冒險。'
  },
  
  social: {
    opening: () => '在人際關係方面，',
    analysis: (cards, situation) => {
      const humanCards = cards.filter(c => c.category === '人');
      const hasConflict = cards.some(c => c.keywords.includes('衝突'));
      const hasHarmony = cards.some(c => c.keywords.includes('和諧') || c.keywords.includes('平衡'));
      
      let analysis = '';
      
      if (humanCards.length > 0) {
        const role = humanCards[0].name;
        analysis += `你在人際中扮演「${role}」的角色，`;
      }
      
      if (hasHarmony) {
        analysis += '人際關係整體和諧，';
      } else if (hasConflict) {
        analysis += '人際關係面臨一些衝突，';
      } else {
        analysis += '人際關係處於動態平衡中，';
      }
      
      analysis += '需要持續的溝通和理解。';
      
      return analysis;
    },
    advice: (cards, situation) => {
      const advice: string[] = [];
      const hasConflict = cards.some(c => c.keywords.includes('衝突'));
      const hasHarmony = cards.some(c => c.keywords.includes('和諧'));
      
      if (hasHarmony) {
        advice.push('珍惜現有的人際關係，繼續深化連結');
        advice.push('可以主動組織活動，增進彼此了解');
      } else if (hasConflict) {
        advice.push('面對衝突時，保持冷靜和同理心');
        advice.push('嘗試理解對方的立場，尋求共識');
      } else {
        advice.push('保持開放的心態，主動建立新的連結');
        advice.push('在人際互動中，真誠和尊重是關鍵');
      }
      
      return advice;
    },
    closing: () => '良好的人際關係需要時間和用心經營。'
  },
  
  creative: {
    opening: () => '在創意靈感方面，',
    analysis: (cards, situation) => {
      const hasSpark = cards.some(c => c.keywords.includes('火花') || c.keywords.includes('靈感'));
      const hasBreakthrough = cards.some(c => c.keywords.includes('突破') || c.keywords.includes('創新'));
      const energyAvg = cards.reduce((sum, c) => sum + c.energy, 0) / cards.length;
      
      let analysis = '';
      
      if (hasSpark) {
        analysis += '創意靈感正在湧現，';
      } else if (hasBreakthrough) {
        analysis += '即將迎來創意突破，';
      } else {
        analysis += '創意狀態需要激發，';
      }
      
      if (energyAvg >= 7) {
        analysis += '創意能量充沛，適合積極創作。';
      } else {
        analysis += '需要放鬆和休息來恢復創意能量。';
      }
      
      return analysis;
    },
    advice: (cards, situation) => {
      const advice: string[] = [];
      const hasSpark = cards.some(c => c.keywords.includes('火花') || c.keywords.includes('靈感'));
      const energyAvg = cards.reduce((sum, c) => sum + c.energy, 0) / cards.length;
      
      if (hasSpark && energyAvg >= 7) {
        advice.push('把握靈感湧現的時機，積極創作');
        advice.push('不要害怕嘗試新的創意方向');
      } else if (energyAvg < 5) {
        advice.push('給自己一些休息時間，讓創意能量恢復');
        advice.push('可以通過閱讀、旅行或觀察來尋找靈感');
      } else {
        advice.push('持續練習和探索，累積創意經驗');
        advice.push('保持對新事物的好奇心');
      }
      
      return advice;
    },
    closing: () => '創意需要時間和空間來孕育，保持開放的心態。'
  },
  
  decision: {
    opening: () => '在重大決策方面，',
    analysis: (cards, situation) => {
      const hasChoice = cards.some(c => c.keywords.includes('抉擇') || c.keywords.includes('方向'));
      const hasRisk = cards.some(c => c.keywords.includes('風險') || c.keywords.includes('陷阱'));
      const hasOpportunity = cards.some(c => c.keywords.includes('機會') || c.keywords.includes('轉機'));
      
      let analysis = '';
      
      if (hasChoice) {
        analysis += '你正站在重要的抉擇點，';
      } else {
        analysis += '決策環境需要仔細評估，';
      }
      
      if (hasOpportunity && !hasRisk) {
        analysis += '機會大於風險，可以積極考慮。';
      } else if (hasRisk) {
        analysis += '需要謹慎評估風險，做好準備。';
      } else {
        analysis += '需要更多資訊和時間來做決定。';
      }
      
      return analysis;
    },
    advice: (cards, situation) => {
      const advice: string[] = [];
      const hasRisk = cards.some(c => c.keywords.includes('風險') || c.keywords.includes('陷阱'));
      const hasOpportunity = cards.some(c => c.keywords.includes('機會'));
      
      if (hasOpportunity && !hasRisk) {
        advice.push('把握決策機會，但要做好充分的準備');
        advice.push('收集足夠的資訊，諮詢專業人士的意見');
      } else if (hasRisk) {
        advice.push('仔細評估決策的風險和後果');
        advice.push('制定應對計劃，準備好應對最壞情況');
      } else {
        advice.push('不要急於做決定，給自己充分的思考時間');
        advice.push('列出決策的利弊，尋求信任的人的建議');
      }
      
      return advice;
    },
    closing: () => '重大決策需要理性分析，但也要相信自己的直覺。'
  }
};

// 生成情境化解讀
export function generateSituationInterpretation(
  cards: CardWeight[],
  situation: Situation
): SituationResult['interpretation'] {
  const template = interpretationTemplates[situation.id];
  if (!template) {
    // 默認模板
    return {
      opening: `在${situation.name}方面，`,
      analysis: '卡牌顯示你需要關注這個領域的發展。',
      advice: ['保持耐心和專注', '尋求專業建議'],
      closing: '相信你的努力會帶來改變。',
      keyInsights: []
    };
  }
  
  const opening = template.opening(situation);
  const analysis = template.analysis(cards, situation);
  const advice = template.advice(cards, situation);
  const closing = template.closing(situation);
  
  // 提取關鍵洞察
  const keyInsights: string[] = [];
  cards.forEach(card => {
    if (card.intensity === 'extreme') {
      keyInsights.push(`${card.name}：這是一個關鍵時刻，需要特別關注`);
    }
    if (card.direction < 0 && card.impact >= 7) {
      keyInsights.push(`需要注意${card.name}帶來的挑戰`);
    }
  });
  
  return {
    opening,
    analysis,
    advice,
    closing,
    keyInsights: keyInsights.slice(0, 3) // 最多3個關鍵洞察
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
