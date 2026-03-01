/**
 * AI Proctor Service - Face and audio monitoring for assessment proctoring
 * Ported from skilltera_prod1 AI-ProctorService.js
 */
import { nets, detectAllFaces, TinyFaceDetectorOptions } from 'face-api.js';

let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return true;
  try {
    const MODEL_URL = '/models';
    await Promise.all([
      nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
    return true;
  } catch (error) {
    console.error('Error loading face detection models:', error);
    return false;
  }
}

function distance(p1, p2) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

function calculateEyeAspectRatio(eyePoints) {
  if (!eyePoints || eyePoints.length < 6) return 1.0;
  const verticalDist1 = distance(eyePoints[1], eyePoints[5]);
  const verticalDist2 = distance(eyePoints[2], eyePoints[4]);
  const horizontalDist = distance(eyePoints[0], eyePoints[3]);
  if (horizontalDist === 0) return 1.0;
  return (verticalDist1 + verticalDist2) / (2.0 * horizontalDist);
}

function calculateHorizontalGaze(eyePoints) {
  if (!eyePoints || eyePoints.length < 6) return 0;
  const pupilX = (eyePoints[1].x + eyePoints[2].x + eyePoints[4].x + eyePoints[5].x) / 4;
  const eyeLeft = eyePoints[0].x;
  const eyeRight = eyePoints[3].x;
  return (2 * (pupilX - eyeLeft) / (eyeRight - eyeLeft)) - 1;
}

function isLookingAway(landmarks) {
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const leftEAR = calculateEyeAspectRatio(leftEye);
  const rightEAR = calculateEyeAspectRatio(rightEye);
  const leftGaze = calculateHorizontalGaze(leftEye);
  const rightGaze = calculateHorizontalGaze(rightEye);
  return (
    (leftEAR < 0.2 && rightEAR < 0.2) ||
    Math.abs(leftGaze) > 0.3 ||
    Math.abs(rightGaze) > 0.3
  );
}

export function startFaceMonitoring(videoElement, onViolation) {
  if (!videoElement) {
    console.error('Video element required for face monitoring');
    return null;
  }

  let isRunning = false;
  let animationFrameId = null;
  let lastGazeTime = 0;
  let lastPresenceTime = 0;
  let consecutiveNoFaceFrames = 0;
  let lastProcessedTime = 0;
  let faceDetectionOptions = null;
  let modelsReady = false;

  const processFrame = async () => {
    if (!isRunning || !videoElement || videoElement.paused || videoElement.ended) return;
    if (!modelsReady) {
      animationFrameId = requestAnimationFrame(processFrame);
      return;
    }
    const now = Date.now();
    if (now - lastProcessedTime < 200) {
      animationFrameId = requestAnimationFrame(processFrame);
      return;
    }
    lastProcessedTime = now;

    try {
      if (
        videoElement.readyState >= 4 &&
        videoElement.videoWidth > 0 &&
        videoElement.videoHeight > 0
      ) {
        const detections = await detectAllFaces(videoElement, faceDetectionOptions)
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections.length === 0) {
          consecutiveNoFaceFrames++;
          if (consecutiveNoFaceFrames >= 10 && now - lastPresenceTime > 5000) {
            lastPresenceTime = now;
            onViolation('presence', 'No face detected for an extended period');
          }
        } else {
          consecutiveNoFaceFrames = 0;
          if (detections.length > 1 && now - lastPresenceTime > 5000) {
            lastPresenceTime = now;
            onViolation('multiple_faces', `${detections.length} faces detected`);
          }
          const detection = detections[0];
          if (detection.landmarks) {
            const lookingAway = isLookingAway(detection.landmarks);
            if (lookingAway && now - lastGazeTime > 5000) {
              lastGazeTime = now;
              onViolation('gaze', 'Looking away from the screen');
            }
          }
        }
      }
    } catch (err) {
      console.error('Face processing error:', err);
    }
    animationFrameId = requestAnimationFrame(processFrame);
  };

  const start = async () => {
    const ok = await loadModels();
    if (!ok) return false;
    modelsReady = true;
    faceDetectionOptions = new TinyFaceDetectorOptions({
      inputSize: 320,
      scoreThreshold: 0.5,
    });
    isRunning = true;
    processFrame();
    return true;
  };

  const stop = () => {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  return { start, stop };
}

export function startAudioMonitoring(stream, onViolation) {
  if (!stream) {
    console.error('Audio stream required for audio monitoring');
    return null;
  }

  let isRunning = false;
  let audioContext = null;
  let analyser = null;
  let dataArray = null;
  let source = null;
  let silenceTimer = null;
  let loudNoiseTimer = null;
  let intervalId = null;

  const SILENCE_THRESHOLD = 5;
  const SILENCE_DURATION_MS = 120000; // 2 min
  const LOUD_THRESHOLD = 220;
  const LOUD_DURATION_MS = 3000;

  const initialize = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioContext = new Ctx();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      return true;
    } catch (err) {
      console.error('Audio init error:', err);
      return false;
    }
  };

  const processAudio = () => {
    if (!isRunning || !analyser) return;
    try {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      let peak = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
        if (dataArray[i] > peak) peak = dataArray[i];
      }
      const average = sum / dataArray.length;

      if (average < SILENCE_THRESHOLD) {
        if (!silenceTimer) {
          silenceTimer = setTimeout(() => {
            onViolation('audio_silence', 'Extended silence detected');
          }, SILENCE_DURATION_MS);
        }
      } else {
        if (silenceTimer) {
          clearTimeout(silenceTimer);
          silenceTimer = null;
        }
      }

      if (average > LOUD_THRESHOLD) {
        if (!loudNoiseTimer) {
          loudNoiseTimer = setTimeout(() => {
            onViolation('loud_noise', 'Loud noise detected');
          }, LOUD_DURATION_MS);
        }
      } else {
        if (loudNoiseTimer) {
          clearTimeout(loudNoiseTimer);
          loudNoiseTimer = null;
        }
      }
    } catch (err) {
      console.error('Audio processing error:', err);
    }
  };

  const start = () => {
    if (initialize()) {
      isRunning = true;
      intervalId = setInterval(processAudio, 200);
      return true;
    }
    return false;
  };

  const stop = () => {
    isRunning = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }
    if (loudNoiseTimer) {
      clearTimeout(loudNoiseTimer);
      loudNoiseTimer = null;
    }
    if (source) {
      source.disconnect();
      source = null;
    }
    if (audioContext) {
      audioContext.close().catch(console.error);
      audioContext = null;
    }
  };

  return { start, stop };
}
