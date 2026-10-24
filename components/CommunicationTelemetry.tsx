'use client';

import React from 'react';
import {
  Mic,
  Activity,
  Volume2,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PaceMetrics } from '@/types';

interface CommunicationTelemetryProps {
  metrics?: PaceMetrics;
}

export function CommunicationTelemetry({ metrics }: CommunicationTelemetryProps) {
  if (!metrics) return null;

  const {
    wordsPerMinute = 125,
    totalWords = 420,
    averageWordsPerAnswer = 84,
    durationMinutes = 3.5,
    paceAssessment = 'Ideal Pace',
    fillerWordCount = 3,
  } = metrics;

  const isIdealPace = paceAssessment === 'Ideal Pace';
  const paceScore = isIdealPace ? 9.2 : paceAssessment === 'Too Fast' ? 7.0 : 7.2;

  // Filler density (% of total words)
  const fillerRatio = totalWords > 0 ? ((fillerWordCount / totalWords) * 100).toFixed(1) : '0';

  return (
    <Card
      variant="elevated"
      className="p-6 bg-[var(--surface)] border border-[var(--outline)]/25 shadow-sm space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--outline)]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--tertiary-container)] text-[var(--tertiary)]">
              <Mic className="w-3.5 h-3.5" />
              <span>Communication & Articulation Telemetry</span>
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-1.5 font-serif-hero">
            Speech Delivery, Pacing & Fluency Assessment
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Quantitative analysis of your speaking speed, vocal pauses, and answer conciseness.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--surface-container)] text-[var(--text-primary)] border border-[var(--outline)]/30 self-start sm:self-auto">
          Delivery Score: {paceScore.toFixed(1)} / 10
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cadence / WPM */}
        <div className="p-4 rounded-2xl bg-[var(--surface-container)]/70 border border-[var(--outline)]/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)] font-semibold">Speaking Rate</span>
            <Activity className="w-3.5 h-3.5 text-[var(--primary)]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-serif-hero text-[var(--text-primary)]">
              {wordsPerMinute}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">WPM</span>
          </div>
          <div className="pt-1">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              isIdealPace
                ? 'bg-[#386A4A]/15 text-[#386A4A] dark:text-[#9BD0A6]'
                : 'bg-[#8A5B16]/15 text-[#8A5B16] dark:text-[#F0C078]'
            }`}>
              {isIdealPace ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {paceAssessment} (Target: 110–160)
            </span>
          </div>
        </div>

        {/* Filler Word Detection */}
        <div className="p-4 rounded-2xl bg-[var(--surface-container)]/70 border border-[var(--outline)]/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)] font-semibold">Filler Words</span>
            <MessageSquare className="w-3.5 h-3.5 text-[var(--warning)]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-serif-hero text-[var(--text-primary)]">
              {fillerWordCount}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">({fillerRatio}% density)</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            {fillerWordCount <= 4 ? 'Low filler frequency (clean delivery)' : 'Elevated fillers — practice silent pauses'}
          </p>
        </div>

        {/* Answer Conciseness */}
        <div className="p-4 rounded-2xl bg-[var(--surface-container)]/70 border border-[var(--outline)]/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)] font-semibold">Answer Length</span>
            <Clock className="w-3.5 h-3.5 text-[var(--secondary)]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-serif-hero text-[var(--text-primary)]">
              {averageWordsPerAnswer}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">words / answer</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            {averageWordsPerAnswer >= 60 && averageWordsPerAnswer <= 150
              ? 'Balanced depth (neither terse nor rambling)'
              : 'Aim for 75–130 words per answer'}
          </p>
        </div>

        {/* Total Time */}
        <div className="p-4 rounded-2xl bg-[var(--surface-container)]/70 border border-[var(--outline)]/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)] font-semibold">Session Duration</span>
            <Volume2 className="w-3.5 h-3.5 text-[var(--tertiary)]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-serif-hero text-[var(--text-primary)]">
              {durationMinutes}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">min total</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            {totalWords} total verbal words articulated
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[var(--surface-container-high)]/60 border border-[var(--outline)]/20 text-xs text-[var(--text-secondary)] space-y-1.5">
        <span className="font-bold text-[var(--text-primary)] block">
          💡 Articulation Coaching Advice:
        </span>
        <p className="leading-relaxed">
          When answering behavioral or architectural questions, practice the <strong>2-Second Silent Pause</strong> before speaking rather than filling silence with vocal crutches (&quot;like&quot;, &quot;basically&quot;). Keep responses between 60 to 90 seconds to hold the interviewer&apos;s attention while delivering comprehensive STAR evidence.
        </p>
      </div>
    </Card>
  );
}
