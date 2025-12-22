import { useEffect, useState } from 'react';
import Snowfall from 'react-snowfall';

export function SeasonalSnowfall() {
  const [isWinter, setIsWinter] = useState(false);

  useEffect(() => {
    const month = new Date().getMonth(); // 0-11
    // December (11), January (0), February (1)
    if (month === 11 || month === 0 || month === 1) {
      setIsWinter(true);
    }
  }, []);

  if (!isWinter) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Snowfall 
        snowflakeCount={100}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
        }}
      />
    </div>
  );
}
