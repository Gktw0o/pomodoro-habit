import { useEffect } from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { Trophy, X } from 'lucide-react';

export function AchievementToast() {
  const { newUnlocks, clearNewUnlocks } = useAchievements();

  useEffect(() => {
    if (newUnlocks.length > 0) {
      const timer = setTimeout(() => {
        clearNewUnlocks();
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [newUnlocks, clearNewUnlocks]);

  if (newUnlocks.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-2 pointer-events-none">
      {newUnlocks.map((achievement) => (
        <div 
          key={achievement.id}
          className="bg-zinc-900 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right fade-in duration-500 pointer-events-auto min-w-[300px]"
        >
          <div className="p-2 bg-yellow-500 rounded-lg text-black">
            <Trophy size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-yellow-500">Achievement Unlocked!</h4>
            <p className="font-bold">{achievement.title}</p>
            <p className="text-xs text-zinc-400">{achievement.description}</p>
          </div>
          <button 
            onClick={clearNewUnlocks}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
