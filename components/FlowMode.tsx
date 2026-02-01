
import React, { useState, useEffect, useRef } from 'react';
import { ScheduleEvent } from '../types';
import { X, Play, Pause, CheckCircle2, Heart, Wind, Minimize2 } from 'lucide-react';
import { formatTime } from '../utils';

interface FlowModeProps {
  task: ScheduleEvent;
  onClose: () => void;
  onComplete: (taskId: string) => void;
}

const FlowMode: React.FC<FlowModeProps> = ({ task, onClose, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(task.duration * 60 * 60); // Seconds
  const [isPlaying, setIsPlaying] = useState(true);
  const [bpm, setBpm] = useState(72);
  const [showBreathing, setShowBreathing] = useState(false);
  
  // Heart rate simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBpm(prev => {
        // Random fluctuation
        const change = Math.floor(Math.random() * 7) - 3;
        const newBpm = Math.max(60, Math.min(130, prev + change));
        
        // Trigger stress state if BPM gets too high (simulated for demo)
        // Let's bias it upwards slightly to eventually trigger the effect
        if (Math.random() > 0.7 && newBpm < 115) return newBpm + 5;
        
        return newBpm;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Monitor Stress
  useEffect(() => {
    if (bpm > 110 && !showBreathing) {
      setShowBreathing(true);
    } else if (bpm < 95 && showBreathing) {
      setShowBreathing(false);
    }
  }, [bpm, showBreathing]);

  // Timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isStress = showBreathing;
  
  // Dynamic Background Colors
  const bgColors = isStress 
    ? {
        blob1: 'bg-orange-500',
        blob2: 'bg-red-500',
        blob3: 'bg-yellow-500',
        text: 'text-white' 
      }
    : {
        blob1: 'bg-teal-400',
        blob2: 'bg-indigo-500',
        blob3: 'bg-blue-400',
        text: 'text-slate-900 dark:text-white'
      };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#F5F5F7] dark:bg-[#09090b] transition-colors duration-1000">
      
      {/* --- Reactive Background --- */}
      <div className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-40 transition-all duration-1000 ease-in-out">
        {/* Blob 1 */}
        <div 
          className={`absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-float transition-colors duration-1000 ${bgColors.blob1}`}
          style={{ animationDuration: `${60/bpm * 10}s` }} // Pulse speed based on heart rate
        />
        {/* Blob 2 */}
        <div 
          className={`absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow transition-colors duration-1000 ${bgColors.blob2}`}
          style={{ animationDuration: `${60/bpm * 8}s` }}
        />
        {/* Blob 3 (Center) */}
        <div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen animate-pulse transition-colors duration-1000 ${bgColors.blob3}`}
           style={{ animationDuration: `${60/bpm * 4}s` }}
        />
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>

      {/* --- Content Layer --- */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full px-8 py-12 max-w-md mx-auto">
        
        {/* Header */}
        <div className="w-full flex justify-between items-center">
            <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-slate-900 dark:text-white hover:bg-white/30 transition-all"
            >
                <Minimize2 size={20} />
            </button>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 ${isStress ? 'bg-red-500/20 text-red-900 dark:text-red-100' : 'bg-white/20 text-slate-700 dark:text-white/80'}`}>
                <Heart size={16} className={isStress ? "animate-pulse fill-current" : "fill-current"} />
                <span className="text-sm font-bold tabular-nums">{bpm} BPM</span>
            </div>
        </div>

        {/* Main Display */}
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
            
            {/* Breathing Prompt */}
            <div className={`transition-all duration-700 ease-in-out overflow-hidden ${showBreathing ? 'h-32 opacity-100 mb-8' : 'h-0 opacity-0 mb-0'}`}>
                <div className="bg-white/30 dark:bg-black/30 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center animate-in slide-in-from-bottom-4">
                    <Wind size={32} className="text-white mb-2 animate-bounce" />
                    <p className="text-white font-bold text-lg">检测到压力过大</p>
                    <p className="text-white/80 text-sm">跟随背景律动，深呼吸 1 分钟</p>
                </div>
            </div>

            {/* Task Info */}
            <div className="mb-12 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-medium uppercase tracking-widest text-slate-800 dark:text-white/80">
                    Flow Mode
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                    {task.title}
                </h1>
            </div>

            {/* Timer */}
            <div className="relative mb-12">
                <div className="text-[5rem] font-light tracking-tighter tabular-nums leading-none text-slate-900 dark:text-white drop-shadow-sm">
                    {formatTimer(timeLeft)}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 rounded-full bg-white dark:bg-white/10 backdrop-blur-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-slate-900 dark:text-white"
                >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
            </div>
        </div>

        {/* Footer Action */}
        <button 
            onClick={() => {
                onComplete(task.id);
                onClose();
            }}
            className="w-full py-4 rounded-3xl bg-slate-900/10 dark:bg-white/10 backdrop-blur-md border border-white/20 text-slate-900 dark:text-white font-bold text-lg hover:bg-slate-900/20 dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2 group"
        >
            <CheckCircle2 size={24} />
            <span>完成任务</span>
        </button>

      </div>
    </div>
  );
};

export default FlowMode;
