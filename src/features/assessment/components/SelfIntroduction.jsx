/**
 * SelfIntroduction - 2 questions with video/audio recording and Web Speech transcript
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { testService } from '../services/testService';
import { THEME_CLASSES } from '../../../theme';

const DEFAULT_QUESTIONS = [
  'Tell us about yourself and your professional background.',
  'What motivated you to apply for this role?',
];

const isSpeechSupported = !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

function QuestionRecorder({ question, questionIndex, onComplete, captionsEnabled = true }) {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const recognitionRef = useRef(null);
  const shouldRestartRef = useRef(true);
  const previewVideoRef = useRef(null);

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl, previewStream } = useReactMediaRecorder({
    video: true,
    audio: true,
    blobPropertyBag: { type: 'video/mp4' },
  });

  useEffect(() => {
    startRecording();
  }, [startRecording]);

  // Attach preview stream to video element
  useEffect(() => {
    if (previewVideoRef.current && previewStream) {
      previewVideoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  useEffect(() => {
    if (!isSpeechSupported) return;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalText = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t + ' ';
        else interim += t;
      }
      if (finalText) setTranscript((prev) => (prev ? prev + ' ' : '') + finalText.trim());
      setInterimTranscript(interim.trim());
    };

    recognition.onend = () => {
      if (shouldRestartRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }
    };

    recognitionRef.current = recognition;
    return () => {
      shouldRestartRef.current = false;
      try {
        recognition.stop();
      } catch {}
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (status === 'recording' && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {}
    }
  }, [status]);

  const handleComplete = useCallback(() => {
    if (submitting) return;
    setSubmitting(true);
    shouldRestartRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {}
    stopRecording();
  }, [submitting, stopRecording]);

  useEffect(() => {
    if (status === 'stopped' && submitting) {
      const combined = (transcript || '') + (interimTranscript ? ' ' + interimTranscript : '');
      const text = combined.trim() || 'No transcript available';
      if (mediaBlobUrl) {
        fetch(mediaBlobUrl)
          .then((res) => res.blob())
          .then((blob) => {
            onComplete({ blob, transcript: text });
          })
          .finally(() => {
            clearBlobUrl();
          });
      } else {
        onComplete({ blob: null, transcript: text });
      }
    }
  }, [status, submitting, mediaBlobUrl, transcript, interimTranscript, onComplete, clearBlobUrl]);

  return (
    <div className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50">
      <p className="font-medium text-slate-800 mb-2">Question {questionIndex + 1} of {DEFAULT_QUESTIONS.length}</p>
      <p className="text-slate-700 mb-4">{question}</p>

      {/* Camera preview */}
      <div className="mb-4 aspect-video max-w-sm bg-black rounded-lg overflow-hidden">
        <video ref={previewVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
      </div>

      {status === 'recording' && (
        <p className="text-sm text-green-600 mb-2 font-medium">Recording...</p>
      )}
      {isSpeechSupported && captionsEnabled && (
        <div className="mb-4 p-3 bg-white rounded border border-slate-100 min-h-[60px]">
          <p className="text-xs text-slate-500 mb-1">Live transcript:</p>
          <p className="text-sm text-slate-800">
            {(transcript || interimTranscript) ? (
              <>
                <span>{transcript}</span>
                {interimTranscript && <span className="text-slate-500"> {interimTranscript}</span>}
              </>
            ) : (
              <span className="text-slate-400">Speaking will appear here...</span>
            )}
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={handleComplete}
        disabled={submitting}
        className={`px-4 py-2 rounded-lg text-sm font-medium ${THEME_CLASSES.buttons.primary}`}
      >
        {submitting ? 'Saving...' : 'Finish recording'}
      </button>
    </div>
  );
}

export default function SelfIntroduction({ state }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [fallbackAnswers, setFallbackAnswers] = useState(['', '']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [useFallback, setUseFallback] = useState(false);
  const [started, setStarted] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);

  const handleQuestionComplete = useCallback((data) => {
    setResponses((prev) => {
      const next = [...prev, data];
      if (next.length < DEFAULT_QUESTIONS.length) {
        setCurrentQuestion(next.length);
      }
      return next;
    });
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // Build upload payload
      const hasVideos = responses.some((r) => r.blob);
      const uploadPromise = hasVideos && responses.length === 2
        ? (() => {
            const formData = new FormData();
            formData.append(
              'questions',
              JSON.stringify(
                DEFAULT_QUESTIONS.map((q, i) => ({
                  question: q,
                  audioText: responses[i]?.transcript || '',
                }))
              )
            );
            if (responses[0]?.blob) formData.append('video1', responses[0].blob, 'video1.mp4');
            if (responses[1]?.blob) formData.append('video2', responses[1].blob, 'video2.mp4');
            return testService.uploadSelfIntro(formData, state.practiceMode);
          })()
        : testService.uploadSelfIntro(
            {
              selfIntro: DEFAULT_QUESTIONS.map((q, i) => ({
                question: q,
                audioText: responses[i]?.transcript || '',
                s3Location: '',
              })),
            },
            state.practiceMode
          );

      // Fire upload in background — don't block the user
      uploadPromise.catch((err) => console.warn('Self-intro upload failed:', err));

      // Advance immediately
      state.handleSelfIntroComplete(
        DEFAULT_QUESTIONS.map((q, i) => ({ question: q, audioText: responses[i]?.transcript || '' }))
      );
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save');
      setSubmitting(false);
    }
  };

  const startTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setStarted(true);
    } catch (err) {
      console.warn('Media access failed, using text fallback:', err);
      setUseFallback(true);
    }
  };

  if (useFallback) {
    return (
      <div className={THEME_CLASSES.cards + ' p-6'}>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Self Introduction</h2>
        <p className="text-slate-600 mb-6">Please answer the following questions (text only).</p>
        <div className="space-y-6 mb-6">
          {DEFAULT_QUESTIONS.map((q, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-slate-700 mb-2">{q}</label>
              <textarea
                value={fallbackAnswers[i] ?? ''}
                onChange={(e) => {
                  setFallbackAnswers((prev) => {
                    const next = [...prev];
                    next[i] = e.target.value;
                    return next;
                  });
                }}
                className={THEME_CLASSES.inputs + ' min-h-[100px]'}
                placeholder="Type your response..."
              />
            </div>
          ))}
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          onClick={async () => {
            setSubmitting(true);
            setError(null);
            try {
              const uploadPromise = testService.uploadSelfIntro(
                {
                  selfIntro: DEFAULT_QUESTIONS.map((q, i) => ({
                    question: q,
                    audioText: fallbackAnswers[i] || '',
                    s3Location: '',
                  })),
                },
                state.practiceMode
              );
              uploadPromise.catch((err) => console.warn('Self-intro upload failed:', err));
              state.handleSelfIntroComplete(
                DEFAULT_QUESTIONS.map((q, i) => ({ question: q, audioText: fallbackAnswers[i] || '' }))
              );
            } catch (err) {
              setError(err?.response?.data?.message || err?.message || 'Failed to save');
              setSubmitting(false);
            }
          }}
          disabled={submitting}
          className={`px-6 py-2 rounded-lg font-medium ${THEME_CLASSES.buttons.primary}`}
        >
          {submitting ? 'Saving...' : 'Continue'}
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className={THEME_CLASSES.cards + ' p-6'}>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Self Introduction</h2>
        <p className="text-slate-600 mb-6">
          You will answer {DEFAULT_QUESTIONS.length} questions with video and audio recording.
          {!isSpeechSupported && ' (Speech-to-text is not supported in this browser.)'}
        </p>
        <button
          onClick={startTest}
          className={`px-6 py-2 rounded-lg font-medium ${THEME_CLASSES.buttons.primary}`}
        >
          Begin recording
        </button>
      </div>
    );
  }

  if (responses.length === 2 && !submitting) {
    return (
      <div className={THEME_CLASSES.cards + ' p-6'}>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Self Introduction</h2>
        <p className="text-slate-600 mb-6">Review your answers and submit.</p>
        {DEFAULT_QUESTIONS.map((q, i) => (
          <div key={i} className="mb-4 p-3 bg-slate-50 rounded">
            <p className="text-sm font-medium text-slate-700">{q}</p>
            <p className="text-slate-600">{responses[i]?.transcript || '(No transcript)'}</p>
          </div>
        ))}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`px-6 py-2 rounded-lg font-medium ${THEME_CLASSES.buttons.primary}`}
        >
          {submitting ? 'Saving...' : 'Continue'}
        </button>
      </div>
    );
  }

  if (responses.length === 2 && submitting) {
    return (
      <div className={THEME_CLASSES.cards + ' p-6'}>
        <p className="text-slate-600">Submitting...</p>
      </div>
    );
  }

  return (
    <div className={THEME_CLASSES.cards + ' p-6'}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Self Introduction</h2>
        {isSpeechSupported && (
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={captionsEnabled}
              onChange={(e) => setCaptionsEnabled(e.target.checked)}
              className="rounded border-slate-300 text-primary-500 focus:ring-primary-500"
            />
            Show captions
          </label>
        )}
      </div>
      <QuestionRecorder
        key={currentQuestion}
        question={DEFAULT_QUESTIONS[currentQuestion]}
        questionIndex={currentQuestion}
        onComplete={handleQuestionComplete}
        captionsEnabled={captionsEnabled}
      />
    </div>
  );
}
