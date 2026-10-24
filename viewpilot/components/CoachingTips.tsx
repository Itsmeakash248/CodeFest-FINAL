'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { ImprovedAnswerBlueprint } from '@/types';
import {
  Lightbulb,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Wand2,
  Target,
  ListChecks,
} from 'lucide-react';

interface CoachingTipsProps {
  blueprint: string | ImprovedAnswerBlueprint;
  nextSteps?: string[];
  keyTakeaways?: string[];
}

export function CoachingTips({ blueprint, nextSteps, keyTakeaways }: CoachingTipsProps) {
  const isObjectBlueprint = typeof blueprint === 'object' && blueprint !== null;
  const originalQuestion = isObjectBlueprint ? blueprint.originalQuestion : null;
  const candidateExcerpt = isObjectBlueprint ? blueprint.candidateExcerpt : null;
  const critique = isObjectBlueprint ? blueprint.critique : null;
  const rewrittenAnswer = isObjectBlueprint ? blueprint.rewrittenAnswer : blueprint;
  const keyTechnique = isObjectBlueprint ? blueprint.keyTechnique : 'STAR + Quantified Impact';

  return (
    <div className="space-y-6">
      {/* Improved Answer Blueprint Card */}
      <Card variant="elevated" className="overflow-hidden border border-[var(--outline)]/25">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--outline)]/20">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-container)] text-[var(--primary)] mb-2">
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Answer Blueprint</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              Model Answer Reconstruction
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              We took your exact project context and restructured it to demonstrate top-tier engineering communication.
            </p>
          </div>

          {keyTechnique && (
            <span className="hidden md:inline-flex text-xs px-3 py-1.5 rounded-full bg-[var(--tertiary-container)] text-[var(--tertiary)] font-semibold border border-[var(--tertiary)]/20">
              {keyTechnique}
            </span>
          )}
        </div>

        <div className="mt-5 space-y-4">
          {/* Question & Candidate Original Excerpt */}
          {originalQuestion && (
            <div className="bg-[var(--surface-container)]/40 rounded-2xl p-4 border border-[var(--outline)]/15">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Original Question
              </h4>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {originalQuestion}
              </p>
            </div>
          )}

          {candidateExcerpt && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#B9573D]/5 dark:bg-[#713B2B]/20 rounded-2xl p-4 border border-[#B9573D]/20">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B9573D] mb-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Your Answer Snippet</span>
                </div>
                <blockquote className="text-xs italic text-[var(--text-secondary)] leading-relaxed font-serif">
                  "{candidateExcerpt}"
                </blockquote>
                {critique && (
                  <p className="text-[11px] text-[var(--text-primary)] mt-3 pt-2 border-t border-[#B9573D]/15">
                    <strong className="text-[#B9573D]">Gap: </strong>
                    {critique}
                  </p>
                )}
              </div>

              {/* Rewritten Answer */}
              <div className="bg-[#386A4A]/5 dark:bg-[#9BD0A6]/10 rounded-2xl p-4 border border-[#386A4A]/25">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#386A4A] dark:text-[#9BD0A6] mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Elevated Model Answer</span>
                </div>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">
                  {rewrittenAnswer}
                </p>
              </div>
            </div>
          )}

          {/* Simple String Blueprint fallback */}
          {!candidateExcerpt && rewrittenAnswer && (
            <div className="bg-[var(--surface-container)]/60 rounded-2xl p-4 border border-[var(--outline)]/20">
              <p className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-line font-medium">
                {rewrittenAnswer}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Actionable Next Steps Grid */}
      {(nextSteps || keyTakeaways) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nextSteps && nextSteps.length > 0 && (
            <Card variant="tonal" className="p-5 border border-[var(--outline)]/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-xl bg-[var(--primary-container)] text-[var(--primary)]">
                  <ListChecks className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Actionable Practice Drills
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                {nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {keyTakeaways && keyTakeaways.length > 0 && (
            <Card variant="tonal" className="p-5 border border-[var(--outline)]/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-xl bg-[var(--secondary-container)] text-[var(--secondary)]">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Core Architectural Takeaways
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                {keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#386A4A] flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
