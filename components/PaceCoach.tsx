'use client';

import React, { useMemo } from 'react';
import { Gauge, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface PaceCoachProps {
  currentText: string;
  elapsedSeconds: number;
}

export function PaceCoach({ currentText, elapsedSeconds }: PaceCoachProps) {
  const stats = useMemo(() => {
    const trimmed = currentText.trim();
    if (!trimmed) {
      return {
        wordCount: 0,
        wpm: 0,
        status: 'Ready',
        badgeColor: 'bg-[var(--surface-container)] text-[var(--text-secondary)]',
        tip: 'Begin speaking or typing your answer.',
        fillerCount: 0,
      };
    }

    const words = trimmed.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Detect common speech filler words
    const fillerWords = ['basically', 'literally', 'actually', 'honestly', 'like', 'um', 'uh', 'you know'];
    const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ''));
    let fillerCount = 0;
    lowerWords.forEach((w) => {
      if (fillerWords.includes(w)) fillerCount++;
    });

    const safeMinutes = Math.max(elapsedSeconds / 60, 0.25);
    const wpm = Math.round(wordCount / safeMinutes);

    if (wpm < 85 && wordCount > 20) {
      return {
        wordCount,
        wpm,
        status: 'Deliberate / Slow',
        badgeColor: 'bg-[#8A5B16]/15 text-[#8A5B16] border-[#8A5B16]/30',
        tip: 'Maintain momentum and expand with concrete examples.',
        fillerCount,
      };
    }

    if (wpm > 185 && wordCount > 30) {
      return {
        wordCount,
        wpm,
        status: 'Fast Tempo',
        badgeColor: 'bg-[#B9573D]/15 text-[#B9573D] border-[#B9573D]/30',
        tip: 'Pause between points so the interviewer absorbs key metrics.',
        fillerCount,
      };
    }

    return {
      wordCount,
      wpm,
      status: 'Ideal Pacing',
      badgeColor: 'bg-[#386A4A]/15 text-[#386A4A] dark:text-[#9BD0A6] border-[#386A4A]/30',
      tip: 'Strong conversational clarity and cadence.',
      fillerCount,
    };
  }, [currentText, elapsedSeconds]);

  if (!currentText.trim() && elapsedSeconds < 5) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[var(--surface-container)]/70 border border-[var(--outline)]/15 text-xs text-[var(--text-secondary)]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-medium">
          <Activity className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>{stats.wordCount} words</span>
        </div>

        <div className="h-3 w-px bg-[var(--outline)]/30" />

        <div className="flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-[var(--secondary)]" />
          <span>{stats.wpm > 0 ? `${stats.wpm} WPM` : '-- WPM'}</span>
        </div>

        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${stats.badgeColor}`}>
          {stats.status}
        </span>
      </div>

      <div className="flex items-center gap-2 text-[11px]">
        {stats.fillerCount > 2 && (
          <span className="flex items-center gap-1 text-[#8A5B16] font-medium">
            <AlertTriangle className="w-3 h-3" />
            {stats.fillerCount} filler words detected
          </span>
        )}
        <span className="hidden sm:inline text-[var(--text-secondary)]">
          {stats.tip}
        </span>
      </div>
    </div>
  );
}
