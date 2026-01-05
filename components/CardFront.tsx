import { CardWeight } from '@/types/card';

interface CardFrontProps {
  card: CardWeight;
}

const categoryColors: Record<CardWeight['category'], { border: string; label: string }> = {
  天: { border: 'border-sky-end', label: '天' },
  地: { border: 'border-earth-end', label: '地' },
  人: { border: 'border-human-end', label: '人' },
  變數: { border: 'border-variable-end', label: '變數' }
};

const categoryLabels: Record<CardWeight['category'], string> = {
  天: '天（節氣）',
  地: '地（空間）',
  人: '人（角色）',
  變數: '變數（意外）'
};

export default function CardFront({ card }: CardFrontProps) {
  const categoryStyle = categoryColors[card.category];
  const label = categoryLabels[card.category];

  return (
    <div className={`w-full h-full rounded-card bg-paper border-2 ${categoryStyle.border} p-4 md:p-5 flex flex-col shadow-lg overflow-hidden`}>
      {/* 類別標籤 */}
      <div className="text-ink-medium text-[0.72rem] md:text-xs font-medium mb-2.5 border-b border-ink-light pb-1.5 flex-shrink-0">
        {label}
      </div>
      
      {/* 卡牌名稱 */}
      <div className="text-ink-dark text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center flex-shrink-0">
        {card.name}
      </div>
      
      {/* 資訊A（天意）和資訊B（自問） */}
      <div className="flex-1 flex flex-col justify-start mb-3.5 space-y-3.5 overflow-y-auto min-h-0">
        <div className="flex-shrink-0">
          <div className="text-ink-light text-[0.72rem] mb-1.5 font-medium">天意</div>
          <div className="text-ink-dark text-xs md:text-sm leading-relaxed">
            {card.infoA}
          </div>
        </div>
        
        {/* 資訊B（自問） */}
        <div className="flex-shrink-0">
          <div className="text-ink-light text-[0.72rem] mb-1.5 font-medium">自問</div>
          <div className="text-ink-medium text-xs md:text-sm italic leading-relaxed pl-2.5 md:pl-3.5 border-l-2 border-ink-light">
            {card.infoB}
          </div>
        </div>
      </div>
      
      {/* 關鍵詞 */}
      <div className="mt-auto pt-2.5 border-t border-ink-light flex-shrink-0">
        <div className="text-ink-light text-[0.72rem] mb-1.5">關鍵詞</div>
        <div className="flex flex-wrap gap-1 md:gap-1.5">
          {card.keywords.map((keyword, index) => (
            <span
              key={index}
              className="text-ink-medium text-[0.72rem] px-2 md:px-2.5 py-0.5 bg-ink-light/20 rounded-full border border-ink-light/30"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

