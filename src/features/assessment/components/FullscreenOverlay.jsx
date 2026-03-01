/**
 * FullscreenOverlay - Blocks assessment until user enters fullscreen
 * Shown when fullscreen is required (problem/code stages) and user is not in fullscreen
 */
import { useEffect, useState } from 'react';

export default function FullscreenOverlay({ required }) {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [hasBeenFullscreen, setHasBeenFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      const fs = !!document.fullscreenElement || !!document.webkitFullscreenElement;
      setIsFullscreen(fs);
      if (fs) setHasBeenFullscreen(true);
    };
    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
    };
  }, []);

  const enterFullscreen = () => {
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) req.call(el).catch(console.warn);
  };

  if (!required || isFullscreen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <div className="text-white text-center mb-5">
        <p className="text-xl font-bold">Fullscreen Mode Required</p>
        <p className="text-base font-normal mt-2">This test must be taken in fullscreen mode</p>
      </div>
      <button
        type="button"
        onClick={enterFullscreen}
        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg animate-pulse"
      >
        {hasBeenFullscreen ? 'Return to Fullscreen Mode' : 'Enter Fullscreen Mode'}
      </button>
    </div>
  );
}
