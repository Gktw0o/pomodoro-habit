import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useProfile } from '@/hooks/useProfile';
import { isSameDay, parseISO } from 'date-fns';

export function BirthdayCelebration() {
  const { profile } = useProfile();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    // Set initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (profile?.birth_date) {
      const today = new Date();
      // Create a date object for this year's birthday
      const birthDate = parseISO(profile.birth_date);
      const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      
      if (isSameDay(today, birthdayThisYear)) {
        setShowConfetti(true);
        // Stop confetti after 10 seconds
        const timer = setTimeout(() => setShowConfetti(false), 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [profile]);

  if (!showConfetti) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={true}
        numberOfPieces={200}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-black/80 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl border border-yellow-200 animate-in fade-in zoom-in duration-500">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
          Happy Birthday, {profile?.first_name}! 🎉
        </h1>
      </div>
    </div>
  );
}
