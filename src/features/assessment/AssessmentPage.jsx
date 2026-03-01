/**
 * AssessmentPage - Orchestrator for assessment flow
 * Renders stage components based on currentStage
 */
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAssessmentState } from './hooks/useAssessmentState';
import { testService } from './services/testService';
import { startFaceMonitoring, startAudioMonitoring } from './services/aiProctorService';
import PreTestScreen from './components/PreTestScreen';
import TestSetup from './components/TestSetup';
import SelfIntroduction from './components/SelfIntroduction';
import CodeEditor from './components/CodeEditor';
import ResultsView from './components/ResultsView';
import FullscreenOverlay from './components/FullscreenOverlay';
import ProctorOverlay from './components/ProctorOverlay';
import ViolationsPanel from './components/ViolationsPanel';

const STAGE_COMPONENTS = {
  'privacy-check': PreTestScreen,
  setup: TestSetup,
  'self-introduction': SelfIntroduction,
  code: CodeEditor,
  results: ResultsView,
};

export default function AssessmentPage() {
  const state = useAssessmentState();
  const StageComponent = STAGE_COMPONENTS[state.currentStage] || PreTestScreen;

  const fullscreenRequired = state.currentStage === 'code';
  const proctorActive = fullscreenRequired;

  const [violations, setViolations] = useState([]);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const faceControllerRef = useRef(null);
  const audioControllerRef = useRef(null);

  const violationStats = useMemo(() => {
    const stats = { gaze: 0, presence: 0, multiple_faces: 0, audio_silence: 0, loud_noise: 0 };
    violations.forEach((v) => {
      if (stats[v.type] !== undefined) stats[v.type]++;
    });
    return stats;
  }, [violations]);

  const handleViolation = useCallback((type, alert) => {
    const v = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      alert,
      timestamp: new Date().toISOString(),
    };
    setViolations((prev) => [...prev, v]);
    testService.storeViolation({ type, alert, timestamp: v.timestamp }).catch(console.warn);
  }, []);

  useEffect(() => {
    if (!proctorActive) return;

    let mediaStream = null;
    const setup = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
      } catch (err) {
        console.warn('Proctoring setup failed:', err);
      }
    };
    setup();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
      }
      setStream(null);
    };
  }, [proctorActive]);

  useEffect(() => {
    if (!proctorActive || !stream || !videoRef.current) return;

    const faceCtrl = startFaceMonitoring(videoRef.current, handleViolation);
    if (faceCtrl) {
      faceControllerRef.current = faceCtrl;
      faceCtrl.start();
    }
    const audioCtrl = startAudioMonitoring(stream, handleViolation);
    if (audioCtrl) {
      audioControllerRef.current = audioCtrl;
      audioCtrl.start();
    }

    return () => {
      if (faceControllerRef.current) {
        faceControllerRef.current.stop();
        faceControllerRef.current = null;
      }
      if (audioControllerRef.current) {
        audioControllerRef.current.stop();
        audioControllerRef.current = null;
      }
    };
  }, [proctorActive, stream, handleViolation]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <FullscreenOverlay required={fullscreenRequired} />
      {proctorActive && (
        <>
          <ProctorOverlay stream={stream} videoRef={videoRef} />
          <ViolationsPanel violations={violations} violationStats={violationStats} />
        </>
      )}
      {/* Compact progress: Step X of 4 */}
      {state.currentStage !== 'results' && (
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm text-slate-600 mb-1">
            <span>Step {state.currentStepIndex} of {state.totalSteps}</span>
            {state.practiceMode && (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Practice mode
              </span>
            )}
          </div>
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${state.progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <StageComponent state={state} />
    </div>
  );
}
