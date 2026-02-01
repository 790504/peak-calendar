
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, YAxis } from 'recharts';
import { WEEKLY_STATS } from '../constants';
import { COLOR_SCALE, getInterpolatedColor, formatTime } from '../utils';
import { CloudRain, MapPin, Sun, Info, TrendingUp, TrendingDown, Minus, Clock, Activity, X, Wind, Droplets, Navigation, Cloud, Zap, Thermometer } from 'lucide-react';
import { EnvironmentalInsight, EnergyLog } from '../types';

interface AnalyticsViewProps {
  logs?: EnergyLog[];
}

// Mock Data Generators for Detail Views
const generateHourlyWeather = () => Array.from({ length: 6 }, (_, i) => ({
    time: `${(new Date().getHours() + i + 1) % 24}:00`,
    temp: 18 + Math.round(Math.random() * 3),
    energyPred: 70 + Math.round(Math.random() * 20)
}));

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ logs = [] }) => {
  // State for dynamic environment data
  const [loadingEnv, setLoadingEnv] = useState(true);
  const [weatherData, setWeatherData] = useState({ temp: 22, condition: 'Cloudy', city: '定位中...', desc: '正在分析气象数据...' });
  const [locationData, setLocationData] = useState({ type: 'Office', label: '未知地点', stress: 'Medium', desc: '正在获取地理围栏...' });
  
  // State for Modal expansion
  const [selectedInsight, setSelectedInsight] = useState<'weather' | 'location' | null>(null);

  // Simulate Real-time Data Fetching on Mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate Geolocation Success
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Mock Success Data based on "Real" coords (Just simplified logic)
                setWeatherData({ 
                    temp: 19, 
                    condition: 'Rain', 
                    city: '上海市·静安区', 
                    desc: '检测到气压降低，您的深层专注力预计提升 15%。' 
                });
                setLocationData({
                    type: 'Office',
                    label: 'WeWork 办公区',
                    stress: 'High',
                    desc: '此区域过去 3 周的高压时段集中在 14:00 - 16:00。'
                });
                setLoadingEnv(false);
            },
            (error) => {
                // Mock Fallback/Default Data
                setWeatherData({ 
                    temp: 24, 
                    condition: 'Sun', 
                    city: '默认位置', 
                    desc: '阳光充足，建议进行发散性创造工作。' 
                });
                setLocationData({
                    type: 'Home',
                    label: '家庭环境',
                    stress: 'Low',
                    desc: '环境噪音低，适合休息与恢复。'
                });
                setLoadingEnv(false);
            }
        );
      } else {
          setLoadingEnv(false);
      }
    }, 1500); // Fake delay for realism

    return () => clearTimeout(timer);
  }, []);


  const getIcon = (name: string, size = 20) => {
    switch (name) {
      case 'Rain': return <CloudRain size={size} className="text-blue-500" />;
      case 'Sun': return <Sun size={size} className="text-orange-500" />;
      case 'Cloudy': return <Cloud size={size} className="text-slate-500" />;
      case 'MapPin': return <MapPin size={size} className="text-rose-500" />;
      default: return <Info size={size} />;
    }
  };

  const formatLogTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- Render Detail Modal ---
  const renderDetailModal = () => {
    if (!selectedInsight) return null;

    const isWeather = selectedInsight === 'weather';
    const hourlyData = generateHourlyWeather();

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div 
                className="w-full max-w-md bg-white dark:bg-[#1c1c1e] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 relative overflow-hidden"
                style={{ height: '80vh' }}
            >
                {/* Background Decor */}
                <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-30 ${isWeather ? 'bg-blue-400' : 'bg-rose-400'}`}></div>
                
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedInsight(null)}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-white/20 transition-all z-20"
                >
                    <X size={20} />
                </button>

                <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div className="mt-4 mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${isWeather ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300' : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-300'}`}>
                                {isWeather ? '实时气象' : '地理围栏'}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {isWeather ? weatherData.city : locationData.label}
                        </h2>
                        <p className="text-slate-500 dark:text-white/60 font-medium">
                            {isWeather ? `${weatherData.temp}°C ${weatherData.condition === 'Rain' ? '中雨' : '多云'}` : '已进入高频活动区域'}
                        </p>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                        
                        {/* Insight Card */}
                        <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/5">
                            <h3 className="text-sm font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mb-3">
                                {isWeather ? '能量关联分析' : '压力指纹'}
                            </h3>
                            <p className="text-lg text-slate-800 dark:text-white font-medium leading-relaxed">
                                {isWeather ? weatherData.desc : locationData.desc}
                            </p>
                            
                            {/* Extra Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 mt-6">
                                <div className="bg-white dark:bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm">
                                    {isWeather ? <Wind size={18} className="text-slate-400" /> : <Activity size={18} className="text-rose-400" />}
                                    <span className="text-sm font-bold text-slate-700 dark:text-white">{isWeather ? '3级' : '85'}</span>
                                    <span className="text-[10px] text-slate-400">{isWeather ? '风力' : '压力值'}</span>
                                </div>
                                <div className="bg-white dark:bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm">
                                    {isWeather ? <Droplets size={18} className="text-blue-400" /> : <Navigation size={18} className="text-emerald-400" />}
                                    <span className="text-sm font-bold text-slate-700 dark:text-white">{isWeather ? '82%' : '室内'}</span>
                                    <span className="text-[10px] text-slate-400">{isWeather ? '湿度' : 'GPS'}</span>
                                </div>
                                <div className="bg-white dark:bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm">
                                    {isWeather ? <Zap size={18} className="text-yellow-400" /> : <Clock size={18} className="text-indigo-400" />}
                                    <span className="text-sm font-bold text-slate-700 dark:text-white">{isWeather ? '+15%' : '2h'}</span>
                                    <span className="text-[10px] text-slate-400">{isWeather ? '能量' : '驻留'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Charts / Forecast */}
                        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-sm">
                             <h3 className="text-sm font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mb-4">
                                {isWeather ? '未来 6 小时能量预报' : '地点压力趋势'}
                            </h3>
                            <div className="h-40 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={hourlyData}>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            labelStyle={{ color: '#94a3b8' }}
                                        />
                                        <XAxis dataKey="time" hide />
                                        <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                                        <Line 
                                            type="monotone" 
                                            dataKey="energyPred" 
                                            stroke={isWeather ? '#3b82f6' : '#f43f5e'} 
                                            strokeWidth={3} 
                                            dot={{r: 4, fill: isWeather ? '#3b82f6' : '#f43f5e', strokeWidth: 0}}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between mt-2 px-2">
                                {hourlyData.map((d, i) => (
                                    <div key={i} className="text-[10px] text-slate-400 flex flex-col items-center gap-1">
                                        <span>{d.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };


  return (
    <div className="h-full overflow-y-auto px-4 pb-24 pt-20 z-10 relative no-scrollbar">
      
      {/* --- Detail Modal --- */}
      {renderDetailModal()}

      <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-3xl font-light text-slate-900 dark:text-white tracking-tight">生理数据周报</h2>
          <span className="text-xs font-bold text-slate-400 dark:text-white/40 bg-slate-100 dark:bg-white/10 px-2 py-1 rounded-md">W42</span>
      </div>

      <div className="grid grid-cols-2 gap-3 auto-rows-auto">
        
        {/* --- Real-time Tracker (Logs) --- */}
        <div className="col-span-2 mb-2">
             <div className="bg-white/80 dark:bg-[#1c1c1e] border border-white/60 dark:border-white/10 rounded-[1.8rem] p-5 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 mb-4">
                    <Activity size={16} className="text-indigo-500" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">今日实测追踪</h3>
                    <span className="ml-auto text-[10px] text-slate-400 dark:text-white/30 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                        {logs.length > 0 ? `${logs.length} 条记录` : '暂无数据'}
                    </span>
                </div>

                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-slate-400 dark:text-white/30 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                        <Clock size={24} className="mb-2 opacity-50" />
                        <p className="text-xs font-medium">还没有记录，去“记录”页面打个卡吧</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {logs.slice(0, 3).map((log) => (
                            <div key={log.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 text-xs font-bold text-slate-400 dark:text-white/40 tabular-nums">
                                        {formatLogTime(log.timestamp)}
                                    </div>
                                    <div className="h-2 w-24 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full" 
                                            style={{ width: `${log.level}%`, backgroundColor: getInterpolatedColor(log.level) }} 
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold" style={{ color: getInterpolatedColor(log.level) }}>{log.level}%</span>
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60">
                                        {log.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {logs.length > 3 && (
                            <div className="text-center pt-1">
                                <span className="text-[10px] text-slate-400 dark:text-white/30">查看更多历史...</span>
                            </div>
                        )}
                    </div>
                )}
             </div>
        </div>

        {/* --- Efficiency Trend (Bento Large) --- */}
        <div className="col-span-2 bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-[2rem] p-5 backdrop-blur-xl shadow-sm dark:shadow-none flex flex-col h-[280px]">
          <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-sm font-bold text-slate-500 dark:text-white/60 uppercase tracking-widest">综合效率</h3>
                <div className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">82% <span className="text-sm text-emerald-500 font-normal">平均值</span></div>
            </div>
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-500/20">
                <TrendingUp size={12} />
                <span>+12%</span>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_STATS} margin={{top: 10, bottom: 0}}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
                  dy={10}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', color: '#334155' }}
                  itemStyle={{ color: '#334155', fontWeight: 600 }}
                  formatter={(value: number) => [value, '效率值']}
                />
                <Bar dataKey="efficiency" radius={[6, 6, 6, 6]}>
                  {WEEKLY_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getInterpolatedColor(entry.efficiency)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Section Header --- */}
        <div className="col-span-2 mt-4 mb-1 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest pl-1">环境与能量指纹</h3>
            {loadingEnv && <div className="text-[10px] text-slate-400 animate-pulse">定位分析中...</div>}
        </div>

        {/* --- Interactive Weather Card --- */}
        <div 
            onClick={() => !loadingEnv && setSelectedInsight('weather')}
            className={`col-span-1 bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-[1.8rem] p-4 backdrop-blur-xl shadow-sm dark:shadow-none flex flex-col justify-between min-h-[160px] relative overflow-hidden group transition-all duration-300 ${loadingEnv ? 'opacity-80' : 'hover:scale-[1.02] active:scale-95 cursor-pointer hover:bg-white/80 dark:hover:bg-white/10'}`}
        >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 {getIcon(weatherData.condition, 80)}
            </div>

            <div className="relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-blue-50 dark:bg-blue-500/20`}>
                    {loadingEnv ? <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div> : getIcon(weatherData.condition)}
                </div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-wide">天气关联</h4>
                <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                    {loadingEnv ? '--' : weatherData.condition === 'Rain' ? '阴雨' : '多云'}
                </div>
            </div>

            <div className="relative z-10 mt-3">
                 <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border mb-2 bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/20`}>
                    <TrendingUp size={12} />
                    <span>{loadingEnv ? '...' : '+15%'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-white/70 font-medium line-clamp-2">
                    {loadingEnv ? '正在分析当前气象数据...' : weatherData.desc}
                </p>
            </div>
            
            {!loadingEnv && (
                <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-300 dark:text-white/20 uppercase tracking-widest flex items-center gap-1">
                    <TrendingUp size={10} /> 展开
                </div>
            )}
        </div>

        {/* --- Interactive Location Card --- */}
         <div 
            onClick={() => !loadingEnv && setSelectedInsight('location')}
            className={`col-span-1 bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-[1.8rem] p-4 backdrop-blur-xl shadow-sm dark:shadow-none flex flex-col justify-between min-h-[160px] relative overflow-hidden group transition-all duration-300 ${loadingEnv ? 'opacity-80' : 'hover:scale-[1.02] active:scale-95 cursor-pointer hover:bg-white/80 dark:hover:bg-white/10'}`}
        >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 {getIcon('MapPin', 80)}
            </div>

            <div className="relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-rose-50 dark:bg-rose-500/20`}>
                    {loadingEnv ? <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></div> : getIcon('MapPin')}
                </div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-wide">地点压力</h4>
                <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5 truncate">
                    {loadingEnv ? '--' : locationData.label}
                </div>
            </div>

            <div className="relative z-10 mt-3">
                 <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border mb-2 ${locationData.stress === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/20 dark:text-rose-300' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    <Activity size={12} />
                    <span>{loadingEnv ? '...' : locationData.stress === 'High' ? '高压区' : '舒适'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-white/70 font-medium line-clamp-2">
                    {loadingEnv ? '正在获取地理围栏...' : locationData.desc}
                </p>
            </div>
             {!loadingEnv && (
                <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-300 dark:text-white/20 uppercase tracking-widest flex items-center gap-1">
                    <TrendingUp size={10} /> 展开
                </div>
            )}
        </div>


        {/* --- Final Insight / Summary Card --- */}
        <div className="col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[2rem] p-6 shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden mt-2">
             <div className="absolute -right-10 -bottom-20 w-60 h-60 bg-white/20 rounded-full blur-[50px]"></div>
             <div className="relative z-10">
                 <h3 className="font-bold text-indigo-100 text-sm uppercase tracking-widest mb-1">AI 深度洞察</h3>
                 <p className="text-lg font-medium leading-snug">
                    综合多维数据分析：您的最佳工作环境是<span className="font-bold border-b border-white/40">阴天的周二上午</span>。建议利用此规律规划下周的创造性任务。
                 </p>
             </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsView;
