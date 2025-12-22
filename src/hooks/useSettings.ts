import { useState, useEffect } from 'react';
import { getDB } from '@/lib/db';
import { useAppStore } from '@/store';
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';

export const useSettings = () => {
  const { theme, setTheme, backgroundImage, setBackgroundImage } = useAppStore();
  const [loading, setLoading] = useState(true);

  // Load settings from DB on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const db = await getDB();
        const result = await db.select<{ key: string, value: string }[]>('SELECT * FROM settings WHERE key IN (?, ?)', ['theme', 'background_image']);
        
        result.forEach(row => {
          if (row.key === 'theme') {
            setTheme(JSON.parse(row.value));
          } else if (row.key === 'background_image') {
            const url = JSON.parse(row.value);
            // Re-convert file src if it was a local path
            if (url && !url.startsWith('http')) {
                 // Already converted or stored as path?
                 // Let's assume we store the raw path and convert on load
                 setBackgroundImage(convertFileSrc(url));
            } else {
                 setBackgroundImage(url);
            }
          }
        });
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [setTheme, setBackgroundImage]);

  // Sync theme with HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const updateTheme = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    try {
      const db = await getDB();
      await db.execute(
        `INSERT INTO settings (key, value) VALUES ('theme', ?) 
         ON CONFLICT(key) DO UPDATE SET value = ?`,
        [JSON.stringify(newTheme), JSON.stringify(newTheme)]
      );
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const selectBackgroundImage = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Images',
          extensions: ['png', 'jpg', 'jpeg', 'webp']
        }]
      });

      if (selected && typeof selected === 'string') {
        const assetUrl = convertFileSrc(selected);
        setBackgroundImage(assetUrl);

        // Save raw path to DB
        const db = await getDB();
        await db.execute(
          `INSERT INTO settings (key, value) VALUES ('background_image', ?) 
           ON CONFLICT(key) DO UPDATE SET value = ?`,
          [JSON.stringify(selected), JSON.stringify(selected)]
        );
      }
    } catch (error) {
      console.error('Failed to select image:', error);
    }
  };

  const clearBackgroundImage = async () => {
    setBackgroundImage(null);
    try {
      const db = await getDB();
      await db.execute("DELETE FROM settings WHERE key = 'background_image'");
    } catch (error) {
      console.error('Failed to clear background image:', error);
    }
  };

  return {
    theme,
    updateTheme,
    selectBackgroundImage,
    clearBackgroundImage,
    backgroundImage,
    loading
  };
};
