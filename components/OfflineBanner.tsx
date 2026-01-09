"use client";

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-amber-600 px-4 py-2 text-white flex items-center justify-center gap-2 text-sm font-medium animate-in slide-in-from-top-full fixed top-0 left-0 w-full z-50">
      <WifiOff className="w-4 h-4" />
      <span>You are currently offline. Some features may be limited.</span>
    </div>
  );
}
