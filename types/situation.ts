import { CardWeight } from './card';

export type SituationId = 
  | 'work'      // 工作事業
  | 'love'      // 感情關係
  | 'health'    // 健康狀態
  | 'growth'    // 個人成長
  | 'finance'   // 財務狀況
  | 'social'    // 人際關係
  | 'creative'  // 創意靈感
  | 'decision'; // 重大決策

export interface Situation {
  id: SituationId;
  name: string;
  description: string;
  icon: string;
  categoryWeights: {
    天: number;
    地: number;
    人: number;
    變數: number;
  };
  keywordMatches: string[];
  colorGradient: string; // Tailwind gradient classes
}

export interface SituationResult {
  situation: Situation;
  cards: CardWeight[];
  interpretation: {
    opening: string;
    analysis: string;
    advice: string[];
    closing: string;
    keyInsights: string[];
  };
  summary: {
    overallState: 'excellent' | 'good' | 'neutral' | 'challenging' | 'critical';
    energyLevel: 'high' | 'medium' | 'low';
    riskLevel: 'low' | 'medium' | 'high';
    opportunityLevel: 'high' | 'medium' | 'low';
  };
}
