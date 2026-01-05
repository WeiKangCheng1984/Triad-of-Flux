export type CardCategory = '天' | '地' | '人' | '變數';
export type Intensity = 'low' | 'medium' | 'high' | 'extreme';
export type FortuneLevel = '極差' | '不佳' | '普通' | '良好' | '極佳';
export type FortuneDirection = '下降' | '持平' | '上升';
export type TimePrediction = '短期' | '中期' | '長期';

export interface CardWeight {
  id: string;
  name: string;
  category: CardCategory;
  energy: number;      // 1-10
  impact: number;     // 1-10
  direction: number;  // -1, 0, 1
  temporal: number;   // 1, 2, 3
  keywords: string[];
  intensity: Intensity;
  infoA: string;      // 天意
  infoB: string;      // 自問
}

export interface FortuneCalculation {
  baseScore: number;
  interactionScore: number;
  totalScore: number;
  fortuneLevel: FortuneLevel;
  fortuneDirection: FortuneDirection;
  timePrediction: TimePrediction;
  // 多維度分析
  energyFlow: '充沛' | '穩定' | '低弱' | '波動';
  environmentAdaptation: '有利' | '中性' | '挑戰';
  relationshipDynamics: '和諧' | '平衡' | '緊張';
  variableImpact: '重大' | '中等' | '輕微';
  // 特殊組合標記
  specialCombinations: string[];
  // 關鍵主題
  keyThemes: string[];
}

export interface FortuneText {
  opening: string;
  analysis: string;
  advice: string[];
  closing: string;
  // 新增：多維度分析摘要
  dimensions?: {
    energyFlow: string;
    environmentAdaptation: string;
    relationshipDynamics: string;
    variableImpact: string;
  };
  // 新增：關鍵主題
  keyThemes?: string[];
}

export interface SingleCardResult {
  meaning: string;
  advice: string;
  context: string;
}

