import React, { useEffect, useState } from 'react';
import { WifiOff, Shield, ShieldCheck } from 'lucide-react';

interface Props {
  isAirGapMode: boolean;
}

export const OfflineIndicator: React.FC<Props> = ({ isAirGapMode }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isAirGapMode) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
        <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <span>Air-Gap Mode Active · 100% Isolated</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
        <WifiOff className="w-3.5 h-3.5 text-slate-500" />
        <span>Offline · Using Local Clinical Weights</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>Private Sandbox Active</span>
    </div>
  );
};
