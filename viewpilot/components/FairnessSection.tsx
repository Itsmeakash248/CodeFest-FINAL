'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Scale,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function FairnessSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      variant="elevated"
      className="p-5 sm:p-6 bg-[var(--surface)] border border-[var(--outline)]/25 shadow-sm space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--success)]/15 text-[var(--success)] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                AI Reliability, Fairness & Evaluation Transparency
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-container)] text-[var(--text-secondary)]">
                Audited Rubric
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Strict evidence-grounded scoring to prevent hallucination, eliminate demographic bias, and maintain consistency.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline self-start sm:self-auto"
        >
          <span>{isOpen ? 'Hide Audit Details' : 'View Scoring Methodology & Limitations'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="pt-4 border-t border-[var(--outline)]/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[var(--text-secondary)] animate-fadeIn">
          {/* Pillar 1: Evidence Grounding */}
          <div className="p-3.5 rounded-2xl bg-[var(--surface-container)]/60 border border-[var(--outline)]/20 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
              <FileCheck2 className="w-4 h-4 text-[var(--primary)]" />
              <span>Verbatim Evidence Citations</span>
            </div>
            <p className="leading-relaxed">
              Every score deduction or commendation requires direct verbatim quotes from your transcript. The model is forbidden from inventing or assuming candidate responses.
            </p>
          </div>

          {/* Pillar 2: Standardized Rubric Anchors */}
          <div className="p-3.5 rounded-2xl bg-[var(--surface-container)]/60 border border-[var(--outline)]/20 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
              <Scale className="w-4 h-4 text-[var(--secondary)]" />
              <span>Calibrated Rubric & Zero Bias</span>
            </div>
            <p className="leading-relaxed">
              Scoring prompts use deterministic temperature bounds (0.2) and demographic-neutral prompt constraints. Criteria evaluate only response substance, structure, and problem logic.
            </p>
          </div>

          {/* Pillar 3: AI Limitations Disclosure */}
          <div className="p-3.5 rounded-2xl bg-[var(--surface-container)]/60 border border-[var(--outline)]/20 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
              <AlertCircle className="w-4 h-4 text-[var(--warning)]" />
              <span>Scope & Limitations Disclosure</span>
            </div>
            <p className="leading-relaxed">
              ViewPilot provides educational practice and benchmark feedback. It is not an automated hiring filter and cannot evaluate visual non-verbal cues or live in-person team dynamics.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
