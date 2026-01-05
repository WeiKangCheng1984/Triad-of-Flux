export default function CardBack() {
  return (
    <div className="w-full h-full rounded-card bg-paper border-2 border-ink flex items-center justify-center shadow-lg relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-ink rounded-full" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-ink rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-ink rounded-full" />
      </div>
      
      <div className="text-center relative z-10">
        <div className="text-ink-dark text-3xl md:text-4xl font-bold mb-3">
          天地人變
        </div>
        <div className="text-ink-medium text-base md:text-lg">卡牌</div>
        <div className="text-ink-light text-sm mt-4">
          點擊翻牌
        </div>
      </div>
    </div>
  );
}

