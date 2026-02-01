import React from 'react';

const AuraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#F5F5F7] dark:bg-[#09090b] transition-colors duration-500">
      {/* Top Left Blob - Soft Teal (Light) / Deep Emerald (Dark) */}
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-teal-200/40 dark:bg-emerald-900/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-multiply dark:mix-blend-normal transition-colors duration-500" />
      
      {/* Bottom Right Blob - Soft Lavender (Light) / Deep Violet (Dark) */}
      <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-indigo-200/40 dark:bg-violet-900/20 rounded-full blur-[140px] animate-float mix-blend-multiply dark:mix-blend-normal transition-colors duration-500" />
      
      {/* Center Blob - Soft Warmth (Light) / Deep Blue (Dark) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[100px] transition-colors duration-500" />
      
      {/* Noise Overlay for paper texture */}
      <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    </div>
  );
};

export default AuraBackground;