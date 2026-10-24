'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Award,
  ArrowLeft,
  Printer,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Calendar,
  Briefcase,
  Layers,
  Activity,
  Share2,
} from 'lucide-react';
import { useInterview } from '@/lib/interview-context';
import { EvaluationReport } from '@/types';
import { FALLBACK_EVALUATION_REPORT } from '@/lib/fallback-data';
import { ScoreCard } from '@/components/ScoreCard';
import { EvidencePanel } from '@/components/EvidencePanel';
import { CoachingTips } from '@/components/CoachingTips';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ReportPage() {
  const router = useRouter();
  const { report, config, resetSession } = useInterview();
  const [activeReport, setActiveReport] = useState<EvaluationReport>(FALLBACK_EVALUATION_REPORT);
  const [copied, setCopied] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState('October 2026');

  useEffect(() => {
    setCurrentDateStr(new Date().toLocaleDateString(undefined, { dateStyle: 'medium' }));
    if (report) {
      setActiveReport(report);
    }
  }, [report]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleRetake = () => {
    resetSession();
    router.push('/setup');
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const { overallScore, verdict = 'Hire', executiveSummary, dimensions, improvedAnswerBlueprint, nextSteps, keyTakeaways, paceMetrics } = activeReport;

  const getVerdictStyle = (v: string) => {
    switch (v) {
      case 'Strong Hire':
        return 'bg-[#386A4A] text-white border-[#386A4A] shadow-md shadow-[#386A4A]/20';
      case 'Hire':
        return 'bg-[#386A4A]/15 text-[#386A4A] dark:text-[#9BD0A6] border-[#386A4A]/30';
      case 'Lean Hire':
        return 'bg-[#8A5B16]/15 text-[#8A5B16] dark:text-[#F0C078] border-[#8A5B16]/30';
      default:
        return 'bg-[#B9573D]/15 text-[#B9573D] dark:text-[#F0A18A] border-[#B9573D]/30';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white print:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Navigation & Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button
            onClick={() => router.push('/interview')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Interview Transcript</span>
          </button>

          <div className="flex items-center gap-2.5">
            <Button
              variant="tonal"
              size="sm"
              onClick={handleShare}
              className="rounded-full text-xs"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              <span>{copied ? 'Link Copied!' : 'Share Scorecard'}</span>
            </Button>

            <Button
              variant="tonal"
              size="sm"
              onClick={handlePrint}
              className="rounded-full text-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              <span>Export PDF / Print</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleRetake}
              className="rounded-full text-xs bg-[var(--primary)] text-white hover:opacity-90"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>New Practice Session</span>
            </Button>
          </div>
        </div>

        {/* Executive Summary Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card
            variant="elevated"
            className="relative overflow-hidden p-6 sm:p-8 bg-[var(--surface)] border border-[var(--outline)]/25 shadow-sm"
          >
            {/* Background subtle radial glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary-container)]/25 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Left Column: Role & Candidate Meta */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-container)] text-[var(--primary)]">
                    <Award className="w-3.5 h-3.5" />
                    <span>ViewPilot Evaluation Report</span>
                  </span>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getVerdictStyle(verdict)}`}>
                    Verdict: {verdict}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] font-serif">
                  {config?.role || 'Frontend Developer'} Assessment
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[var(--primary)]" />
                    {config?.experienceLevel || 'Junior Level'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[var(--secondary)]" />
                    {config?.interviewType || 'Behavioral (STAR)'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--tertiary)]" />
                    {currentDateStr}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-2 border-t border-[var(--outline)]/15">
                  {executiveSummary}
                </p>
              </div>

              {/* Right Column: Prominent Overall Score Badge */}
              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[var(--surface-container)]/70 border border-[var(--outline)]/20 text-center">
                <span className="text-xs uppercase font-bold tracking-wider text-[var(--text-secondary)] mb-1">
                  Composite Score
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tight text-[var(--primary)] font-serif">
                    {overallScore.toFixed(1)}
                  </span>
                  <span className="text-base font-semibold text-[var(--text-secondary)]">
                    / 10
                  </span>
                </div>
                <span className="text-[11px] text-[var(--text-secondary)] mt-1.5">
                  Weighted 4-Dimension Rubric
                </span>

                {paceMetrics && (
                  <div className="mt-4 pt-3 border-t border-[var(--outline)]/20 w-full flex items-center justify-around text-[11px] text-[var(--text-secondary)]">
                    <div>
                      <strong className="block text-[var(--text-primary)] font-semibold">{paceMetrics.wordsPerMinute}</strong>
                      <span>WPM</span>
                    </div>
                    <div className="h-4 w-px bg-[var(--outline)]/30" />
                    <div>
                      <strong className="block text-[var(--text-primary)] font-semibold">{paceMetrics.totalWords}</strong>
                      <span>Words</span>
                    </div>
                    <div className="h-4 w-px bg-[var(--outline)]/30" />
                    <div>
                      <strong className="block text-[var(--text-primary)] font-semibold">{paceMetrics.paceAssessment}</strong>
                      <span>Cadence</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 4-Dimension Score Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Core Competency Dimensions
            </h2>
            <span className="text-xs text-[var(--text-secondary)]">
              Equal weight (25% each)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {dimensions && (
              <>
                <ScoreCard
                  title="Communication & Articulation"
                  dimensionKey="communication"
                  evaluation={dimensions.communication}
                  delay={0.05}
                />
                <ScoreCard
                  title="Technical & Role Knowledge"
                  dimensionKey="roleKnowledge"
                  evaluation={dimensions.roleKnowledge}
                  delay={0.1}
                />
                <ScoreCard
                  title="Problem Solving & Trade-offs"
                  dimensionKey="problemSolving"
                  evaluation={dimensions.problemSolving}
                  delay={0.15}
                />
                <ScoreCard
                  title="Answer Quality & Evidence"
                  dimensionKey="answerQuality"
                  evaluation={dimensions.answerQuality}
                  delay={0.2}
                />
              </>
            )}
          </div>
        </section>

        {/* Evidence Audit Section */}
        {dimensions && (
          <section className="space-y-4">
            <EvidencePanel dimensions={dimensions} />
          </section>
        )}

        {/* Model Answer Blueprint & Action Plan */}
        <section className="space-y-4">
          <CoachingTips
            blueprint={improvedAnswerBlueprint}
            nextSteps={nextSteps}
            keyTakeaways={keyTakeaways}
          />
        </section>

        {/* Bottom CTA Banner */}
        <div className="p-8 rounded-[28px] bg-gradient-to-r from-[var(--surface-container)] to-[var(--surface-container-high)] border border-[var(--outline)]/20 text-center space-y-3 print:hidden">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            Ready to sharpen your answers further?
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
            Practice makes placement. Re-take the interview with increased difficulty or upload your resume for customized deep-dives.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleRetake}
              className="rounded-full bg-[var(--primary)] text-white hover:opacity-90 px-6"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span>Launch Another Simulation</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
