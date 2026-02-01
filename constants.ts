
import { BioMetricPoint, ScheduleEvent, WeeklyStat, Suggestion, EnvironmentalInsight } from './types';

// Simulate a typical Circadian Rhythm (Dip in afternoon, peak in late morning)
export const MOCK_BIO_DATA: BioMetricPoint[] = Array.from({ length: 24 }, (_, i) => {
  let level = 50;
  // Morning rise
  if (i >= 6 && i < 11) level = 60 + (i - 6) * 8;
  // Pre-lunch peak
  if (i === 11) level = 95;
  // Post-lunch dip
  if (i >= 12 && i < 15) level = 95 - (i - 11) * 15;
  // Afternoon recovery
  if (i >= 15 && i < 19) level = 50 + (i - 15) * 5;
  // Evening wind down
  if (i >= 19) level = 70 - (i - 19) * 10;
  // Sleep
  if (i < 6) level = 30 + i * 2;

  return {
    hour: i,
    energyLevel: Math.max(10, Math.min(100, level)),
    source: 'prediction'
  };
});

export const MOCK_EVENTS: ScheduleEvent[] = [
  {
    id: '1',
    title: '深度工作：战略规划',
    startTime: 9,
    duration: 2,
    intensity: 5,
    category: 'work',
    completed: false
  },
  {
    id: '2',
    title: '团队同步会',
    startTime: 13, // 1 PM - Energy Dip!
    duration: 1,
    intensity: 3,
    category: 'work',
    completed: false
  },
  {
    id: '3',
    title: '力量训练',
    startTime: 17.5,
    duration: 1.5,
    intensity: 4,
    category: 'health',
    completed: false
  }
];

export const WEEKLY_STATS: WeeklyStat[] = [
  { day: '周一', efficiency: 85, sleep: 7.5 },
  { day: '周二', efficiency: 72, sleep: 6.0 },
  { day: '周三', efficiency: 90, sleep: 8.0 },
  { day: '周四', efficiency: 65, sleep: 5.5 },
  { day: '周五', efficiency: 88, sleep: 7.2 },
  { day: '周六', efficiency: 95, sleep: 9.0 },
  { day: '周日', efficiency: 92, sleep: 8.5 },
];

export const COLORS = {
  high: '#34D399', // Green
  mid: '#60A5FA',  // Blue
  low: '#F87171',  // Red (for mismatch) or Purple for low energy state
};

export const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: 'opt-1',
    type: 'optimization',
    title: '巅峰专注窗口',
    message: "预计明日 10:00 - 12:00 您的能量将达到峰值。建议利用此段时间处理高强度的‘深度专注’任务（如：准备 Q3 季度报告）。",
    actionLabel: '安排任务',
    timeSlot: '10:00 AM - 12:00 PM',
    intensityContext: 'high'
  }
];

export const MOCK_ENV_INSIGHTS: EnvironmentalInsight[] = [
    {
        id: 'env-1',
        type: 'weather',
        label: '天气关联',
        value: '阴天',
        trend: '+15% 能量',
        trendType: 'positive',
        description: '你通常在阴天的能量比平时高 15%，适合安排深度思考。',
        iconName: 'CloudRain'
    },
    {
        id: 'env-2',
        type: 'location',
        label: '地点压力',
        value: '办公室',
        trend: '高压预警',
        trendType: 'negative',
        description: '在办公室时的压力峰值通常出现在周二下午。',
        iconName: 'MapPin'
    },
    {
        id: 'env-3',
        type: 'light',
        label: '光照环境',
        value: '晨间偏低',
        trend: '需补光',
        trendType: 'neutral',
        description: '上午环境光低于 300 lux，导致褪黑素消退延迟。',
        iconName: 'Sun'
    }
];
