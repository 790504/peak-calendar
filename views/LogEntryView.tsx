
import React, { useState, useRef, useEffect } from 'react';
import { getInterpolatedColor, COLOR_SCALE } from '../utils';
import { CheckCircle2, BarChart2 } from 'lucide-react';

interface LogEntryViewProps {
  onLog?: (level: number) => void;
}

const LogEntryView: React.FC<LogEntryViewProps> = ({ onLog }) => {
  const [level, setLevel] = useState(50);
  const [saved, setSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    if (onLog) onLog(level);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getLabel = (val: number) => {
    const match = COLOR_SCALE.find((s, i) => {
        const next = COLOR_SCALE[i+1];
        if (!next) return true;
        return val <= (s.val + next.val) / 2;
    });
    return match ? match.label : "状态平稳";
  };

  // --- Pointer Event Handlers for Smooth Dragging (Mouse & Touch) ---
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateLevelFromPointer(e);
    // Capture pointer to track movement even outside the div
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateLevelFromPointer(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const updateLevelFromPointer = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Calculate height from bottom
    const y = e.clientY - rect.top;
    const height = rect.height;
    // Invert because Y goes down, but we want level 0 at bottom
    let percentage = 1 - (y / height);
    
    // Clamp
    percentage = Math.max(0, Math.min(1, percentage));
    
    setLevel(Math.round(percentage * 100));
  };

  const currentColor = getInterpolatedColor(level);
  const isDarkColor = (val: number) => val < 90;

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 z-10 relative select-none">
      
      {/* Success Toast Notification */}
      <div className={`absolute top-24 left-1/2 transform -translate-x-1/2 transition-all duration-500 z-50 w-full max-w-xs ${saved ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-slate-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} className="text-white" />
            </div>
            <div>
                <h4 className="font-bold text-sm">记录成功</h4>
                <p className="text-xs opacity-80 mt-0.5">数据已同步至统计分析</p>
            </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 cursor-default">此刻感觉如何？</h2>
        <p className="text-slate-500 dark:text-white/50 font-medium cursor-default">拖动滑块记录能量，让算法更懂你。</p>
      </div>

      {/* Interactive Slider Container */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-32 h-96 bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-[3rem] p-2 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden cursor-grab active:cursor-grabbing touch-none"
      >
        {/* Fill Level */}
        <div 
          className="absolute bottom-0 left-0 right-0 rounded-[3rem] transition-all duration-75 ease-linear opacity-40 pointer-events-none"
          style={{ height: `${level}%`, backgroundColor: currentColor, filter: 'blur(20px)' }}
        ></div>
         <div 
          className="absolute bottom-0 left-0 right-0 transition-all duration-75 ease-linear z-0 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] opacity-80 pointer-events-none"
          style={{ height: `${level}%`, backgroundColor: currentColor }}
        ></div>
        
        {/* Indicator Icon */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-10">
           <svg className={`w-8 h-8 transition-all duration-300 drop-shadow-md ${isDragging ? 'scale-125' : 'scale-100'} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
        </div>

        {/* Level Number Overlay (Visible when dragging) */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-4xl font-bold text-white drop-shadow-lg">{level}%</span>
        </div>
      </div>

      <div className="mt-8 text-center h-16">
        <div className={`text-4xl font-light text-slate-900 dark:text-white mb-1 transition-opacity duration-300 ${isDragging ? 'opacity-0' : 'opacity-100'}`} style={{ color: currentColor }}>
            {level}%
        </div>
        <div 
          className="text-sm uppercase tracking-widest font-bold transition-colors duration-300"
          style={{ color: currentColor }}
        >
          {getLabel(level)}
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saved}
        className={`mt-6 px-12 py-4 rounded-full font-bold transition-all duration-300 transform active:scale-95 shadow-lg dark:shadow-none text-white flex items-center gap-2 cursor-pointer hover:brightness-110`}
        style={{
             backgroundColor: saved ? '#10B981' : (isDarkColor(level) ? currentColor : '#0F172A'),
             boxShadow: saved ? '0 10px 15px -3px rgba(16, 185, 129, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
             transform: saved ? 'scale(0.98)' : 'scale(1)'
        }}
      >
        {saved ? (
            <>
                <span>已记录</span>
            </>
        ) : '确认记录'}
      </button>
      
      {saved && (
        <div className="mt-4 text-xs text-slate-400 dark:text-white/40 animate-pulse flex items-center gap-1">
            <BarChart2 size={12} />
            <span>前往“统计”查看变化</span>
        </div>
      )}
    </div>
  );
};

export default LogEntryView;
