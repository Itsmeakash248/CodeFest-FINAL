'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Volume2, VolumeX, Copy, Check } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types';
import { speakQuestion, stopSpeaking } from '@/lib/voice';

interface ChatMessageProps {
  message: ChatMessageType;
  totalQuestions?: number;
}

export function ChatMessage({ message, totalQuestions = 6 }: ChatMessageProps) {
  const isInterviewer = message.role === 'interviewer';
  const isSystem = message.role === 'system';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      speakQuestion(message.content, (playing) => {
        setIsPlayingAudio(playing);
      });
    }
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Basic markdown codeblock and formatting renderer
  const renderFormattedContent = (text: string) => {
    if (text.includes('```')) {
      const parts = text.split(/(```[\s\S]*?```)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const lang = lines[0].match(/^[a-z0-9_-]+$/i) ? lines[0] : '';
          const codeContent = lang ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div
              key={idx}
              className="my-3 rounded-xl bg-[var(--surface-container-highest)]/80 border border-[var(--outline)]/30 p-3.5 font-mono text-xs overflow-x-auto"
            >
              {lang && (
                <div className="text-[10px] uppercase font-bold text-[var(--text-secondary)] mb-1">
                  {lang}
                </div>
              )}
              <pre className="text-[var(--text-primary)] leading-normal">{codeContent}</pre>
            </div>
          );
        }
        return (
          <span key={idx} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      });
    }

    return <p className="whitespace-pre-wrap">{text}</p>;
  };

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

              {/* Read Aloud Button */}
              <button
                type="button"
                onClick={handleToggleAudio}
                title={isPlayingAudio ? 'Stop speaking' : 'Read question aloud'}
                className={`p-1 rounded-full text-xs transition-colors ${
                  isPlayingAudio
                    ? 'bg-[var(--primary)] text-[var(--on-primary)] animate-pulse'
                    : 'text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)]'
                }`}
              >
                {isPlayingAudio ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
            </>
          ) : (
            <span className="text-xs font-bold text-[var(--text-secondary)]">You</span>
          )}
        </div>

        {/* Bubble Text */}
        <div
          className={`relative group p-4 sm:p-5 rounded-[24px] text-sm sm:text-base leading-relaxed ${
            isInterviewer
              ? 'rounded-tl-xs bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--outline)]/40 shadow-expressive-sm'
              : 'rounded-tr-xs bg-[var(--primary-container)] text-[var(--on-primary-container)] border border-[var(--primary)]/30 font-normal shadow-xs'
          }`}
        >
          {renderFormattedContent(message.content)}

          {/* Quick Copy Action */}
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-[var(--surface-container)]/80 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs"
            title="Copy text"
          >
            {copied ? <Check className="w-3 h-3 text-[var(--success)]" /> : <Copy className="w-3 h-3" />}
          </button>
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
