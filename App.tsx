
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import AuraBackground from './components/AuraBackground';
import FocusView from './views/FocusView';
import PulseView from './views/PulseView';
import LogEntryView from './views/LogEntryView';
import AnalyticsView from './views/AnalyticsView';
import ZenView from './views/ZenView';
import { ViewState, ScheduleEvent, EnergyLog } from './types';
import { MOCK_EVENTS } from './constants';
import { generateBioData, COLOR_SCALE } from './utils';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>(ViewState.FOCUS);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [events, setEvents] = useState<ScheduleEvent[]>(MOCK_EVENTS);
  
  // New Global Readiness State (Default 85 = Good Sleep)
  const [readiness, setReadiness] = useState<number>(85);
  
  // Store user logs
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>([]);

  // Derive Bio Data based on Readiness
  const currentBioData = useMemo(() => generateBioData(readiness), [readiness]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleLogEnergy = (level: number) => {
    // Determine label
    const match = COLOR_SCALE.find((s, i) => {
        const next = COLOR_SCALE[i+1];
        if (!next) return true;
        return level <= (s.val + next.val) / 2;
    });
    const label = match ? match.label : "状态平稳";

    const newLog: EnergyLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      level,
      label
    };
    setEnergyLogs(prev => [newLog, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.FOCUS:
        return (
          <FocusView 
            events={events} 
            setEvents={setEvents} 
            bioData={currentBioData} 
            readiness={readiness}
          />
        );
      case ViewState.PULSE:
        return (
          <PulseView 
            bioData={currentBioData} 
            readiness={readiness} 
            setReadiness={setReadiness} 
          />
        );
      case ViewState.LOG:
        return <LogEntryView onLog={handleLogEnergy} />;
      case ViewState.ANALYTICS:
        return <AnalyticsView logs={energyLogs} />;
      case ViewState.ZEN:
        return <ZenView events={events} />;
      default:
        return (
            <FocusView 
              events={events} 
              setEvents={setEvents} 
              bioData={currentBioData} 
              readiness={readiness}
            />
        );
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {/* Background stays full screen */}
      <div className="fixed inset-0 bg-[#E0E0E2] dark:bg-[#000] z-[-1]"></div>
      
      {/* Mac/Desktop Adapter Container */}
      <div className="relative w-full h-screen flex items-center justify-center">
        
        {/* App Frame - Responsive constraints */}
        <div className="relative w-full h-full md:max-w-[480px] md:h-[92vh] md:max-h-[900px] bg-[#F5F5F7] dark:bg-[#09090b] md:rounded-[40px] shadow-2xl overflow-hidden transition-all duration-500 border-0 md:border-8 border-white/50 dark:border-[#1a1a1a]">
            
            <AuraBackground />
            
            <Layout 
              currentView={currentView} 
              setView={setView} 
              isDarkMode={isDarkMode} 
              toggleTheme={toggleTheme}
              events={events}
            >
              {renderView()}
            </Layout>

        </div>
      </div>
    </div>
  );
};

export default App;
