export default function CardBack() {
  return (
    <div className="w-full h-full rounded-card bg-paper border-2 border-ink flex items-center justify-center shadow-lg relative overflow-hidden">
      {/* 背景裝飾 - 極簡的圓形裝飾 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-ink rounded-full" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-ink rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-ink rounded-full" />
      </div>
      
      {/* 優雅的中央文字設計 - 直書 */}
      <div className="flex items-center justify-center relative z-10">
        <div className="text-ink-dark text-5xl md:text-6xl font-bold flex flex-col items-center justify-center leading-[1.2]">
          <span>天</span>
          <span>地</span>
          <span>人</span>
        </div>
      </div>
    </div>
  );
}

