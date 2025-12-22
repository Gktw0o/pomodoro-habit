import { useStats } from "@/hooks/useStats";
import { useProfile } from "@/hooks/useProfile";
import { useAchievements } from "@/hooks/useAchievements";
import { Timer, CheckSquare, ListTodo, Flame, Trophy, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function Profile() {
  const { stats, loading: statsLoading } = useStats();
  const { profile, loading: profileLoading } = useProfile();
  const { unlocked, allAchievements } = useAchievements();

  if (statsLoading || profileLoading) {
    return <div className="text-center py-12 text-zinc-500">Loading profile...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl text-white font-bold shadow-lg">
          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {profile?.first_name} {profile?.last_name}
          </h2>
          <p className="text-zinc-500">Productivity Master</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center gap-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
            <Timer size={20} />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {Math.floor(stats.totalPomodoroMinutes / 60)}h
            </p>
            <p className="text-xs text-zinc-500">Focus Time</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center gap-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
            <CheckSquare size={20} />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {stats.totalHabitsCompleted}
            </p>
            <p className="text-xs text-zinc-500">Habits Done</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center gap-2">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
            <Flame size={20} />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {stats.currentStreak}
            </p>
            <p className="text-xs text-zinc-500">Day Streak</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
            <ListTodo size={20} />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {stats.totalTodosCompleted}
            </p>
            <p className="text-xs text-zinc-500">Tasks Done</p>
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="text-yellow-500" />
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Achievements</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            {unlocked.length} / {allAchievements.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {allAchievements.map((achievement) => {
            const isUnlocked = unlocked.some(u => u.id === achievement.id);
            
            return (
              <div 
                key={achievement.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl border transition-all",
                  isUnlocked 
                    ? "bg-white dark:bg-zinc-800 border-yellow-200 dark:border-yellow-900/30" 
                    : "bg-zinc-100 dark:bg-zinc-900 border-transparent opacity-60 grayscale"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isUnlocked ? "bg-yellow-100 text-yellow-600" : "bg-zinc-200 text-zinc-500"
                )}>
                  {isUnlocked ? <Trophy size={20} /> : <Lock size={20} />}
                </div>
                <div>
                  <h4 className={cn(
                    "font-medium text-sm",
                    isUnlocked ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500"
                  )}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-zinc-500">{achievement.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
