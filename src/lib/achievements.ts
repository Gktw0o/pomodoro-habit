import { Timer, CheckSquare, Flame, ListTodo } from 'lucide-react';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  iconName: 'Timer' | 'CheckSquare' | 'Flame' | 'ListTodo';
  condition: (stats: any) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Pomodoro Achievements
  {
    id: 'pomodoro_1',
    title: 'First Step',
    description: 'Complete your first Pomodoro session',
    iconName: 'Timer',
    condition: (stats) => stats.totalPomodoroMinutes >= 25
  },
  {
    id: 'pomodoro_100',
    title: 'Focus Master',
    description: 'Accumulate 100 hours of focus time',
    iconName: 'Timer',
    condition: (stats) => stats.totalPomodoroMinutes >= 100 * 60
  },
  
  // Habit Achievements
  {
    id: 'habit_1',
    title: 'Habit Starter',
    description: 'Complete your first habit',
    iconName: 'CheckSquare',
    condition: (stats) => stats.totalHabitsCompleted >= 1
  },
  {
    id: 'habit_100',
    title: 'Consistent',
    description: 'Complete 100 habits',
    iconName: 'CheckSquare',
    condition: (stats) => stats.totalHabitsCompleted >= 100
  },

  // Streak Achievements
  {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Reach a 3-day streak',
    iconName: 'Flame',
    condition: (stats) => stats.currentStreak >= 3
  },
  {
    id: 'streak_25',
    title: 'Unstoppable',
    description: 'Reach a 25-day streak',
    iconName: 'Flame',
    condition: (stats) => stats.currentStreak >= 25
  },
  {
    id: 'streak_50',
    title: 'Legendary',
    description: 'Reach a 50-day streak',
    iconName: 'Flame',
    condition: (stats) => stats.currentStreak >= 50
  },

  // Todo Achievements
  {
    id: 'todo_10',
    title: 'Task Crusher',
    description: 'Complete 10 tasks',
    iconName: 'ListTodo',
    condition: (stats) => stats.totalTodosCompleted >= 10
  }
];
