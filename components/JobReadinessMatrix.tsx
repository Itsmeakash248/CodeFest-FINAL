'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Award,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  Briefcase,
  Layers,
  ChevronRight,
  ArrowUpRight,
  BookOpen,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { JobReadinessPattern, StrictnessLevel } from '@/types';

interface JobReadinessMatrixProps {
  readiness?: JobReadinessPattern;
  strictness?: StrictnessLevel;
  className?: string;
}

export function JobReadinessMatrix({
  readiness,
  strictness = 'Standard',
  className = '',
}: JobReadinessMatrixProps) {
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'companies' | 'roadmap'>('benchmarks');

  if (!readiness) return null;

  const {
    readinessIndex = 84,
    readinessTier = 'Immediate Placement Ready',
    industryBenchmarkScore = 6.8,
    percentileRanking = 88,
    passingProbability = 86,
    targetRoleBenchmark = 'Engineering Industry Standard',
    hiringVerdict = 'Hire',
    companyFitTiers = [],
    competencyPillars = [],
    strengthsHighlights = [],
    criticalGaps = [],
    fourteenDayRoadmap = [],
  } = readiness;

  const getTierBadgeStyle = () => {
    switch (readinessTier) {
      case 'Immediate Placement Ready':
        return 'bg-[#386A4A]/15 text-[#386A4A] dark:text-[#9BD0A6] border-[#386A4A]/30';
      case 'Near Placement Ready':
        return 'bg-[#8A5B16]/15 text-[#8A5B16] dark:text-[#F0C078] border-[#8A5B16]/30';
      default:
        return 'bg-[#B9573D]/15 text-[#B9573D] dark:text-[#F0A18A] border-[#B9573D]/30';
    }
  };

  const getStrictnessBadge = () => {
    switch (strictness) {
      case 'Bar-Raiser':
        return { label: 'FAANG Bar-Raiser Calibrated ⚡', color: 'bg-[var(--primary)] text-white' };
      case 'Strict':
        return { label: 'Strict Senior Bar 🔴', color: 'bg-[var(--warning)]/20 text-[var(--warning)]' };
      case 'Lenient':
        return { label: 'Practice & Coaching Curve 🟢', color: 'bg-[var(--success)]/20 text-[var(--success)]' };
      default:
        return { label: 'Corporate Standard ⚖️', color: 'bg-[var(--secondary-container)] text-[var(--secondary)]' };
    }
  };

  const strictnessBadge = getStrictnessBadge();

  return (
    <Card
      variant="elevated"
      className={`p-6 sm:p-8 bg-[var(--surface)] border border-[var(--outline)]/25 rounded-[28px] space-y-6 ${className}`}
    >
      {/* Header and Hero Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[var(--outline)]/20">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary-container)] text-[var(--primary)]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Job Readiness Patterns</span>
            </span>

            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTierBadgeStyle()}`}>
              {readinessTier}
            </span>

            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${strictnessBadge.color}`}>
              {strictnessBadge.label}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-serif tracking-tight">
            Industry Placement Readiness Index
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Direct benchmark comparison for <strong className="text-[var(--text-primary)] font-semibold">{targetRoleBenchmark}</strong>. Calibrated using real corporate evaluation standards.
          </p>
        </div>

        {/* Big Highlights Pill */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-[var(--surface-container)]/70 border border-[var(--outline)]/20 shrink-0 text-center">
          <div className="px-3 py-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block">
              Readiness
            </span>
            <span className="text-2xl font-black text-[var(--primary)] font-serif">
              {readinessIndex}
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] block">/ 100</span>
          </div>
          <div className="px-3 py-1 border-x border-[var(--outline)]/25">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block">
              Percentile
            </span>
            <span className="text-2xl font-black text-[var(--text-primary)] font-serif">
              Top {Math.max(1, 100 - percentileRanking)}%
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] block">{percentileRanking}th pct</span>
          </div>
          <div className="px-3 py-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)] block">
              Pass Prob
            </span>
            <span className="text-2xl font-black text-[var(--success)] font-serif">
              {passingProbability}%
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] block">Est. Offer Rate</span>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--outline)]/20 pb-2">
        <button
          onClick={() => setActiveTab('benchmarks')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'benchmarks'
              ? 'bg-[var(--primary)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-container)]'
          }`}
        >
          Competency vs Industry Baseline ({competencyPillars.length})
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'companies'
              ? 'bg-[var(--primary)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-container)]'
          }`}
        >
          Target Company Tiers ({companyFitTiers.length})
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'roadmap'
              ? 'bg-[var(--primary)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-container)]'
          }`}
        >
          14-Day Placement Roadmap ({fourteenDayRoadmap.length})
        </button>
      </div>

      {/* Tab 1: Competency vs Industry Baseline */}
      {activeTab === 'benchmarks' && (
        <motion.div
          key="tab-benchmarks"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competencyPillars.map((pillar, idx) => {
              const delta = Number((pillar.candidateScore - pillar.benchmarkScore).toFixed(1));
              const isPositive = delta >= 0;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[var(--surface-container)]/50 border border-[var(--outline)]/20 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        {pillar.name}
                      </h4>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {pillar.insight}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        pillar.status === 'Exceeds Benchmark'
                          ? 'bg-[#386A4A]/15 text-[#386A4A] dark:text-[#9BD0A6]'
                          : pillar.status === 'Meets Benchmark'
                          ? 'bg-[#8A5B16]/15 text-[#8A5B16] dark:text-[#F0C078]'
                          : 'bg-[#B9573D]/15 text-[#B9573D] dark:text-[#F0A18A]'
                      }`}
                    >
                      {pillar.status}
                    </span>
                  </div>

                  {/* Visual Comparison Progress */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-secondary)] flex items-center gap-1">
                        <span>Candidate Score:</span>
                        <strong className="text-[var(--primary)] font-bold">{pillar.candidateScore}</strong>
                      </span>
                      <span className="text-[var(--text-secondary)] flex items-center gap-1">
                        <span>Industry Baseline:</span>
                        <strong className="text-[var(--text-primary)] font-bold">{pillar.benchmarkScore}</strong>
                      </span>
                    </div>

                    <div className="relative h-2.5 rounded-full bg-[var(--outline)]/25 overflow-hidden">
                      {/* Candidate progress fill */}
                      <div
                        className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (pillar.candidateScore / 10) * 100)}%` }}
                      />
                      {/* Industry baseline vertical marker */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-[var(--text-primary)] rounded-full z-10 shadow-sm"
                        style={{ left: `${Math.min(98, (pillar.benchmarkScore / 10) * 100)}%` }}
                        title={`Industry Baseline: ${pillar.benchmarkScore}`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] pt-0.5">
                      <span>Percentile: {pillar.percentile}th</span>
                      <span className={isPositive ? 'text-[var(--success)] font-semibold' : 'text-[var(--error)] font-semibold'}>
                        {isPositive ? `+${delta} above baseline` : `${delta} below baseline`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strengths & Critical Gaps Dual Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#386A4A]/10 border border-[#386A4A]/25 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#386A4A] dark:text-[#9BD0A6] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Observed Hiring Strengths</span>
              </span>
              <ul className="space-y-1.5 text-xs text-[var(--text-primary)]">
                {strengthsHighlights.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#386A4A] font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--primary-container)]/30 border border-[var(--primary)]/25 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>High-Leverage Polish Areas</span>
              </span>
              <ul className="space-y-1.5 text-xs text-[var(--text-primary)]">
                {criticalGaps.map((g, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[var(--primary)] font-bold">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Target Company Tiers */}
      {activeTab === 'companies' && (
        <motion.div
          key="tab-companies"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <p className="text-xs text-[var(--text-secondary)]">
            Based on your demonstrated technical depth and STAR communication rigor, here is your predicted fit across major hiring company categories:
          </p>

          <div className="space-y-3">
            {companyFitTiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[var(--surface-container)]/50 border border-[var(--outline)]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[var(--primary)]" />
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">
                      {tier.tier}
                    </h4>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Target Profile Examples: {tier.examples}
                  </p>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 self-start sm:self-center ${
                    tier.readiness === 'High Match'
                      ? 'bg-[#386A4A]/15 text-[#386A4A] dark:text-[#9BD0A6] border border-[#386A4A]/30'
                      : tier.readiness === 'Competitive'
                      ? 'bg-[#8A5B16]/15 text-[#8A5B16] dark:text-[#F0C078] border border-[#8A5B16]/30'
                      : 'bg-[var(--primary-container)] text-[var(--primary)] border border-[var(--primary)]/30'
                  }`}
                >
                  {tier.readiness}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tab 3: 14-Day Placement Roadmap */}
      {activeTab === 'roadmap' && (
        <motion.div
          key="tab-roadmap"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--text-secondary)]">
              Follow this 4-phase structured action sprint to elevate your score from <strong>{readinessIndex}</strong> to a Staff/Bar-Raiser competitive <strong>92+</strong>:
            </p>
            <span className="text-[11px] font-bold text-[var(--primary)] shrink-0">
              Target: +1.2 Score Lift
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {fourteenDayRoadmap.map((milestone, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[var(--surface-container)]/50 border border-[var(--outline)]/20 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--primary)] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {milestone.dayRange}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--outline)]/30 text-[var(--text-secondary)]">
                      {milestone.drillType}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[var(--text-primary)]">
                    {milestone.phase}
                  </h4>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {milestone.actionItem}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--outline)]/15 flex items-center justify-between text-[11px] text-[var(--success)] font-semibold">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Expected ROI:
                  </span>
                  <span>{milestone.expectedImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </Card>
  );
}
