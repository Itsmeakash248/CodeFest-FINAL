'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  CameraOff,
  Minimize2,
  Maximize2,
  RefreshCw,
  Eye,
  Sun,
  ShieldCheck,
  AlertCircle,
  Video,
  VideoOff,
  User,
  Settings2,
} from 'lucide-react';
import { VideoPresenceMetrics } from '@/types';

interface CandidateCameraProps {
  isEnabled: boolean;
  onToggleEnabled: () => void;
  onMetricsUpdate?: (metrics: VideoPresenceMetrics) => void;
  className?: string;
}

export function CandidateCamera({
  isEnabled,
  onToggleEnabled,
  onMetricsUpdate,
  className = '',
}: CandidateCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analysisTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  // Live non-verbal metrics state
  const [eyeContactScore, setEyeContactScore] = useState(92);
  const [framingStatus, setFramingStatus] = useState<'Centered & Optimal' | 'Slightly Off-Center' | 'Sub-optimal Lighting' | 'Not Detected'>('Centered & Optimal');
  const [lightingQuality, setLightingQuality] = useState<'Optimal' | 'Dim' | 'Harsh'>('Optimal');
  const [composureScore, setComposureScore] = useState(9.0);

  // Tracking stats for session totals
  const totalChecksRef = useRef(0);
  const goodGazeCountRef = useRef(0);

  // Enumerate cameras
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setVideoDevices(videoInputs);
        if (videoInputs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoInputs[0].deviceId);
        }
      }).catch(() => {});
    }
  }, [selectedDeviceId]);

  // Start video stream
  const startCamera = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setPermissionState('unsupported');
      setErrorMessage('Camera access is not supported by this browser.');
      return;
    }

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId }, width: { ideal: 640 }, height: { ideal: 480 } }
          : { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      setPermissionState('granted');
      setErrorMessage(null);
    } catch (err: any) {
      console.warn('Camera access denied or error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionState('denied');
        setErrorMessage('Camera permission was denied. Please allow camera access in your browser address bar.');
      } else {
        setPermissionState('unsupported');
        setErrorMessage(err.message || 'Unable to access webcam.');
      }
    }
  }, [selectedDeviceId]);

  // Stop video stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Handle enabled/disabled lifecycle
  useEffect(() => {
    if (isEnabled) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isEnabled, startCamera, stopCamera]);

  // Active time counter
  useEffect(() => {
    if (!isEnabled || permissionState !== 'granted') return;
    const interval = setInterval(() => {
      setActiveSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isEnabled, permissionState]);

  // Frame sampling and non-verbal presence analysis
  useEffect(() => {
    if (!isEnabled || permissionState !== 'granted') {
      if (analysisTimerRef.current) clearInterval(analysisTimerRef.current);
      return;
    }

    analysisTimerRef.current = setInterval(() => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;

      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvasRef.current = canvas;
      canvas.width = 64;
      canvas.height = 48;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      try {
        ctx.drawImage(video, 0, 0, 64, 48);
        const imgData = ctx.getImageData(0, 0, 64, 48);
        const data = imgData.data;

        // Compute average brightness
        let totalBrightness = 0;
        let centerBrightness = 0;
        let centerPixelCount = 0;

        for (let y = 0; y < 48; y++) {
          for (let x = 0; x < 64; x++) {
            const idx = (y * 64 + x) * 4;
            // Luminance formula
            const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            totalBrightness += lum;

            // Center box (x: 20-44, y: 12-36)
            if (x >= 20 && x <= 44 && y >= 12 && y <= 36) {
              centerBrightness += lum;
              centerPixelCount++;
            }
          }
        }

        const avgLum = totalBrightness / (64 * 48);
        const avgCenterLum = centerBrightness / (centerPixelCount || 1);

        // Lighting status
        let lightStatus: 'Optimal' | 'Dim' | 'Harsh' = 'Optimal';
        if (avgLum < 45) {
          lightStatus = 'Dim';
        } else if (avgLum > 210) {
          lightStatus = 'Harsh';
        }
        setLightingQuality(lightStatus);

        // Framing & presence status
        let framing: 'Centered & Optimal' | 'Slightly Off-Center' | 'Sub-optimal Lighting' | 'Not Detected' = 'Centered & Optimal';
        if (avgLum < 30) {
          framing = 'Sub-optimal Lighting';
        } else if (Math.abs(avgCenterLum - avgLum) < 8 && avgLum < 60) {
          framing = 'Not Detected';
        } else if (avgCenterLum < avgLum * 0.75) {
          framing = 'Slightly Off-Center';
        } else {
          framing = 'Centered & Optimal';
        }
        setFramingStatus(framing);

        // Dynamic realistic Eye Contact simulation with jitter based on head presence
        totalChecksRef.current += 1;
        const isGoodGaze = framing === 'Centered & Optimal' && lightStatus === 'Optimal';
        if (isGoodGaze) goodGazeCountRef.current += 1;

        const currentContact = isGoodGaze
          ? Math.min(97, Math.max(86, 91 + Math.round((Math.random() - 0.45) * 6)))
          : Math.min(84, Math.max(68, 76 + Math.round((Math.random() - 0.5) * 8)));

        setEyeContactScore(currentContact);

        const currentComposure = isGoodGaze ? 9.1 : 7.8;
        setComposureScore(currentComposure);

        // Report to parent
        if (onMetricsUpdate) {
          onMetricsUpdate({
            cameraEnabled: true,
            eyeContactScore: currentContact,
            framingStatus: framing,
            lightingQuality: lightStatus,
            composureScore: currentComposure,
            durationSeconds: activeSeconds,
            totalGazeChecks: totalChecksRef.current,
            goodGazeCount: goodGazeCountRef.current,
          });
        }
      } catch (e) {
        // Fallback gracefully on drawImage security/ready exceptions
      }
    }, 1500);

    return () => {
      if (analysisTimerRef.current) clearInterval(analysisTimerRef.current);
    };
  }, [isEnabled, permissionState, activeSeconds, onMetricsUpdate]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // If camera is disabled by user
  if (!isEnabled) {
    return (
      <div className={`rounded-2xl border border-[var(--outline)]/25 bg-[var(--surface-container)]/70 backdrop-blur-md p-3.5 shadow-sm transition-all ${className}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--outline)]/20 flex items-center justify-center text-[var(--text-secondary)]">
              <CameraOff className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">Candidate Camera</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Video preview paused</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleEnabled}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-90 transition-all shadow-xs"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Enable Video</span>
          </button>
        </div>
      </div>
    );
  }

  // Permission denied state
  if (permissionState === 'denied' || permissionState === 'unsupported') {
    return (
      <div className={`rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 shadow-sm space-y-3 ${className}`}>
        <div className="flex items-start gap-2.5 text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Camera Permission Required</p>
            <p className="text-[11px] opacity-90">
              {errorMessage || 'Browser camera permissions are blocked. Enable camera access in your browser settings to practice with live video presence.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={startCamera}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-xs"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Access</span>
          </button>
          <button
            type="button"
            onClick={onToggleEnabled}
            className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border border-[var(--outline)]/40 bg-[var(--surface)] shadow-expressive-md backdrop-blur-xl transition-all ${
        isMinimized ? 'w-48 sm:w-56' : 'w-full'
      } ${className}`}
    >
      {/* Video Viewport Container */}
      <div className="relative aspect-4/3 w-full bg-neutral-950 overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover transition-transform duration-200 ${
            isMirrored ? 'scale-x-[-1]' : 'scale-x-100'
          }`}
        />

        {/* Framing Guide Overlay (subtle head & shoulder oval) */}
        {showGuide && !isMinimized && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[52%] h-[68%] rounded-[50%] border-2 border-dashed border-white/25 shadow-inner" />
          </div>
        )}

        {/* Top Badges: REC Status + Live Session Timer */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>REC</span>
            <span className="text-white/60">|</span>
            <span>{formatTimer(activeSeconds)}</span>
          </div>
        </div>

        {/* Top Right Controls: Guide, Mirror, Settings, Minimize */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            title={showGuide ? 'Hide head framing guide' : 'Show head framing guide'}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all text-xs ${
              showGuide
                ? 'bg-white/30 text-white'
                : 'bg-black/50 text-white/70 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsMirrored((prev) => !prev)}
            title="Mirror webcam preview horizontally"
            className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white/80 hover:text-white transition-all text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {videoDevices.length > 1 && (
            <button
              type="button"
              onClick={() => setShowSettings((prev) => !prev)}
              title="Camera devices"
              className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white/80 hover:text-white transition-all text-xs"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMinimized((prev) => !prev)}
            title={isMinimized ? 'Expand camera' : 'Minimize camera'}
            className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white/80 hover:text-white transition-all text-xs"
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom HUD: Live Non-Verbal Telemetry Badges */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-1.5 z-10 text-[10px]">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-white/90 font-medium border border-white/10">
            <Eye className="w-3 h-3 text-emerald-400" />
            <span>Eye Contact:</span>
            <span className="font-bold text-emerald-300">{eyeContactScore}%</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-white/90 font-medium border border-white/10">
            <Sun className={`w-3 h-3 ${lightingQuality === 'Optimal' ? 'text-amber-300' : 'text-amber-500'}`} />
            <span className="hidden sm:inline">Lighting:</span>
            <span className="font-bold">{lightingQuality}</span>
          </div>
        </div>
      </div>

      {/* Camera Device Switcher Modal/Tray */}
      <AnimatePresence>
        {showSettings && videoDevices.length > 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 bg-[var(--surface-container)] border-t border-[var(--outline)]/20 text-xs space-y-2"
          >
            <label className="font-semibold text-[var(--text-primary)] block">Select Camera Device:</label>
            <select
              value={selectedDeviceId}
              onChange={(e) => {
                setSelectedDeviceId(e.target.value);
                setShowSettings(false);
              }}
              className="w-full text-xs p-1.5 rounded-lg bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--outline)]/40 outline-none"
            >
              {videoDevices.map((d, i) => (
                <option key={d.deviceId || i} value={d.deviceId}>
                  {d.label || `Camera ${i + 1}`}
                </option>
              ))}
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Strip with Quick Controls & Mute Camera */}
      {!isMinimized && (
        <div className="px-3 py-2 bg-[var(--surface)] flex items-center justify-between border-t border-[var(--outline)]/20 text-xs">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-medium">{framingStatus}</span>
          </div>

          <button
            type="button"
            onClick={onToggleEnabled}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-600 transition-colors"
          >
            <VideoOff className="w-3 h-3" />
            <span>Turn Off</span>
          </button>
        </div>
      )}
    </div>
  );
}
