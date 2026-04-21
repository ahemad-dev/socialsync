import React, { useEffect, useState } from 'react';
import logo from '/socialsync.png'; // apna logo "frontend/public" folder me dal do

export default function SplashScreen({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFade(true), 1500);
    const timer2 = setTimeout(onFinish, 2000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gradient-to-b from-palette3 to-palette6 transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      <img src={logo} alt="SocialSync Logo" className="w-32 h-32 animate-pulse" />
    </div>
  );
}
