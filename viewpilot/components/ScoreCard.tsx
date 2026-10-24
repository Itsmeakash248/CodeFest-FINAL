'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DimensionEvaluation } from '@/types';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, TrendingUp, Sparkles, BookOpen } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  dimensionKey: string;
  evaluation: DimensionEvaluation;
  delay?: number;
}

export function ScoreCard({ title, dimensionKey, evaluation, delay = 0 }: ScoreCardProps) {
  const { score, criteria, coachingTip, practiceAction, strengths, areasForImprovement } = evaluation;

  // Determine color scheme based on score thresholds
  const getScoreTheme = (val: number) => {
    if (val >= 8.0) {
      return {
        badge: 'bg-[#386A4A]/15 text-[#386A4A] dark:text-[#9BD0A6] border-[#386A4A]/30',
        stroke: '#386A4A',
        label: 'Advanced',
      };
    }
    if (val >= 6.5) {
      return {
        badge: 'bg-[#8A5B16]/15 text-[#8A5B16] dark:text-[#F0C078] border-[#8A5B16]/30',
        stroke: '#8A5B16',
        label: 'Proficient',
      };
    }
    return {
      badge: 'bg-[#B9573D]/15 text-[#B9573D] dark:text-[#F0A18A] border-[#B9573D]/30',
      stroke: '#B9573D',
      label: 'Developing',
    };
  };

  const theme = getScoreTheme(score);
  const normalizedScore = Math.min(Math.max(score, 0), 10);
  const percentage = (normalizedScore / 10) * 100;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card
        variant="elevated"
        className="flex flex-col justify-between h-full bg-[var(--surface)] border border-[var(--outline)]/20 shadow-sm hover:shadow-md transition-shadow"
      >
        <div>
          {/* Header with Circular Score Gauge */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${theme.badge} mb-1.5`}>
                {theme.label}
              </span>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">
                {title || evaluation.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                {criteria}
              </p>
            </div>

            {/* Radial Meter */}
            <div className="relative flex-shrink-0 w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-[var(--surface-container)]"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke={theme.stroke}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  {score.toFixed(1)}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] -mt-1 font-medium">
                  / 10
                </span>
              </div>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="w-full bg-[var(--surface-container)] h-1.5 rounded-full overflow-hidden mb-5">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: theme.stroke }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, delay: delay + 0.1 }}
            />
          </div>

          {/* Strengths & Growth Areas */}
          {strengths && strengths.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#386A4A]" />
                Key Demonstrated Strengths
              </h4>
              <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                {strengths.slice(0, 2).map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[var(--primary)] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {areasForImprovement && areasForImprovement.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 mb-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#B9573D]" />
                Target Opportunity
              </h4>
              <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                {areasForImprovement.slice(0, 1).map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[var(--primary)] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer: Coaching Tip & Practice Action */}
        <div className="mt-4 pt-3 border-t border-[var(--outline)]/15 space-y-2">
          {coachingTip && (
            <div className="bg-[var(--surface-container)]/70 rounded-2xl p-2.5 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[var(--primary)] mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Coach Perspective</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {coachingTip}
              </p>
            </div>
          )}

          {practiceAction && (
            <div className="flex items-start gap-1.5 text-[11px] text-[var(--text-secondary)] px-1">
              <BookOpen className="w-3.5 h-3.5 text-[var(--secondary)] flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-[var(--text-primary)] font-medium">Practice Drill: </strong>
                {practiceAction}
              </span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
