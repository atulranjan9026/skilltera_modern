/**
 * ProctorOverlay - 120x100px camera feed overlay during problem/code stages
 */
import { useEffect } from 'react';

export default function ProctorOverlay({ stream, videoRef }) {
  useEffect(() => {
    if (videoRef?.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play?.().catch(() => {});
    }
  }, [stream, videoRef]);

  if (!stream) return null;

  return (
    <div
      className="fixed bottom-5 right-5 w-[120px] h-[100px] rounded-lg overflow-hidden shadow-lg z-[10000] bg-slate-100 border border-slate-200"
      aria-label="Proctor camera feed"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-contain origin-center"
        style={{ transform: 'scaleX(-1)' }}
      />
    </div>
  );
}
