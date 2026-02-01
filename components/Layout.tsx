
import React from 'react';
import { ViewState, ScheduleEvent } from '../types';
import { Calendar, Activity, PlusCircle, BarChart2, Sparkles, Moon, Sun } from 'lucide-react';
import EnergyBattery from './EnergyBattery';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  events: ScheduleEvent[];
}

const NavItem: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string 
}> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 w-16 transition-all duration-300 ${active ? 'text-slate-900 dark:text-white scale-110' : 'text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/60'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
    {active && <div className="w-1 h-1 bg-slate-900 dark:bg-white rounded-full absolute -bottom-2" />}
  </button>
);

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children, isDarkMode, toggleTheme, events }) => {
  return (
    <div className="flex flex-col h-screen w-full text-slate-900 dark:text-white overflow-hidden font-sans relative">
      
      {/* Top Bar Area */}
      <div className="absolute top-6 left-8 z-50 flex items-center gap-4">
        {/* Energy Battery Widget */}
        <EnergyBattery events={events} />
      </div>

      {/* Theme Toggle Button - Floating Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={toggleTheme} 
          className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm flex items-center justify-center transition-all duration-300 hover:bg-white dark:hover:bg-white/20 active:scale-95 text-slate-600 dark:text-white/70"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Dynamic Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {/* Floating Glass Navigation */}
      <div className="absolute bottom-6 left-4 right-4 h-20 rounded-[2.5rem] bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-between px-6 z-50 transition-colors duration-500">
        <NavItem 
          active={currentView === ViewState.FOCUS} 
          onClick={() => setView(ViewState.FOCUS)} 
          icon={<Calendar size={24} strokeWidth={currentView === ViewState.FOCUS ? 2.5 : 2} />} 
          label="专注"
        />
        <NavItem 
          active={currentView === ViewState.PULSE} 
          onClick={() => setView(ViewState.PULSE)} 
          icon={<Activity size={24} strokeWidth={currentView === ViewState.PULSE ? 2.5 : 2} />} 
          label="脉搏"
        />
        <div className="relative -top-6">
           <button 
             onClick={() => setView(ViewState.LOG)}
             className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-4 border-[#F5F5F7] dark:border-[#09090b]
               ${currentView === ViewState.LOG 
                 ? 'bg-slate-900 dark:bg-white text-white dark:text-black rotate-90 scale-110' 
                 : 'bg-white dark:bg-white/10 text-slate-900 dark:text-white backdrop-blur-xl hover:bg-slate-50 dark:hover:bg-white/20'}`}
           >
             <PlusCircle size={32} strokeWidth={1.5} />
           </button>
        </div>
        <NavItem 
          active={currentView === ViewState.ANALYTICS} 
          onClick={() => setView(ViewState.ANALYTICS)} 
          icon={<BarChart2 size={24} strokeWidth={currentView === ViewState.ANALYTICS ? 2.5 : 2} />} 
          label="统计"
        />
        <NavItem 
          active={currentView === ViewState.ZEN} 
          onClick={() => setView(ViewState.ZEN)} 
          icon={<Sparkles size={24} strokeWidth={currentView === ViewState.ZEN ? 2.5 : 2} />} 
          label="灵感"
        />
      </div>
    </div>
  );
};

export default Layout;
