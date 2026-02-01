
export type EnergyLevel = number; // 0 to 100

export enum ViewState {
  FOCUS = 'FOCUS',
  PULSE = 'PULSE',
  LOG = 'LOG',
  ANALYTICS = 'ANALYTICS',
  ZEN = 'ZEN'
}

export interface BioMetricPoint {
  hour: number;
  energyLevel: EnergyLevel; // 0-100
  source: 'prediction' | 'actual';
}

export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: number; // Hour 0-23.5
  duration: number; // Hours
  intensity: number; // 1-5 (5 is highest cognitive load)
  category: 'work' | 'personal' | 'health';
  completed: boolean;
}

export interface Suggestion {
  id: string;
  type: 'optimization' | 'reschedule' | 'rest';
  title: string;
  message: string;
  actionLabel: string;
  timeSlot?: string;
  intensityContext?: 'high' | 'medium' | 'low';
}

export interface DailyInsight {
  score: number; // 0-100 alignment score
  message: string;
  type: 'warning' | 'success' | 'info';
}

export interface WeeklyStat {
  day: string;
  efficiency: number;
  sleep: number;
}

export interface EnvironmentalInsight {
    id: string;
    type: 'weather' | 'location' | 'light' | 'sound';
    label: string;
    value: string;
    trend: string; // e.g., "+15%"
    trendType: 'positive' | 'negative' | 'neutral';
    description: string;
    iconName: string; 
}

export interface CoachInsight {
  id: string;
  type: 'reflow' | 'gap_warning';
  title: string;
  message: string;
  actionLabel: string;
  affectedEventIds?: string[];
  suggestedAction?: () => void;
}

export interface EnergyLog {
  id: string;
  timestamp: number;
  level: number;
  label: string;
}
