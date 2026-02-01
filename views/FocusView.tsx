
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { getEnergyGradient, formatTime, calculateMatchScore, getIntensityLabel, getIntensityColor, calculateEnergyDelta } from '../utils';
import { ScheduleEvent, BioMetricPoint, Suggestion, CoachInsight } from '../types';
import { AlertCircle, CheckCircle2, Sparkles, ArrowRight, X, Plus, Trash2, Clock, Activity, Battery, Zap, Play, BrainCircuit, Coffee, CalendarClock } from 'lucide-react';
import MagSafeEffect from '../components/MagSafeEffect';
import FlowMode from '../components/FlowMode';

// --- Constants ---
const HOUR_HEIGHT = 120; 

// --- Helpers (Same as before) ---
const getEventLayouts = (events: ScheduleEvent[]) => {
  if (events.length === 0) return new Map();
  const sorted = [...events].sort((a, b) => a.startTime - b.startTime || b.duration - a.duration);
  const layoutMap = new Map<string, { left: number; width: number }>();
  let i = 0;
  while (i < sorted.length) {
    const group = [sorted[i]];
    let groupEnd = sorted[i].startTime + sorted[i].duration;
    let j = i + 1;
    while (j < sorted.length && sorted[j].startTime < groupEnd) {
      group.push(sorted[j]);
      groupEnd = Math.max(groupEnd, sorted[j].startTime + sorted[j].duration);
      j++;
    }
    const columns: ScheduleEvent[][] = [];
    for (const ev of group) {
      let placed = false;
      for (let c = 0; c < columns.length; c++) {
        const hasCollision = columns[c].some(placedEv => 
          Math.max(placedEv.startTime, ev.startTime) < Math.min(placedEv.startTime + placedEv.duration, ev.startTime + ev.duration)
        );
        if (!hasCollision) {
          columns[c].push(ev);
          layoutMap.set(ev.id, { left: c, width: 0 }); 
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([ev]);
        layoutMap.set(ev.id, { left: columns.length - 1, width: 0 });
      }
    }
    const totalColumns = columns.length;
    for (const ev of group) {
      const layout = layoutMap.get(ev.id)!;
      const widthPercent = 100 / totalColumns;
      layoutMap.set(ev.id, { 
        left: layout.left * widthPercent, 
        width: widthPercent 
      });
    }
    i = j;
  }
  return layoutMap;
};

// --- Components ---

const EventCard: React.FC<{ 
  event: ScheduleEvent; 
  energy: number;
  layout: { left: number; width: number };
  onClick: (event: ScheduleEvent) => void;
  onToggleComplete: (id: string) => void;
}> = ({ event, energy, layout, onClick, onToggleComplete }) => {
  const matchScore = calculateMatchScore(event.intensity, energy);
  const isMismatch = matchScore < 60 && !event.completed;
  const intensityLabel = getIntensityLabel(event.intensity);
  const intensityStyle = getIntensityColor(event.intensity);
  const energyDelta = calculateEnergyDelta(event.duration, event.intensity);
  const isRecovery = energyDelta > 0;

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      className={`absolute rounded-2xl border backdrop-blur-md transition-all duration-300 group hover:z-20 cursor-pointer flex flex-col overflow-hidden pointer-events-auto
        ${event.completed 
            ? 'bg-slate-100/50 dark:bg-white/5 border-slate-200/50 dark:border-white/5 opacity-60 grayscale' 
            : isMismatch 
                ? 'bg-rose-50/80 dark:bg-rose-900/40 border-rose-200/60 dark:border-rose-800/30 shadow-sm shadow-rose-100 dark:shadow-none hover:shadow-xl hover:scale-[1.02]' 
                : 'bg-white/80 dark:bg-white/10 border-white/60 dark:border-white/10 shadow-sm shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:scale-[1.02]'}
      `}
      style={{
        top: `${event.startTime * HOUR_HEIGHT}px`,
        height: `${Math.max(event.duration * HOUR_HEIGHT, 50)}px`,
        left: `${layout.left}%`,
        width: `${layout.width}%`,
        zIndex: event.completed ? 1 : 10,
        padding: '0.5rem 0.75rem'
      }}
    >
      <div className="flex justify-between items-start w-full gap-1 mb-1">
        <h3 className={`text-xs font-bold leading-snug break-words w-full transition-all ${event.completed ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white/90'}`}>
          {event.title}
        </h3>
        <div className="flex gap-1 flex-shrink-0">
            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(event.id);
                }}
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95
                    ${event.completed 
                        ? 'bg-slate-400 border-slate-400 text-white' 
                        : 'border-slate-300 dark:border-white/30 hover:border-teal-400 dark:hover:border-teal-400'}
                `}
            >
                {event.completed && <CheckCircle2 size={12} fill="currentColor" className="text-white" />}
            </div>
            {isMismatch && !event.completed && (
            <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
                <AlertCircle className="w-3 h-3 text-rose-500 dark:text-rose-400" />
            </div>
            )}
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-auto">
        {event.duration >= 0.5 && (
            <p className="text-[10px] text-slate-500 dark:text-white/50 font-medium tracking-wide">
              {formatTime(event.startTime)} - {formatTime(event.startTime + event.duration)}
            </p>
        )}
        {event.duration >= 0.75 && !event.completed && (
          <div className="flex items-center justify-between mt-1">
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide border backdrop-blur-sm ${intensityStyle}`}>
                {intensityLabel}
            </div>
            <div className={`flex items-center gap-0.5 text-[9px] font-bold ${isRecovery ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-white/40'}`}>
               {isRecovery ? <Battery size={10} className="rotate-90" /> : <Zap size={10} />}
               <span>{energyDelta > 0 ? '+' : ''}{energyDelta}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Coach Widget ---
const CoachWidget: React.FC<{ insight: CoachInsight; onDismiss: () => void; onAction: () => void }> = ({ insight, onDismiss, onAction }) => {
    return (
        <div className="mb-6 mx-4 relative group animate-in slide-in-from-top-4 duration-500">
             <div className="absolute inset-0 bg-white/80 dark:bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-[2rem] border border-indigo-100 dark:border-indigo-500/20 shadow-xl shadow-indigo-100/50 dark:shadow-none"></div>
             {/* Dynamic Glow based on type */}
             <div className={`absolute -left-2 top-4 w-1 h-12 rounded-full ${insight.type === 'reflow' ? 'bg-orange-400' : 'bg-indigo-400'}`}></div>
             
             <div className="relative p-5 z-10">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${insight.type === 'reflow' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
                            {insight.type === 'reflow' ? <CalendarClock size={16} /> : <BrainCircuit size={16} />}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/50">
                            {insight.type === 'reflow' ? '智能平移' : '能量预警'}
                        </span>
                    </div>
                    <button onClick={onDismiss} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400">
                        <X size={14} />
                    </button>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{insight.title}</h3>
                <p className="text-sm text-slate-600 dark:text-white/70 mb-4 leading-relaxed">{insight.message}</p>
                
                <div className="flex gap-3">
                    <button 
                        onClick={onAction}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-2
                        ${insight.type === 'reflow' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {insight.type === 'reflow' ? <CalendarClock size={14} /> : <Coffee size={14} />}
                        {insight.actionLabel}
                    </button>
                    <button 
                        onClick={onDismiss}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                    >
                        忽略
                    </button>
                </div>
             </div>
        </div>
    );
};

// --- Event Editor (Unchanged mostly, just compact props) ---
interface EventEditorProps {
  event: ScheduleEvent | null;
  initialStartTime?: number;
  onSave: (event: ScheduleEvent) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  onStartFocus: (event: ScheduleEvent) => void;
}
const EventEditor: React.FC<EventEditorProps> = ({ event, initialStartTime, onSave, onDelete, onClose, onStartFocus }) => {
  const [title, setTitle] = useState(event?.title || '');
  const [startTime, setStartTime] = useState(event?.startTime ?? initialStartTime ?? 9);
  const [duration, setDuration] = useState(event?.duration || 1);
  const [intensity, setIntensity] = useState(event?.intensity || 3);
  const [completed, setCompleted] = useState(event?.completed || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: event?.id || Date.now().toString(),
      title: title || '新事项',
      startTime,
      duration,
      intensity,
      category: event?.category || 'work',
      completed
    });
    onClose();
  };

  const calculatedDelta = calculateEnergyDelta(duration, intensity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white/90 dark:bg-[#121212]/90 border border-white/50 dark:border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-slate-900 dark:text-white tracking-wide">
            {event ? '编辑事项' : '新事项'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest pl-1">标题</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="做什么？"
              autoFocus
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white dark:focus:bg-white/10 transition-all text-lg font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest pl-1">
                <Clock size={12} /> 开始时间
              </label>
              <select 
                value={startTime} 
                onChange={e => setStartTime(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white appearance-none focus:outline-none focus:border-slate-400"
              >
                {Array.from({ length: 48 }).map((_, i) => {
                  const t = i * 0.5;
                  return <option key={t} value={t} className="bg-white dark:bg-gray-900">{formatTime(t)}</option>
                })}
              </select>
            </div>
            <div className="space-y-2">
               <label className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest pl-1">
                时长 (小时)
              </label>
              <input 
                type="number" 
                min="0.5" 
                max="12" 
                step="0.5"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest pl-1">
              <span className="flex items-center gap-2"><Activity size={12} /> 强度 (1-5)</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getIntensityColor(intensity)}`}>
                {getIntensityLabel(intensity)}
              </span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              step="1"
              value={intensity}
              onChange={e => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-white"
            />
             {/* Estimated Energy Impact */}
            <div className={`mt-2 text-center p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold ${calculatedDelta > 0 ? 'text-emerald-500' : 'text-slate-500'}`}>
                预计能量: {calculatedDelta > 0 ? '+' : ''}{calculatedDelta}%
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {event ? (
              <>
                 <button 
                  type="button"
                  onClick={() => { onDelete(event.id); onClose(); }}
                  className="px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
                >
                  <Trash2 size={20} />
                </button>
                <button 
                  type="button"
                  onClick={() => { onStartFocus(event); }}
                  className="flex-1 py-3 rounded-2xl bg-teal-500 text-white font-bold hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2"
                >
                  <Play size={18} fill="currentColor" /> 开始专注
                </button>
              </>
            ) : (
                <button 
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-semibold hover:bg-slate-800 dark:hover:bg-white/90 transition-all shadow-lg shadow-slate-300 dark:shadow-none"
                >
                保存
                </button>
            )}
             {event && (
                 <button 
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-semibold hover:bg-slate-800 dark:hover:bg-white/90 transition-all shadow-lg shadow-slate-300 dark:shadow-none"
                >
                  保存
                </button>
             )}
          </div>
        </form>
      </div>
    </div>
  );
};

interface FocusViewProps {
  events: ScheduleEvent[];
  setEvents: React.Dispatch<React.SetStateAction<ScheduleEvent[]>>;
  bioData: BioMetricPoint[];
  readiness: number;
}

const FocusView: React.FC<FocusViewProps> = ({ events, setEvents, bioData, readiness }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const [editorState, setEditorState] = useState<{ isOpen: boolean; event: ScheduleEvent | null; initialStartTime?: number }>({ isOpen: false, event: null });
  const [activeTask, setActiveTask] = useState<ScheduleEvent | null>(null);
  const [animState, setAnimState] = useState<{ visible: boolean; type: 'consume' | 'recover'; label: string }>({ visible: false, type: 'consume', label: '' });

  // Coach Insights
  const [activeCoachInsight, setActiveCoachInsight] = useState<CoachInsight | null>(null);

  // Compute Layout when events change
  const eventLayouts = useMemo(() => getEventLayouts(events), [events]);

  // --- Coach Engine ---
  useEffect(() => {
    // Reset Insight
    setActiveCoachInsight(null);
    
    // 1. Smart Re-flow Check (Readiness < 60)
    if (readiness < 60) {
        const highLoadEvents = events.filter(e => e.intensity >= 4 && !e.completed);
        if (highLoadEvents.length > 0) {
            setActiveCoachInsight({
                id: 'coach-reflow',
                type: 'reflow',
                title: '今日基调：修复',
                message: `检测到您的恢复值偏低 (${readiness}%)。今日不宜进行高强度冲刺，建议推迟 ${highLoadEvents.length} 个“深度工作”任务。`,
                actionLabel: '一键推迟',
                affectedEventIds: highLoadEvents.map(e => e.id),
                suggestedAction: () => {
                   // Move high load events to "Tomorrow" (for demo, just unassign time or move way down)
                   // Let's just visually mark them or remove them to simulate reschedule
                   setEvents(prev => prev.filter(e => e.intensity < 4 || e.completed));
                   setAnimState({ visible: true, type: 'recover', label: '已优化' });
                }
            });
            return;
        }
    }

    // 2. Energy Gap Warning (Gap Detection)
    // Find tasks where task energy requirement is High but Bio Energy is Low (<40)
    const gapEvent = events.find(e => {
        if (e.completed || e.intensity < 3) return false;
        // Check energy at start time
        const hour = Math.floor(e.startTime);
        const bio = bioData.find(b => b.hour === hour)?.energyLevel || 50;
        return bio < 40;
    });

    if (gapEvent) {
         setActiveCoachInsight({
            id: 'coach-gap',
            type: 'gap_warning',
            title: '能量缺口预警',
            message: `您安排在 ${formatTime(gapEvent.startTime)} 的 "${gapEvent.title}" 恰逢今日能量低谷。建议在开始前进行 15 分钟冥想以提升状态。`,
            actionLabel: '插入冥想',
            suggestedAction: () => {
                // Add a meditation task 15 mins before
                const newEvent: ScheduleEvent = {
                    id: Date.now().toString(),
                    title: '🧘 能量冥想',
                    startTime: gapEvent.startTime - 0.5 < 0 ? 0 : gapEvent.startTime - 0.5,
                    duration: 0.5,
                    intensity: 1, // Recovery
                    category: 'health',
                    completed: false
                };
                setEvents(prev => [...prev, newEvent]);
                setAnimState({ visible: true, type: 'recover', label: '已插入' });
            }
        });
    }

  }, [readiness, events, bioData]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 9 * HOUR_HEIGHT - 150;
    }
  }, []);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && (e.target as HTMLElement).getAttribute('data-bg') !== 'true') return;
    const relativeY = e.nativeEvent.offsetY;
    const clickedHour = Math.floor((relativeY / HOUR_HEIGHT) * 2) / 2; 
    setEditorState({ isOpen: true, event: null, initialStartTime: clickedHour });
  };

  const handleSaveEvent = (savedEvent: ScheduleEvent) => {
    setEvents(prev => {
      const exists = prev.find(e => e.id === savedEvent.id);
      if (exists) {
        return prev.map(e => e.id === savedEvent.id ? savedEvent : e);
      }
      return [...prev, savedEvent];
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    const targetEvent = events.find(e => e.id === id);
    if (targetEvent && !targetEvent.completed) {
        const delta = calculateEnergyDelta(targetEvent.duration, targetEvent.intensity);
        setAnimState({
            visible: true,
            type: delta > 0 ? 'recover' : 'consume',
            label: delta > 0 ? `+${delta}%` : `${delta}%`
        });
    }
    setEvents(prev => prev.map(e => 
        e.id === id ? { ...e, completed: !e.completed } : e
    ));
  };

  const handleStartFocus = (event: ScheduleEvent) => {
      setActiveTask(event);
      setEditorState({ isOpen: false, event: null });
  };

  const handleCoachAction = () => {
      if (activeCoachInsight?.suggestedAction) {
          activeCoachInsight.suggestedAction();
          setActiveCoachInsight(null);
      }
  };

  return (
    <div className="h-full flex flex-col relative z-10">
      <MagSafeEffect 
        visible={animState.visible} 
        type={animState.type} 
        label={animState.label}
        onAnimationComplete={() => setAnimState(prev => ({ ...prev, visible: false }))} 
      />

      {/* Flow Mode Overlay */}
      {activeTask && (
        <FlowMode 
            task={activeTask}
            onClose={() => setActiveTask(null)}
            onComplete={(taskId) => {
                handleToggleComplete(taskId);
                setActiveTask(null);
            }}
        />
      )}

      {/* Editor Modal */}
      {editorState.isOpen && (
        <EventEditor 
          event={editorState.event}
          initialStartTime={editorState.initialStartTime}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setEditorState({ isOpen: false, event: null })}
          onStartFocus={handleStartFocus}
        />
      )}

      {/* Floating Header */}
      <div className="px-8 pt-20 pb-4 backdrop-blur-xl bg-white/30 dark:bg-black/30 sticky top-0 z-30 transition-all duration-300 border-b border-white/20 dark:border-white/5">
        <div className="flex justify-between items-end">
           <div className="mt-1">
             <h1 className="text-3xl font-light text-slate-900 dark:text-white tracking-tight">今日</h1>
             <p className="text-slate-500 dark:text-white/40 text-sm font-medium tracking-wide mt-1">点击时间轴添加事项</p>
           </div>
           <div className="flex flex-col items-end mb-1">
              <button 
                onClick={() => setEditorState({ isOpen: true, event: null, initialStartTime: 9 })}
                className="flex items-center gap-1.5 bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-md transition-all active:scale-95"
              >
                 <Plus size={14} className="text-slate-700 dark:text-white" />
                 <span className="text-[10px] font-bold text-slate-700 dark:text-white uppercase tracking-wider">添加</span>
              </button>
           </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto relative no-scrollbar pb-32 pt-6">
        
        {/* Coach Insight Widget */}
        {activeCoachInsight && (
            <div className="relative z-20">
                <CoachWidget 
                    insight={activeCoachInsight} 
                    onDismiss={() => setActiveCoachInsight(null)}
                    onAction={handleCoachAction}
                />
            </div>
        )}

        {/* Timeline Grid */}
        <div 
          ref={timelineRef}
          className="relative mt-4 cursor-crosshair" 
          style={{ height: `${24 * HOUR_HEIGHT}px` }}
          onClick={handleTimelineClick}
          data-bg="true"
        >
          {bioData.map((point: BioMetricPoint) => (
            <div 
              key={point.hour} 
              className="absolute w-full pointer-events-none" 
              style={{ top: `${point.hour * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
            >
              
              {/* Energy Background Aura */}
              <div 
                className={`absolute left-0 top-0 bottom-0 w-full opacity-30 dark:opacity-20 bg-gradient-to-r ${getEnergyGradient(point.energyLevel)}`}
                style={{
                  width: `${point.energyLevel}%`,
                  filter: 'blur(30px)',
                  transition: 'width 1s ease-in-out'
                }}
              />

              {/* Time Label */}
              <div className="absolute left-6 top-0 text-[10px] font-bold tracking-widest text-slate-400 dark:text-white/30 transform -translate-y-1/2">
                {formatTime(point.hour)}
              </div>

              {/* Grid Line */}
              <div className="absolute left-20 right-0 top-0 h-[1px] bg-slate-200/50 dark:bg-white/5" />
            </div>
          ))}

          {/* Current Time Indicator */}
          <div 
            className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
            style={{ top: `${13.25 * HOUR_HEIGHT}px` }}
          >
             <div className="absolute left-4 w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-300 animate-pulse" />
             <div className="absolute left-6 right-0 h-[1px] bg-gradient-to-r from-rose-400 to-transparent" />
          </div>

          {/* Events Layer */}
          <div className="absolute top-0 bottom-0 left-20 right-4 pointer-events-none">
             {events.map(event => {
                const energy = bioData.find(p => p.hour === Math.floor(event.startTime))?.energyLevel || 50;
                const layout = eventLayouts.get(event.id) || { left: 0, width: 100 };
                return (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    energy={energy}
                    layout={layout}
                    onClick={(e) => setEditorState({ isOpen: true, event: e })}
                    onToggleComplete={handleToggleComplete}
                  />
                );
              })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FocusView;
