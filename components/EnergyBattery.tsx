
import React, { useMemo } from 'react';
import { ScheduleEvent } from '../types';
import { calculateEnergyDelta } from '../utils';
import { Zap } from 'lucide-react';

interface EnergyBatteryProps {
  events: ScheduleEvent[];
  capacity?: number;
}

const EnergyBattery: React.FC<EnergyBatteryProps> = ({ events, capacity = 100 }) => {
  const { remaining, projected } = useMemo(() => {
    // Current Remaining = Capacity - (Completed Costs) + (Completed Recovery)
    // Projected Remaining = Capacity - (All Costs) + (All Recovery)
    // Actually, prompt implies "Remaining" acts as a Budget for the day.
    // Let's treat it as: Budget = 100.
    // Projected Balance = 100 + Sum(Delta of ALL events).
    
    const deltaTotal = events.reduce((acc, ev) => acc + calculateEnergyDelta(ev.duration, ev.intensity), 0);
    const projected = Math.min(100, Math.max(-20, capacity + deltaTotal)); // Allow slightly negative for shake effect
    
    // For visual fill, we might want to just show the projected end-of-day state?
    // Or show "Current" state? The prompt says "Today's Remaining Energy".
    // If I haven't done the task, the energy is still "in me".
    // But if I overplan, it shakes. So it must look at PLANNED tasks.
    
    return { remaining: projected, projected };
  }, [events, capacity]);

  const isCritical = projected < 0;
  const isLow = projected < 20 && projected >= 0;
  
  // Fill color
  let fillColor = 'bg-teal-500 dark:bg-teal-400';
  if (isLow) fillColor = 'bg-yellow-500 dark:bg-yellow-400';
  if (isCritical) fillColor = 'bg-rose-500 dark:bg-rose-400';

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-black/20 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm transition-all duration-300 ${isCritical ? 'animate-pulse' : ''}`}>
      <div className={`relative flex items-center ${isCritical ? 'animate-[shake_0.5s_ease-in-out_infinite]' : ''}`}>
        {/* Battery Body */}
        <div className="w-8 h-4 rounded-[4px] border-2 border-slate-400 dark:border-white/40 p-0.5 flex items-center">
            <div 
                className={`h-full rounded-[2px] transition-all duration-500 ${fillColor}`}
                style={{ width: `${Math.max(5, Math.min(100, projected))}%` }}
            />
        </div>
        {/* Battery Cap */}
        <div className="w-0.5 h-2 bg-slate-400 dark:bg-white/40 rounded-r-sm mx-[1px]"></div>
      </div>
      
      <div className="flex flex-col leading-none">
          <span className={`text-[10px] font-bold ${isCritical ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-white/80'}`}>
            {projected}%
          </span>
          <span className="text-[8px] text-slate-400 dark:text-white/40 font-medium">精力余额</span>
      </div>
      
      {isCritical && <Zap size={12} className="text-rose-500 animate-bounce" fill="currentColor" />}
    </div>
  );
};

export default EnergyBattery;
