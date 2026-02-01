
import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface MagSafeEffectProps {
  visible: boolean;
  onAnimationComplete: () => void;
  type?: 'consume' | 'recover';
  label?: string;
}

const MagSafeEffect: React.FC<MagSafeEffectProps> = ({ visible, onAnimationComplete, type = 'consume', label }) => {
  const [stage, setStage] = useState<'idle' | 'expand' | 'contract'>('idle');

  useEffect(() => {
    if (visible) {
      setStage('expand');
      const t1 = setTimeout(() => setStage('contract'), 800);
      const t2 = setTimeout(() => {
        setStage('idle');
        onAnimationComplete();
      }, 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [visible, onAnimationComplete]);

  if (!visible) return null;

  const colorClass = type === 'recover' 
    ? 'border-emerald-400 text-emerald-500 bg-emerald-100/20' 
    : 'border-teal-400 text-teal-500 bg-teal-100/20';

  const ringSize = stage === 'expand' ? 'scale-100 opacity-100' : 'scale-50 opacity-0';
  const iconScale = stage === 'expand' ? 'scale-100 opacity-100 delay-200' : 'scale-0 opacity-0';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="relative flex items-center justify-center">
        {/* Outer Ripple */}
        <div 
          className={`absolute w-[300px] h-[300px] rounded-full border-[8px] blur-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${colorClass} ${stage === 'expand' ? 'scale-150 opacity-40' : 'scale-50 opacity-0'}`}
        />
        
        {/* Main Ring */}
        <div 
          className={`relative w-48 h-48 rounded-full border-[6px] backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center flex-col gap-2 ${colorClass} ${ringSize}`}
        >
           <Check size={64} strokeWidth={4} className={`transition-all duration-500 ease-out ${iconScale}`} />
           {label && (
             <span className={`text-xl font-bold tracking-widest uppercase transition-all duration-500 delay-100 ${iconScale}`}>
                {label}
             </span>
           )}
        </div>
      </div>
    </div>
  );
};

export default MagSafeEffect;
