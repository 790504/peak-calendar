
import React, { useState } from 'react';
import { RefreshCw, Quote, Heart, ScrollText } from 'lucide-react';
import DailyWrapUp from '../components/DailyWrapUp';
import { ScheduleEvent } from '../types';

interface ZenViewProps {
  events?: ScheduleEvent[];
}

const QUOTES = [
  { text: "纵有疾风起，人生不言弃。", author: "保罗·瓦勒里", context: "勇气" },
  { text: "且将新火试新茶，诗酒趁年华。", author: "苏轼", context: "当下" },
  { text: "生活明朗，万物可爱。", author: "季羡林", context: "心境" },
  { text: "保持热爱，奔赴山海。", author: "佚名", context: "热情" },
  { text: "满怀希望，就会所向披靡。", author: "《千与千寻》", context: "希望" },
  { text: "人不是活一辈子，不是活几年几月，而是活那么几个瞬间。", author: "帕斯捷尔纳克", context: "时刻" },
  { text: "既然选择了远方，便只顾风雨兼程。", author: "汪国真", context: "坚持" },
  { text: "种一棵树最好的时间是十年前，其次是现在。", author: "丹比萨·莫约", context: "行动" }
];

const ZenView: React.FC<ZenViewProps> = ({ events = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showWrapUp, setShowWrapUp] = useState(false);

  const handleNext = () => {
    setIsAnimating(true);
    setLiked(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
      setIsAnimating(false);
    }, 500);
  };

  const currentQuote = QUOTES[currentIndex];

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 z-10 relative pb-20">
      
      {showWrapUp && (
        <DailyWrapUp events={events} onClose={() => setShowWrapUp(false)} />
      )}

      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-teal-100/50 dark:bg-teal-900/20 rounded-full blur-[60px] animate-pulse-slow"></div>
      <div className="absolute bottom-40 left-10 w-40 h-40 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-[60px] animate-pulse"></div>

      <div className="w-full max-w-sm relative">
        {/* Main Card */}
        <div 
          className={`
            bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 backdrop-blur-2xl rounded-[3rem] p-8 shadow-2xl shadow-slate-200/60 dark:shadow-none relative overflow-hidden transition-all duration-500 ease-in-out
            ${isAnimating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}
          `}
        >
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          {/* Quote Icon */}
          <div className="absolute top-8 left-8 text-slate-200 dark:text-white/10">
            <Quote size={48} />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center mt-6">
            <div className="mb-8 mt-4">
              <span className="text-[10px] font-bold tracking-[0.2em] text-teal-600 dark:text-teal-300 uppercase border border-teal-200 dark:border-teal-800 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30">
                {currentQuote.context}
              </span>
            </div>

            <h2 className="text-2xl font-light text-slate-800 dark:text-white leading-relaxed tracking-wide font-serif italic mb-8">
              “ {currentQuote.text} ”
            </h2>

            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/20 to-transparent mb-6"></div>

            <p className="text-sm text-slate-400 dark:text-white/50 font-bold tracking-widest uppercase">
              {currentQuote.author}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-12">
          <button 
            onClick={() => setLiked(!liked)}
            className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 shadow-md ${liked ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800 text-rose-500 dark:text-rose-400 shadow-rose-100 dark:shadow-none' : 'bg-white dark:bg-white/5 border-white dark:border-white/10 text-slate-300 dark:text-white/20 hover:text-slate-500 dark:hover:text-white/60 shadow-slate-100 dark:shadow-none'}`}
          >
            <Heart size={20} fill={liked ? "currentColor" : "none"} />
          </button>
          
          <button 
            onClick={handleNext}
            className="w-14 h-14 rounded-full bg-white dark:bg-white/5 border border-white dark:border-white/10 flex items-center justify-center text-slate-300 dark:text-white/20 hover:text-slate-800 dark:hover:text-white hover:rotate-180 transition-all duration-500 shadow-md shadow-slate-100 dark:shadow-none"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Nightly Ritual Trigger */}
        <div className="mt-12 flex justify-center">
            <button 
                onClick={() => setShowWrapUp(true)}
                className="group flex flex-col items-center gap-2 text-slate-400 dark:text-white/40 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
                <div className="w-12 h-12 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30 transition-all">
                    <ScrollText size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0">
                    生成今日胶卷
                </span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default ZenView;
