'use client';

import { useEffect, useState } from 'react';

interface AnalysisResult {
  total: number;
  byLevel: Record<string, number>;
  byLevelPercent: Record<string, number>;
  scoreRange: {
    min: number;
    max: number;
    mean: number;
    median: number;
    stdDev: number;
  };
  directionDistribution: Record<string, number>;
  timeDistribution: Record<string, number>;
  scoreDistribution: Record<string, { min: number; max: number; count: number }>;
  uniformity: {
    expectedPercent: number;
    avgDeviation: number;
    maxDeviation: number;
    cv: number;
    assessment: string;
  };
}

export default function AnalyzePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analyze')
      .then(res => res.json())
      .then(data => {
        setResult(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('分析失敗:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-paper flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ink-light border-t-ink-dark rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-ink-medium">正在分析運勢分布...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen p-8 bg-paper flex items-center justify-center">
        <p className="text-ink-medium">分析失敗，請稍後再試</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-paper">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-ink-dark mb-8 text-center">運勢分布分析報告</h1>

        <div className="bg-paper-light p-6 md:p-8 rounded-card shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-ink-dark mb-4">總組合數</h2>
          <p className="text-3xl font-bold text-ink-medium">{result.total.toLocaleString()}</p>
        </div>

        <div className="bg-paper-light p-6 md:p-8 rounded-card shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-ink-dark mb-4">運勢等級分布</h2>
          <div className="space-y-4">
            {Object.entries(result.byLevel).map(([level, count]) => {
              const percent = result.byLevelPercent[level];
              const range = result.scoreDistribution[level];
              return (
                <div key={level} className="border-b border-ink-light pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-ink-dark">{level}</span>
                    <span className="text-ink-medium">
                      {count.toLocaleString()} ({percent.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="w-full bg-ink-light/20 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-start to-sky-end h-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="text-sm text-ink-light mt-1">
                    分數範圍: [{range.min.toFixed(2)}, {range.max.toFixed(2)}]
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-paper-light p-6 rounded-card shadow-lg">
            <h2 className="text-xl font-bold text-ink-dark mb-4">分數統計</h2>
            <div className="space-y-2 text-ink-medium">
              <div>最小值: <span className="font-semibold">{result.scoreRange.min.toFixed(2)}</span></div>
              <div>最大值: <span className="font-semibold">{result.scoreRange.max.toFixed(2)}</span></div>
              <div>平均值: <span className="font-semibold">{result.scoreRange.mean.toFixed(2)}</span></div>
              <div>中位數: <span className="font-semibold">{result.scoreRange.median.toFixed(2)}</span></div>
              <div>標準差: <span className="font-semibold">{result.scoreRange.stdDev.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="bg-paper-light p-6 rounded-card shadow-lg">
            <h2 className="text-xl font-bold text-ink-dark mb-4">均勻性分析</h2>
            <div className="space-y-2 text-ink-medium">
              <div>理論均勻分布: <span className="font-semibold">{result.uniformity.expectedPercent.toFixed(2)}%</span></div>
              <div>平均偏差: <span className="font-semibold">{result.uniformity.avgDeviation.toFixed(2)}%</span></div>
              <div>最大偏差: <span className="font-semibold">{result.uniformity.maxDeviation.toFixed(2)}%</span></div>
              <div>變異係數: <span className="font-semibold">{result.uniformity.cv.toFixed(2)}%</span></div>
              <div className="mt-4">
                <span className="font-semibold text-ink-dark">評估: </span>
                <span className={
                  result.uniformity.avgDeviation < 5 ? 'text-green-600' :
                  result.uniformity.avgDeviation < 10 ? 'text-yellow-600' :
                  'text-red-600'
                }>
                  {result.uniformity.assessment === '均勻' ? '✅ 分布相當均勻' :
                   result.uniformity.assessment === '略有不均' ? '⚠️ 分布略有不均' :
                   '❌ 分布明顯不均'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-paper-light p-6 rounded-card shadow-lg">
            <h2 className="text-xl font-bold text-ink-dark mb-4">運勢方向分布</h2>
            <div className="space-y-3">
              {Object.entries(result.directionDistribution).map(([direction, count]) => {
                const percent = (count / result.total) * 100;
                return (
                  <div key={direction}>
                    <div className="flex justify-between mb-1">
                      <span className="text-ink-medium">{direction}</span>
                      <span className="text-ink-medium">
                        {count.toLocaleString()} ({percent.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="w-full bg-ink-light/20 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-earth-start to-earth-end h-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-paper-light p-6 rounded-card shadow-lg">
            <h2 className="text-xl font-bold text-ink-dark mb-4">時間預測分布</h2>
            <div className="space-y-3">
              {Object.entries(result.timeDistribution).map(([time, count]) => {
                const percent = (count / result.total) * 100;
                return (
                  <div key={time}>
                    <div className="flex justify-between mb-1">
                      <span className="text-ink-medium">{time}</span>
                      <span className="text-ink-medium">
                        {count.toLocaleString()} ({percent.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="w-full bg-ink-light/20 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-human-start to-human-end h-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

