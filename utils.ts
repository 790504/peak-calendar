
import { BioMetricPoint, ScheduleEvent } from './types';

export const COLOR_SCALE = [
  { val: 0, color: [239, 68, 68], hex: '#EF4444', label: '低效' },     // Red-500
  { val: 25, color: [249, 115, 22], hex: '#F97316', label: '疲惫' },   // Orange-500
  { val: 50, color: [234, 179, 8], hex: '#EAB308', label: '平稳' },    // Yellow-500
  { val: 75, color: [16, 185, 129], hex: '#10B981', label: '高效' },   // Emerald-500
  { val: 100, color: [99, 102, 241], hex: '#6366F1', label: '心流' }   // Indigo-500
];

export const getInterpolatedColor = (value: number): string => {
  const stops = COLOR_SCALE;
  if (value <= 0) return `rgb(${stops[0].color.join(',')})`;
  if (value >= 100) return `rgb(${stops[stops.length - 1].color.join(',')})`;

  for (let i = 0; i < stops.length - 1; i++) {
    const start = stops[i];
    const end = stops[i + 1];
    if (value >= start.val && value <= end.val) {
      const t = (value - start.val) / (end.val - start.val);
      const r = Math.round(start.color[0] + (end.color[0] - start.color[0]) * t);
      const g = Math.round(start.color[1] + (end.color[1] - start.color[1]) * t);
      const b = Math.round(start.color[2] + (end.color[2] - start.color[2]) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  return `rgb(${stops[stops.length - 1].color.join(',')})`;
};

export const getEnergyColor = (level: number): string => {
  if (level >= 80) return 'text-indigo-800 bg-indigo-100 border-indigo-200 dark:text-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800'; 
  if (level >= 60) return 'text-emerald-800 bg-emerald-100 border-emerald-200 dark:text-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800'; 
  if (level >= 40) return 'text-yellow-800 bg-yellow-100 border-yellow-200 dark:text-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800';
  if (level >= 20) return 'text-orange-800 bg-orange-100 border-orange-200 dark:text-orange-200 dark:bg-orange-900/30 dark:border-orange-800'; 
  return 'text-rose-800 bg-rose-100 border-rose-200 dark:text-rose-200 dark:bg-rose-900/30 dark:border-rose-800'; 
};

export const getEnergyGradient = (level: number): string => {
  if (level >= 80) return 'from-indigo-300/40 to-indigo-100/0 dark:from-indigo-500/20 dark:to-indigo-900/0';
  if (level >= 60) return 'from-emerald-300/40 to-emerald-100/0 dark:from-emerald-500/20 dark:to-emerald-900/0';
  if (level >= 40) return 'from-yellow-300/40 to-yellow-100/0 dark:from-yellow-500/20 dark:to-yellow-900/0';
  if (level >= 20) return 'from-orange-300/40 to-orange-100/0 dark:from-orange-500/20 dark:to-orange-900/0';
  return 'from-rose-300/40 to-rose-100/0 dark:from-rose-500/20 dark:to-rose-900/0';
};

export const formatTime = (decimalTime: number): string => {
  const hours = Math.floor(decimalTime);
  const minutes = Math.round((decimalTime - hours) * 60);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHour}:${formattedMinutes} ${ampm}`;
};

export const calculateMatchScore = (eventIntensity: number, energyLevel: number): number => {
  const normalizedIntensity = eventIntensity * 20;
  const diff = Math.abs(normalizedIntensity - energyLevel);
  return Math.max(0, 100 - diff);
};

export const getIntensityLabel = (intensity: number): string => {
  if (intensity === 1) return '恢复/休息';
  if (intensity >= 4) return '深度专注';
  if (intensity >= 3) return '中等负荷';
  return '轻松休闲';
};

export const getIntensityColor = (intensity: number): string => {
  // Premium Light Mode Pills vs Dark Mode Neon Pills
  if (intensity === 1) return 'text-emerald-700 bg-emerald-100/80 border-emerald-200 shadow-sm dark:text-emerald-300 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:shadow-none';
  if (intensity >= 4) return 'text-teal-700 bg-teal-100/80 border-teal-200 shadow-sm dark:text-teal-300 dark:bg-teal-500/20 dark:border-teal-500/30 dark:shadow-none';
  if (intensity >= 3) return 'text-blue-700 bg-blue-100/80 border-blue-200 shadow-sm dark:text-blue-300 dark:bg-blue-500/20 dark:border-blue-500/30 dark:shadow-none';
  return 'text-indigo-700 bg-indigo-100/80 border-indigo-200 shadow-sm dark:text-indigo-300 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:shadow-none';
};

export const calculateEnergyDelta = (duration: number, intensity: number): number => {
  // Duration in hours
  // Intensity 1 (Health/Rest) = Recovery (+15% per hour)
  if (intensity === 1) return Math.round(duration * 15);
  
  // Intensity 2-5: Consumption
  const baseBurn = 5;
  const intensityFactor = (intensity - 1) * 5; 
  return Math.round(duration * -(baseBurn + intensityFactor));
};

// --- NEW: Generate Bio Data based on Readiness ---
export const generateBioData = (readiness: number): BioMetricPoint[] => {
  const isLowReadiness = readiness < 60;
  
  return Array.from({ length: 24 }, (_, i) => {
    let level = 50;

    // Base Curve Logic
    if (i >= 6 && i < 11) level = 60 + (i - 6) * 8; // Morning rise
    if (i === 11) level = 95; // Peak
    if (i >= 12 && i < 15) level = 95 - (i - 11) * 15; // Dip
    if (i >= 15 && i < 19) level = 50 + (i - 15) * 5; // Recovery
    if (i >= 19) level = 70 - (i - 19) * 10; // Wind down
    if (i < 6) level = 30 + i * 2; // Sleep

    // Apply Readiness Modifier
    if (isLowReadiness) {
      // Flatten peaks, deepen dips
      if (level > 50) level = level * 0.8; // Reduce peaks by 20%
      if (level < 50) level = level * 0.9; // Lower lows slightly
    }

    // Ensure bounds
    return {
      hour: i,
      energyLevel: Math.max(10, Math.min(100, Math.round(level))),
      source: 'prediction'
    };
  });
};
