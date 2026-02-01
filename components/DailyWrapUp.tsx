
import React, { useEffect, useState } from 'react';
import { ScheduleEvent, BioMetricPoint } from '../types';
import { X, Share2, Zap, CheckCircle2, Clock, Battery, ArrowUpRight, Sparkles } from 'lucide-react';
import { MOCK_BIO_DATA } from '../constants';
import { calculateEnergyDelta } from '../utils';

interface DailyWrapUpProps {
  events: ScheduleEvent[];
  onClose: () => void;
}

const DailyWrapUp: React.FC<DailyWrapUpProps> = ({ events, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // --- Calculations ---
  const completedEvents = events.filter(e => e.completed);
  const totalFocusTime = completedEvents.reduce((acc, curr) => acc + curr.duration, 0);
  const totalLoad = completedEvents.reduce((acc, curr) => acc + (curr.duration * curr.intensity), 0);
  
  // Determine Day Type
  let dayType = "Rest & Recovery";
  let dayDesc = "你今天给了身心充分的休息，为明天的挑战积蓄了能量。";
  let themeColor = "text-emerald-500";
  let bgGradient = "from-emerald-500/20 to-teal-500/20";

  if (totalLoad > 20) {
    dayType = "Peak Performance";
    dayDesc = "不可思议的一天！你征服了高强度挑战，彻底释放了潜能。";
    themeColor = "text-indigo-500";
    bgGradient = "from-indigo-500/20 to-purple-500/20";
  } else if (totalLoad > 10) {
    dayType = "Balanced Flow";
    dayDesc = "如水般顺畅。你在产出与消耗之间找到了完美的平衡点。";
    themeColor = "text-blue-500";
    bgGradient = "from-blue-500/20 to-cyan-500/20";
  }

  // Energy Curve Path for SVG
  const generatePath = () => {
    const points = MOCK_BIO_DATA.map((p, i) => {
      const x = (i / 23) * 100;
      const y = 100 - p.energyLevel;
      return `${x},${y}`;
    });
    return `M0,100 L0,${100 - MOCK_BIO_DATA[0].energyLevel} ${points.map((p, i) => `L${(i / 23) * 100},${100 - MOCK_BIO_DATA[i].energyLevel}`).join(' ')} L100,100 Z`;
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Scroll Container (The "Roll") */}
      <div 
        className={`w-full max-w-md h-[90vh] sm:h-[85vh] bg-[#F5F5F7] dark:bg-[#000] rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-y-auto no-scrollbar relative transition-transform duration-500 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Close Button */}
        <button 
          onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md flex items-center justify-center text-slate-500 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/20 transition-all"
        >
          <X size={20} />
        </button>

        {/* Content Wrapper */}
        <div className="flex flex-col min-h-full">
          
          {/* Header Section */}
          <div className="relative pt-20 pb-10 px-8 overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b ${bgGradient} opacity-30`} />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/20 blur-[50px] rounded-full" />
            
            <div className="relative z-10">
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-white/40 mb-2">
                October 24, 2023
              </div>
              <h1 className={`text-4xl font-bold leading-tight mb-4 ${themeColor} dark:text-white`}>
                {dayType}
              </h1>
              <p className="text-slate-600 dark:text-white/70 font-medium leading-relaxed">
                {dayDesc}
              </p>
            </div>
          </div>

          {/* Energy Graph Card */}
          <div className="px-6 mb-6">
            <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider">能量波动</h3>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 px-2 py-1 rounded-md">
                   <Battery size={12} />
                   <span>92% 终值</span>
                </div>
              </div>
              
              <div className="h-32 w-full relative">
                 <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" className={themeColor} stopOpacity="0.5" />
                        <stop offset="100%" stopColor="currentColor" className={themeColor} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={generatePath()} fill="url(#chartGradient)" className="transition-all duration-1000" />
                    <path d={generatePath().replace('L100,100 Z', '')} fill="none" stroke="currentColor" strokeWidth="2" className={themeColor} strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="px-6 mb-6 grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col justify-between h-32">
               <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-500 mb-2">
                 <Clock size={16} />
               </div>
               <div>
                 <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalFocusTime}<span className="text-sm font-normal text-slate-400 ml-1">h</span></div>
                 <div className="text-xs font-medium text-slate-500 dark:text-white/40">深度专注</div>
               </div>
            </div>
            
            <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col justify-between h-32">
               <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-2">
                 <CheckCircle2 size={16} />
               </div>
               <div>
                 <div className="text-2xl font-bold text-slate-900 dark:text-white">{completedEvents.length}<span className="text-sm font-normal text-slate-400 ml-1">项</span></div>
                 <div className="text-xs font-medium text-slate-500 dark:text-white/40">任务完成</div>
               </div>
            </div>

            <div className="col-span-2 bg-white dark:bg-[#1c1c1e] rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">能量转化率</div>
                        <div className="text-xs text-slate-500 dark:text-white/40">较昨日提升 15%</div>
                    </div>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">A+</div>
            </div>
          </div>

          {/* Zen Quote Footer */}
          <div className="px-6 mb-12">
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 rounded-[2rem] p-8 text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-4 relative z-10" fill="currentColor" />
                <blockquote className="text-white dark:text-slate-900 font-serif text-lg italic leading-relaxed relative z-10 mb-4">
                  "且将新火试新茶，诗酒趁年华。"
                </blockquote>
                <div className="text-white/60 dark:text-slate-900/60 text-xs font-bold uppercase tracking-widest relative z-10">
                  — 苏轼
                </div>
            </div>
          </div>

          {/* Share Button (Sticky Bottom) */}
          <div className="sticky bottom-0 p-6 bg-gradient-to-t from-[#F5F5F7] via-[#F5F5F7] to-transparent dark:from-black dark:via-black">
             <button className="w-full py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-lg shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                <Share2 size={20} />
                <span>保存能量胶卷</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DailyWrapUp;
