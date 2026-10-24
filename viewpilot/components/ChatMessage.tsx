'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Sparkles, HelpCircle } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  totalQuestions?: number;
}

export function ChatMessage({ message, totalQuestions = 6 }: ChatMessageProps) {
  const isInterviewer = message.role === 'interviewer';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center my-3"
      >
        <span className="text-xs px-3.5 py-1.5 rounded-full bg-[var(--surface-container)] text-[var(--text-secondary)] border border-[var(--outline)]/30 font-medium">
          {message.content}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-start gap-3 my-4 w-full ${
        isInterviewer ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* AI Avatar */}
      {isInterviewer && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-[var(--primary)] mt-1">
          VP
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
          isInterviewer ? 'items-start' : 'items-end'
        }`}
      >
        {/* Header metadata tag */}
        <div className="flex items-center gap-2 mb-1.5 px-1">
          {isInterviewer ? (
            <>
              <span className="text-xs font-bold text-[var(--text-primary)]">
                ViewPilot Interviewer
              </span>
              {message.isFollowUp ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--tertiary-container)] text-[var(--tertiary)] flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Follow-up Probe
                </span>
              ) : message.questionNumber ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--secondary-container)] text-[var(--secondary)]">
                  Question {message.questionNumber} of {totalQuestions}
                </span>
              ) : null}
            </>
          ) : (
            <span className="text-xs font-bold text-[var(--text-secondary)]">You</span>
          )}
        </div>

        {/* Bubble Text */}
        <div
          className={`p-4 sm:p-5 rounded-[24px] text-sm sm:text-base leading-relaxed ${
            isInterviewer
              ? 'rounded-tl-xs bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--outline)]/40 shadow-expressive-sm'
              : 'rounded-tr-xs bg-[var(--primary-container)] text-[var(--on-primary-container)] border border-[var(--primary)]/30 font-normal shadow-xs'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Time footer */}
        <span className="text-[10px] text-[var(--text-secondary)]/70 mt-1 px-2">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {/* User Avatar */}
      {!isInterviewer && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--surface-container-high)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs shrink-0 border border-[var(--outline)]/40 mt-1">
          <User className="w-4 h-4 text-[var(--text-secondary)]" />
        </div>
      )}
    </motion.div>
  );
}
