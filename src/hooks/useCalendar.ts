import { useState, useEffect, useCallback } from 'react';
import { getDB } from '@/lib/db';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export interface DayStats {
  date: string;
  completedTodos: number;
  completedHabits: number;
  pomodoroMinutes: number;
}

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState<Record<string, DayStats>>({});
  const [loading, setLoading] = useState(true);

  const fetchMonthStats = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      // Fetch Habit Logs count per day
      const habitLogs = await db.select<{ date: string; count: number }[]>(
        `SELECT date, COUNT(*) as count FROM habit_logs 
         WHERE date BETWEEN ? AND ? AND completed = 1 
         GROUP BY date`,
        [start, end]
      );

      // Fetch Completed Todos count per day (using completed_at if we had it, or due_date for now)
      // Note: Schema doesn't have completed_at yet, assuming due_date for visualization or just created_at
      // Let's use due_date for now as "tasks for that day"
      const todoCounts = await db.select<{ due_date: string; count: number }[]>(
        `SELECT due_date, COUNT(*) as count FROM todos 
         WHERE due_date BETWEEN ? AND ? AND completed = 1 
         GROUP BY due_date`,
        [start, end]
      );

      // Fetch Pomodoro Sessions sum per day (completed_at)
      const pomodoroSessions = await db.select<{ date: string; minutes: number }[]>(
        `SELECT date(completed_at) as date, SUM(duration) as minutes FROM pomodoro_sessions 
         WHERE date(completed_at) BETWEEN ? AND ? 
         GROUP BY date(completed_at)`,
        [start, end]
      );

      // Merge data
      const newStats: Record<string, DayStats> = {};
      
      habitLogs.forEach(row => {
        if (!newStats[row.date]) newStats[row.date] = { date: row.date, completedTodos: 0, completedHabits: 0, pomodoroMinutes: 0 };
        newStats[row.date].completedHabits = row.count;
      });

      todoCounts.forEach(row => {
        if (!row.due_date) return;
        if (!newStats[row.due_date]) newStats[row.due_date] = { date: row.due_date, completedTodos: 0, completedHabits: 0, pomodoroMinutes: 0 };
        newStats[row.due_date].completedTodos = row.count;
      });

      pomodoroSessions.forEach(row => {
        if (!newStats[row.date]) newStats[row.date] = { date: row.date, completedTodos: 0, completedHabits: 0, pomodoroMinutes: 0 };
        newStats[row.date].pomodoroMinutes = row.minutes;
      });

      setStats(newStats);
    } catch (error) {
      console.error('Failed to fetch calendar stats:', error);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchMonthStats();
  }, [fetchMonthStats]);

  const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  return {
    currentDate,
    stats,
    loading,
    nextMonth,
    prevMonth
  };
};
