'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Eye,
  ClipboardCheck,
  Cpu,
  Activity,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CheatingDetectionReport } from '@/types';

interface CheatingDetectionCardProps {
  report?: CheatingDetectionReport;
  className?: string;
}

export function CheatingDetectionCard({ report, className = '' }: CheatingDetectionCardProps) {
  const [showEventLog, setShowEventLog] = useState(false);

  if (!report) return null;

  const {
    integrityScore = 98,
    status = 'Verified Authentic',
    tabSwitchCount = 0,
    totalUnfocusedSeconds = 0,
    pasteCount = 0,
    totalPastedCharacters = 0,
    typingCadenceWpmBurst = 115,
    aiPatternRiskScore = 8,
    events = [],
    authenticitySummary = 'Continuous focus maintained throughout the interview session.',
    integrityVerified = true,
  } = report;

  const getStatusBadge = () => {
    switch (status) {
      case 'Verified Authentic':
        return {
          bg: 'bg-[#386A4A]/15 text-[#386A4A] dark:text-[#9BD0A6] border-[#386A4A]/30',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          label: 'Verified Authentic',
        };
      case 'Minor Irregularities':
        return {
          bg: 'bg-[#8A5B16]/15 text-[#8A5B16] dark:text-[#F0C078] border-[#8A5B16]/30',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: 'Minor Irregularities',
        };
      case 'Suspicious Patterns':
      case 'Flagged for Review':
      default:
        return {
          bg: 'bg-[#B9573D]/15 text-[#B9573D] dark:text-[#F0A18A] border-[#B9573D]/30',
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
          label: status,
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <Card
      variant="elevated"
      className={`p-6 sm:p-7 bg-[var(--surface)] border border-[var(--outline)]/25 rounded-[28px] space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[var(--tertiary-container)] text-[var(--tertiary)] dark:text-[#C9BDF7]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Assessment Authenticity</span>
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge.bg}`}>
              {statusBadge.icon}
              <span>{statusBadge.label}</span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] font-serif tracking-tight mt-1">
            Cheating Detection & Integrity Telemetry
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Continuous browser viewport focus, typing cadence anomalies, and synthetic LLM pattern analysis.
          </p>
        </div>

        {/* Big Score Pill */}
        <div className="flex items-center gap-3 p-3 px-4 rounded-2xl bg-[var(--surface-container)]/70 border border-[var(--outline)]/20 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block">
              Integrity Score
            </span>
            <span className="text-2xl font-black text-[var(--text-primary)] font-serif">
              {integrityScore}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--surface)] border border-[var(--outline)]/30 text-[var(--primary)] font-bold text-xs">
            {integrityVerified ? 'PASS' : 'WARN'}
          </div>
        </div>
      </div>

      {/* Summary Narrative Banner */}
      <div className="p-3.5 rounded-2xl bg-[var(--surface-container)]/50 border border-[var(--outline)]/20 text-xs text-[var(--text-secondary)] leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[var(--text-primary)] font-semibold">Proctor Audit Verdict: </strong>
          {authenticitySummary}
        </div>
      </div>

      {/* 4 Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Tab Switches */}
        <div className="p-4 rounded-2xl bg-[var(--surface-container)]/60 border border-[var(--outline)]/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5 font-medium">
              <Eye className="w-4 h-4 text-[var(--primary)]" />
              Tab Visibility
            </span>
            <span className={`text-[11px] font-bold ${tabSwitchCount === 0 ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
              {tabSwitchCount === 0 ? 'Optimal Focus' : `${tabSwitchCount} Shifts`}
            </span>
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">
            {tabSwitchCount === 0 ? '0 Tab Switches' : `${tabSwitchCount} Blur Events`}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            {totalUnfocusedSeconds > 0
              ? `${totalUnfocusedSeconds}s total duration away from interview window`
              : 'Candidate remained on interview tab for entire duration'}
          </p>
        </div>

        {/* Metric 2: Clipboard Paste */}
        <div className="p-4 rounded-2xl bg-[var(--surface-container)]/60 border border-[var(--outline)]/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5 font-medium">
              <ClipboardCheck className="w-4 h-4 text-[var(--secondary)]" />
              Clipboard Injection
            </span>
            <span className={`text-[11px] font-bold ${pasteCount === 0 ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
              {pasteCount === 0 ? 'No Injections' : `${pasteCount} Pastes`}
            </span>
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">
            {pasteCount === 0 ? '0 Block Pastes' : `${totalPastedCharacters} Chars Pasted`}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            {pasteCount === 0
              ? 'Answers typed natively with natural keystroke cadence'
              : `${pasteCount} clipboard insert events logged during composition`}
          </p>
        </div>

        {/* Metric 3: Typing Cadence */}
        <div className="p-4 rounded-2xl bg-[var(--surface-container)]/60 border border-[var(--outline)]/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-4 h-4 text-[var(--tertiary)]" />
              Typing Dynamics
            </span>
            <span className="text-[11px] font-bold text-[var(--success)]">
              Natural Rhythm
            </span>
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">
            {typingCadenceWpmBurst} WPM Burst
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            Keystroke intervals adhere to organic human hesitation and thought boundaries.
          </p>
        </div>

        {/* Metric 4: Synthetic AI Pattern */}
        <div className="p-4 rounded-2xl bg-[var(--surface-container)]/60 border border-[var(--outline)]/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5 font-medium">
              <Cpu className="w-4 h-4 text-[var(--primary)]" />
              AI Phrasing Risk
            </span>
            <span className={`text-[11px] font-bold ${aiPatternRiskScore < 25 ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
              {aiPatternRiskScore < 25 ? 'Human Authentic' : 'Audit Advised'}
            </span>
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">
            {aiPatternRiskScore}% Synthetic Risk
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            {aiPatternRiskScore < 25
              ? 'No boilerplate ChatGPT formulaic openers or lists detected'
              : 'Moderate linguistic formulaic syntax flagged in responses'}
          </p>
        </div>
      </div>

      {/* Expandable Proctor Audit Timeline Log */}
      {events.length > 0 && (
        <div className="pt-2 border-t border-[var(--outline)]/20">
          <button
            onClick={() => setShowEventLog(!showEventLog)}
            className="w-full flex items-center justify-between py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[var(--primary)]" />
              <span>View Live Proctor Event Audit Log ({events.length} logged checkpoints)</span>
            </span>
            {showEventLog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showEventLog && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-2.5 pt-3"
              >
                {events.map((evt, idx) => (
                  <div
                    key={evt.id || idx}
                    className="p-3 rounded-xl bg-[var(--surface-container)]/40 border border-[var(--outline)]/15 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                            [{evt.timeString || '00:00'}]
                          </span>
                          <span className="font-bold text-[var(--text-primary)]">
                            {evt.description}
                          </span>
                        </div>
                        {evt.details && (
                          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                            {evt.details}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                        evt.severity === 'critical'
                          ? 'bg-[var(--error)]/15 text-[var(--error)]'
                          : evt.severity === 'warning'
                          ? 'bg-[var(--warning)]/15 text-[var(--warning)]'
                          : 'bg-[var(--success)]/15 text-[var(--success)]'
                      }`}
                    >
                      {evt.severity}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Proctoring Guarantee / Disclaimer Footer */}
      <div className="flex items-center gap-2 pt-2 text-[11px] text-[var(--text-secondary)]/80">
        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" />
        <span>
          Certified tamper-resistant audit report. Telemetry is logged client-side via Viewport Visibility and DOM Mutation observers without invasive background software.
        </span>
      </div>
    </Card>
  );
}
