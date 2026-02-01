
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatTime, COLOR_SCALE } from '../utils';
import { BioMetricPoint } from '../types';
import { Battery, Zap, AlertTriangle, Moon, CheckCircle2 } from 'lucide-react';

interface PulseViewProps {
  bioData: BioMetricPoint[];
  readiness: number;
  setReadiness: (val: number) => void;
}

const PulseView: React.FC<PulseViewProps> = ({ bioData, readiness, setReadiness }) => {
  const isLowReadiness = readiness < 60;

  return (
    <div className="h-full px-4 pt-20 pb-24 z-10 relative flex flex-col overflow-y-auto no-scrollbar">
      
      {/* Header with Readiness Control */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-light text-slate-900 dark:text-white tracking-tight">
                能量预报
                </h2>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-md border ${isLowReadiness ? 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800' : 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'}`}>
                        {isLowReadiness ? '恢复模式' : '巅峰状态'}
                    </span>
                    <span className="text-slate-500 dark:text-white/50 text-sm font-medium">
                        HRV: {isLowReadiness ? '32ms (低)' : '65ms (优)'}
                    </span>
                </div>
            </div>

            {/* Simulation Toggle */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">模拟状态</label>
                <div className="flex bg-white/40 dark:bg-white/10 p-1 rounded-full border border-white/40 dark:border-white/5 backdrop-blur-md">
                    <button 
                        onClick={() => setReadiness(85)}
                        className={`p-2 rounded-full transition-all ${!isLowReadiness ? 'bg-white shadow-sm dark:bg-white/20 text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <CheckCircle2 size={16} />
                    </button>
                    <button 
                        onClick={() => setReadiness(45)}
                        className={`p-2 rounded-full transition-all ${isLowReadiness ? 'bg-white shadow-sm dark:bg-white/20 text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <AlertTriangle size={16} />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="flex-1 w-full min-h-[300px] bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-3xl p-4 backdrop-blur-xl relative shadow-lg shadow-slate-200/50 dark:shadow-none mb-6">
        <div className="absolute top-4 right-4 flex gap-2">
           {/* Legend */}
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-white/40 font-medium">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div> 高
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-white/40 font-medium">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div> 中
          </div>
           <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-white/40 font-medium">
            <div className="w-2 h-2 rounded-full bg-red-500"></div> 低
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={bioData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLOR_SCALE[4].hex} stopOpacity={0.8}/>   {/* Indigo */}
                <stop offset="25%" stopColor={COLOR_SCALE[3].hex} stopOpacity={0.7}/>  {/* Emerald */}
                <stop offset="50%" stopColor={COLOR_SCALE[2].hex} stopOpacity={0.6}/>  {/* Yellow */}
                <stop offset="75%" stopColor={COLOR_SCALE[1].hex} stopOpacity={0.5}/>  {/* Orange */}
                <stop offset="100%" stopColor={COLOR_SCALE[0].hex} stopOpacity={0.4}/> {/* Red */}
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
            <XAxis 
              dataKey="hour" 
              tickFormatter={(h) => h % 4 === 0 ? formatTime(h).replace(':00 ', '') : ''}
              stroke="rgba(150,150,150,0.1)"
              tick={{ fill: 'rgba(150,150,150,0.6)', fontSize: 10, fontWeight: 500 }}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '12px', color: '#1a1a1a', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              labelFormatter={(label) => formatTime(label)}
              formatter={(value: number) => [`${value}%`, '能量值']}
            />
            <Area 
              type="monotone" 
              dataKey="energyLevel" 
              stroke="url(#colorEnergy)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorEnergy)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col justify-between">
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
             <Zap size={18} fill="currentColor" />
             <span className="text-xs font-bold uppercase tracking-wide">日充能</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{isLowReadiness ? '58' : '82'}%</div>
          <div className="text-xs text-slate-500 dark:text-white/40">睡眠质量评分</div>
        </div>
        
        <div className="p-5 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col justify-between">
          <div className="flex items-center gap-2 text-teal-500 mb-2">
             <Battery size={18} />
             <span className="text-xs font-bold uppercase tracking-wide">建议负荷</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{isLowReadiness ? '3.5' : '6.0'}h</div>
          <div className="text-xs text-slate-500 dark:text-white/40">高强度工作上限</div>
        </div>
      </div>
      
      {isLowReadiness && (
          <div className="mt-4 p-4 rounded-2xl bg-orange-50/80 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-500/20 flex items-start gap-3">
              <AlertTriangle className="flex-shrink-0 text-orange-500 mt-0.5" size={18} />
              <div>
                  <h4 className="text-sm font-bold text-orange-800 dark:text-orange-200">恢复模式已激活</h4>
                  <p className="text-xs text-orange-600 dark:text-orange-300 mt-1 leading-relaxed">检测到 HRV 异常，系统已自动调低今日能量预期曲线。建议避免连续 90 分钟以上的深度工作。</p>
              </div>
          </div>
      )}

    </div>
  );
};

export default PulseView;
