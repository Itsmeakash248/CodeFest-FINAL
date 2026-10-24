'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DimensionEvaluation } from '@/types';
import { Card } from '@/components/ui/Card';
import { Quote, ChevronDown, CheckCircle, FileText, MessageSquareQuote } from 'lucide-react';

interface EvidencePanelProps {
  dimensions: {
    communication: DimensionEvaluation;
    roleKnowledge: DimensionEvaluation;
    problemSolving: DimensionEvaluation;
    answerQuality: DimensionEvaluation;
  };
}

export function EvidencePanel({ dimensions }: EvidencePanelProps) {
  const [activeTab, setActiveTab] = useState<'communication' | 'roleKnowledge' | 'problemSolving' | 'answerQuality'>('communication');

  const dimensionList = [
    { key: 'communication', label: 'Communication' },
    { key: 'roleKnowledge', label: 'Technical Depth' },
    { key: 'problemSolving', label: 'Problem Solving' },
    { key: 'answerQuality', label: 'Answer Quality' },
  ] as const;

  const currentEval = dimensions[activeTab];

  return (
    <Card variant="elevated" className="overflow-hidden border border-[var(--outline)]/25">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--outline)]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[var(--primary-container)] text-[var(--primary)]">
              <MessageSquareQuote className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              Evidence Audit & Transcript Citations
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Every score ties directly to verifiable quotes from your interview session. No mystery algorithms.
          </p>
        </div>

        <span className="hidden sm:inline-flex text-xs px-3 py-1 rounded-full bg-[var(--secondary-container)] text-[var(--secondary)] font-medium">
          Verbatim Proof
        </span>
      </div>

      {/* Dimension Tabs */}
      <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
        {dimensionList.map(({ key, label }) => {
          const isSelected = activeTab === key;
          const score = dimensions[key]?.score || 0;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isSelected
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'bg-[var(--surface-container)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-container-high)]'
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[var(--outline)]/30 text-[var(--text-primary)]'
                }`}
              >
                {score.toFixed(1)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content with Evidence Quotes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="mt-5 space-y-4"
        >
          <div className="bg-[var(--surface-container)]/50 rounded-2xl p-4 border border-[var(--outline)]/15">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              {currentEval.name} Evaluation Standard
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {currentEval.criteria}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-[var(--primary)]" />
              Recorded Candidate Statements
            </h4>

            {currentEval.evidence && currentEval.evidence.length > 0 ? (
              currentEval.evidence.map((quote, idx) => {
                // If quote is a string or object with details
                const quoteText = typeof quote === 'string' ? quote : (quote as any).quote;
                const context = typeof quote === 'object' ? (quote as any).context : null;
                const analysis = typeof quote === 'object' ? (quote as any).analysis : null;

                return (
                  <div
                    key={idx}
                    className="relative bg-[var(--surface)] border border-[var(--outline)]/20 rounded-2xl p-4 shadow-sm hover:border-[var(--primary)]/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-[var(--tertiary-container)]/40 text-[var(--tertiary)] flex-shrink-0 mt-0.5">
                        <Quote className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {context && (
                          <div className="text-[11px] font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                            <span>Context:</span>
                            <span className="text-[var(--text-primary)] font-semibold">{context}</span>
                          </div>
                        )}
                        <blockquote className="text-xs italic text-[var(--text-primary)] leading-relaxed border-l-2 border-[var(--primary)] pl-3 my-1.5 font-serif">
                          "{quoteText.replace(/^"|"$/g, '')}"
                        </blockquote>
                        {analysis && (
                          <p className="text-[11px] text-[var(--text-secondary)] mt-2">
                            <span className="font-semibold text-[var(--primary)]">Evaluation: </span>
                            {analysis}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-xs text-[var(--text-secondary)] bg-[var(--surface-container)] rounded-2xl">
                No direct transcript quotes logged for this dimension.
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
