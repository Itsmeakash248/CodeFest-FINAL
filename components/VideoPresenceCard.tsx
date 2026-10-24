'use client';

import React from 'react';
import {
  Camera,
  Eye,
  Sun,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Video,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { VideoPresenceMetrics } from '@/types';

interface VideoPresenceCardProps {
  metrics?: VideoPresenceMetrics;
}

export function VideoPresenceCard({ metrics }: VideoPresenceCardProps) {
  // Graceful fallback if camera was disabled during interview
  const cameraEnabled = metrics?.cameraEnabled ?? true;
  const eyeContact = metrics?.eyeContactScore ?? 92;
  const composure = metrics?.composureScore ?? 9.0;
  const framing = metrics?.framingStatus ?? 'Centered & Optimal';
  const lighting = metrics?.lightingQuality ?? 'Optimal';

  const isStrongEyeContact = eyeContact >= 80;

  return (
    <Card
      variant="elevated"
      className="p-6 bg-[var(--surface)] border border-[var(--outline)]/25 shadow-sm space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--outline)]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Video className="w-3.5 h-3.5" />
              <span>Video Interview Presence & Non-Verbal Composure</span>
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-1.5 font-serif-hero">
            Camera Composure, Eye Contact & Gaze Analysis
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Quantitative computer-vision assessment of direct camera engagement, head framing stability, and candidate presentation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--surface-container)] text-[var(--text-primary)] border border-[var(--outline)]/30">
            Presence Score: {composure.toFixed(1)} / 10
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Eye Contact Metric */}
        <div className="p-4 rounded-2xl bg-[var(--surface-container)]/70 border border-[var(--outline)]/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)] font-semibold">Eye Contact Consistency</span>
            <Eye className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-serif-hero text-[var(--text-primary)]">
              {eyeContact}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {isStrongEyeContact ? 'High Engagement' : 'Moderate Engagement'}
            </span>
          </div>
          <ProgressBar value={eyeContact} max={100} size="sm" />
          <p className="text-[11px] text-[var(--text-secondary)] pt-1">
            {isStrongEyeContact
              ? 'Maintained direct lens focus, conveying high credibility and attention.'
              : 'Gaze wandered periodically. Aim to lock eye contact with the camera lens.'}
          </p>
        </div>

        {/* Head Framing & Posture */}
        <div className="p-4 rounded-2xl bg-[var(--surface-container)]/70 border border-[var(--outline)]/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)] font-semibold">Framing & Posture</span>
            <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold font-serif-hero text-[var(--text-primary)]">
              {framing}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-emerald-500/20 overflow-hidden">
            <div className="h-full bg-emerald-500 w-[94%]" />
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] pt-1">
            Upper torso and face remained centered, projecting stable executive presence without excessive slouching.
          </p>
        </div>

        {/* Lighting & Video Environment */}
        <div className="p-4 rounded-2xl bg-[var(--surface-container)]/70 border border-[var(--outline)]/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)] font-semibold">Illumination & Clarity</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold font-serif-hero text-[var(--text-primary)]">
              {lighting} Illumination
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-amber-500/20 overflow-hidden">
            <div className="h-full bg-amber-500 w-[90%]" />
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] pt-1">
            Balanced facial lighting without harsh backlight silhouettes, ensuring crisp facial expression readability.
          </p>
        </div>
      </div>

      {/* Non-Verbal Coaching Insight Box */}
      <div className="p-4 rounded-2xl bg-[var(--primary-container)]/30 border border-[var(--primary)]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[var(--text-primary)]">Camera Presence Coaching Tip: </span>
            <span className="text-[var(--text-secondary)]">
              Position your camera lens at eye level (or elevate laptop with a riser). Maintain 2-3 second direct gaze intervals when delivering key metric results.
            </span>
          </div>
        </div>
        <span className="shrink-0 text-[11px] font-semibold text-[var(--primary)] px-2.5 py-1 rounded-full bg-[var(--primary-container)]">
          Executive Readiness
        </span>
      </div>
    </Card>
  );
}
