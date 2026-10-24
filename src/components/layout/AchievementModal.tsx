import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { Award, Sparkles, X } from 'lucide-react';

export const AchievementModal: React.FC = () => {
  const { recentlyUnlockedBadge, dismissBadgeNotification } = useProgress();

  if (!recentlyUnlockedBadge) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce">
      <div className="bg-gradient-to-r from-navy-900 to-indigo-950 border-2 border-amber-400 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3 relative">
        <div className="text-3xl p-2 bg-amber-400/20 rounded-xl flex-shrink-0">
          {recentlyUnlockedBadge.icon}
        </div>
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Achievement Unlocked!</span>
          </div>
          <h4 className="text-sm font-extrabold text-white mt-0.5">
            {recentlyUnlockedBadge.title}
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            {recentlyUnlockedBadge.description}
          </p>
          <div className="mt-2 text-[11px] font-mono font-bold text-amber-300">
            +{recentlyUnlockedBadge.xpReward} XP Earned!
          </div>
        </div>
        <button
          onClick={dismissBadgeNotification}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
