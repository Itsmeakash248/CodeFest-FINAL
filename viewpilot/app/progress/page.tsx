'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  ChevronRight,
  Layers,
  BarChart3,
  Trash2,
  Zap,
} from 'lucide-react';
import { useInterview } from '@/lib/interview-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SessionHistoryItem } from '@/types';

export default function ProgressPage() {
  const router = useRouter();
  const { history, setReport, clearHistory, config } = useInterview();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Compute aggregate statistics
  const totalSessions = history.length;
  const latestSession = history[0];
  const oldestSession = history[history.length - 1];

  const readinessScore = latestSession ? Math.round(latestSession.overallScore * 10) : 75;
  const scoreDelta =
    totalSessions > 1 && latestSession && oldestSession
      ? Number((latestSession.overallScore - oldestSession.overallScore).toFixed(1))
      : 0;

  // Average WPM
  const averageWpm =
    latestSession?.metrics?.wordsPerMinute ||
    Math.round(
      history.reduce((acc, s) => acc + (s.metrics?.wordsPerMinute || 120), 0) /
        Math.max(totalSessions, 1)
    );

  const getVerdictStyle = (v: string) => {
    switch (v) {
      case 'Strong Hire':
        return 'bg-[#386A4A] text-white border-[#386A4A]';
      case 'Hire':
        return 'bg-[#386A4A]/15 text-[#386A4A] dark:text-[#9BD0A6] border-[#386A4A]/30';
      case 'Lean Hire':
        return 'bg-[#8A5B16]/15 text-[#8A5B16] dark:text-[#F0C078] border-[#8A5B16]/30';
      default:
        return 'bg-[#B9573D]/15 text-[#B9573D] dark:text-[#F0A18A] border-[#B9573D]/30';
    }
  };

  const handleReviewSession = (session: SessionHistoryItem) => {
    if (session.report) {
      setReport(session.report);
      router.push('/report');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Top Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-container)] text-[var(--on-primary-container)]">
                <TrendingUp className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Job Readiness & Learning Tracker</span>
              </span>
            </div>
            <h1 className="font-serif-hero text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-2">
              Your Placement Readiness Index
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
              Track multi-session competency growth across STAR communication, system depth, and reasoning under pressure.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/setup">
              <Button
                variant="primary"
                size="sm"
                className="rounded-full bg-[var(--primary)] text-white hover:opacity-90 shadow-expressive-sm"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                <span>Start Practice Session</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero KPI Stat Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            variant="elevated"
            className="p-5 bg-[var(--surface)] border border-[var(--outline)]/30 space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-[var(--text-secondary)]">
                Readiness Index
              </span>
              <Award className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-serif-hero text-[var(--primary)]">
                {readinessScore}%
              </span>
              <span className="text-xs font-bold text-[var(--success)]">
                {scoreDelta >= 0 ? `+${scoreDelta} pts` : `${scoreDelta} pts`}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {readinessScore >= 80 ? 'Market Competitive for Hiring' : 'Developing toward Benchmark'}
            </p>
            <div className="pt-1">
              <ProgressBar value={readinessScore} max={100} size="sm" variant="primary" />
            </div>
          </Card>

          <Card
            variant="elevated"
            className="p-5 bg-[var(--surface)] border border-[var(--outline)]/30 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-[var(--text-secondary)]">
                Simulations Completed
              </span>
              <Layers className="w-4 h-4 text-[var(--secondary)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-serif-hero text-[var(--text-primary)]">
                {totalSessions}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">sessions</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Multi-turn adaptive transcripts logged
            </p>
          </Card>

          <Card
            variant="elevated"
            className="p-5 bg-[var(--surface)] border border-[var(--outline)]/30 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-[var(--text-secondary)]">
                Speaking Cadence
              </span>
              <Zap className="w-4 h-4 text-[var(--warning)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-serif-hero text-[var(--text-primary)]">
                {averageWpm}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">WPM average</span>
            </div>
            <p className="text-[11px] text-[var(--success)] font-medium">
              Ideal interview range (110–150 WPM)
            </p>
          </Card>

          <Card
            variant="elevated"
            className="p-5 bg-[var(--surface)] border border-[var(--outline)]/30 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-[var(--text-secondary)]">
                Target Role
              </span>
              <Briefcase className="w-4 h-4 text-[var(--tertiary)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-serif-hero text-[var(--text-primary)] truncate">
                {latestSession?.role || config.role}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {latestSession?.difficulty || config.difficulty} • {latestSession?.interviewType || config.interviewType}
            </p>
          </Card>
        </div>

        {/* Competency Evolution Over Time */}
        {latestSession && (
          <Card
            variant="elevated"
            className="p-6 sm:p-8 bg-[var(--surface)] border border-[var(--outline)]/30 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--outline)]/20 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
                  <span>Competency Growth Breakdown</span>
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Visual audit of candidate mastery across the 4 core evaluation dimensions.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--secondary-container)] text-[var(--secondary)]">
                Latest Benchmark: {latestSession.overallScore.toFixed(1)} / 10
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Communication */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">
                      Communication & Articulation (STAR)
                    </span>
                    <span className="font-bold text-[var(--primary)] font-mono">
                      {latestSession.dimensions.communication.toFixed(1)} / 10
                    </span>
                  </div>
                  <ProgressBar
                    value={latestSession.dimensions.communication}
                    max={10}
                    variant="primary"
                    size="md"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Structure, concise storytelling, absence of filler words, and audience awareness.
                  </p>
                </div>

                {/* Role Knowledge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">
                      Technical & Role Knowledge
                    </span>
                    <span className="font-bold text-[var(--secondary)] font-mono">
                      {latestSession.dimensions.roleKnowledge.toFixed(1)} / 10
                    </span>
                  </div>
                  <ProgressBar
                    value={latestSession.dimensions.roleKnowledge}
                    max={10}
                    variant="secondary"
                    size="md"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Accurate domain concepts, framework internals, and architectural trade-offs.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Problem Solving */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">
                      Problem Solving & Logic
                    </span>
                    <span className="font-bold text-[var(--tertiary)] font-mono">
                      {latestSession.dimensions.problemSolving.toFixed(1)} / 10
                    </span>
                  </div>
                  <ProgressBar
                    value={latestSession.dimensions.problemSolving}
                    max={10}
                    variant="tertiary"
                    size="md"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Hypothesis-driven debugging, decomposition, and edge-case handling.
                  </p>
                </div>

                {/* Answer Quality & Evidence */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">
                      Answer Quality & Concrete Metrics
                    </span>
                    <span className="font-bold text-[var(--success)] font-mono">
                      {latestSession.dimensions.answerQuality.toFixed(1)} / 10
                    </span>
                  </div>
                  <ProgressBar
                    value={latestSession.dimensions.answerQuality}
                    max={10}
                    variant="primary"
                    size="md"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Measurable impact, quantifiable metrics, and verified practical deliverables.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Session History Dossiers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Historical Simulation Log
            </h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset History</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {history.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card
                  variant="elevated"
                  className="p-5 bg-[var(--surface)] border border-[var(--outline)]/25 hover:border-[var(--primary)]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[var(--text-primary)] font-serif-hero">
                        {session.role}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-container)] text-[var(--text-secondary)] font-medium">
                        {session.difficulty}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-container)] text-[var(--text-secondary)] font-medium">
                        {session.interviewType}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getVerdictStyle(session.verdict)}`}>
                        {session.verdict}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {session.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-secondary)] pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {session.completedAt}
                      </span>
                      {session.metrics?.wordsPerMinute && (
                        <span>• {session.metrics.wordsPerMinute} WPM</span>
                      )}
                      {session.metrics?.fillerWordCount !== undefined && (
                        <span>• {session.metrics.fillerWordCount} filler words</span>
                      )}
                    </div>
                  </div>

                  {/* Score & Action Button */}
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xs text-[var(--text-secondary)] block">Score</span>
                      <span className="text-2xl font-black font-serif-hero text-[var(--primary)]">
                        {session.overallScore.toFixed(1)}
                      </span>
                    </div>

                    {session.report ? (
                      <Button
                        variant="tonal"
                        size="sm"
                        onClick={() => handleReviewSession(session)}
                        className="rounded-full text-xs"
                      >
                        <span>View Scorecard</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    ) : (
                      <Link href="/report">
                        <Button
                          variant="tonal"
                          size="sm"
                          className="rounded-full text-xs"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-r from-[var(--surface-container)] to-[var(--surface-container-high)] border border-[var(--outline)]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Continue your preparation journey
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-xl">
              Consistent deliberate practice with instant AI feedback increases interview confidence and offer rates by up to 3×.
            </p>
          </div>
          <Link href="/setup">
            <Button
              variant="primary"
              size="md"
              className="rounded-full bg-[var(--primary)] text-white hover:opacity-90 px-6 shrink-0"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span>New Practice Session</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
