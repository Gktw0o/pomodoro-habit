import { useState, useEffect, useCallback, useRef } from 'react';
import { getDB } from '@/lib/db';

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number; // Number of work sessions before long break
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

export const usePomodoro = () => {
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  // Use a ref for the timer interval to clear it properly
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load settings from DB on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const db = await getDB();
        const result = await db.select<{ value: string }[]>('SELECT value FROM settings WHERE key = ?', ['pomodoro_settings']);
        if (result.length > 0) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(result[0].value) });
        }
      } catch (error) {
        console.error('Failed to load pomodoro settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Update timeLeft when mode or settings change (only if not active)
  useEffect(() => {
    if (!isActive) {
      const duration = 
        mode === 'work' ? settings.workDuration :
        mode === 'shortBreak' ? settings.shortBreakDuration :
        settings.longBreakDuration;
      setTimeLeft(duration * 60);
    }
  }, [mode, settings, isActive]);

  const saveSession = useCallback(async (duration: number) => {
    try {
      const db = await getDB();
      await db.execute(
        'INSERT INTO pomodoro_sessions (duration, label) VALUES (?, ?)',
        [duration, 'Work Session']
      );
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, []);

  const switchMode = useCallback((newMode: PomodoroMode) => {
    setMode(newMode);
    // timeLeft will be updated by the useEffect listening to 'mode'
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Play sound
      const audio = new Audio('/notification.mp3'); // Ensure this file exists in public/
      audio.play().catch(() => {});

      if (mode === 'work') {
        saveSession(settings.workDuration);
        const newSessionsCompleted = sessionsCompleted + 1;
        setSessionsCompleted(newSessionsCompleted);

        // Decide next mode
        if (newSessionsCompleted % settings.longBreakInterval === 0) {
          switchMode('longBreak');
          if (settings.autoStartBreaks) setIsActive(true);
        } else {
          switchMode('shortBreak');
          if (settings.autoStartBreaks) setIsActive(true);
        }
      } else {
        // Break finished
        switchMode('work');
        if (settings.autoStartPomodoros) setIsActive(true);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, settings, saveSession, sessionsCompleted, switchMode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    const duration = 
      mode === 'work' ? settings.workDuration :
      mode === 'shortBreak' ? settings.shortBreakDuration :
      settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const changeMode = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsActive(false);
  };

  const updateSettings = async (newSettings: Partial<PomodoroSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    // Save to DB
    try {
      const db = await getDB();
      await db.execute(
        `INSERT INTO settings (key, value) VALUES ('pomodoro_settings', ?) 
         ON CONFLICT(key) DO UPDATE SET value = ?`,
        [JSON.stringify(updated), JSON.stringify(updated)]
      );
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return {
    mode,
    timeLeft,
    isActive,
    settings,
    sessionsCompleted,
    toggleTimer,
    resetTimer,
    changeMode,
    updateSettings
  };
};
