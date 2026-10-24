'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  InterviewConfig,
  ChatMessage,
  EvaluationReport,
  TargetRole,
  ExperienceLevel,
  InterviewType,
  DifficultyLevel,
} from '@/types';

interface InterviewContextType {
  config: InterviewConfig;
  setConfig: (config: Partial<InterviewConfig>) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage;
  currentQuestionCount: number;
  maxQuestions: number;
  report: EvaluationReport | null;
  setReport: (report: EvaluationReport | null) => void;
  resetSession: () => void;
  isSessionActive: boolean;
  setIsSessionActive: (active: boolean) => void;
}

const DEFAULT_CONFIG: InterviewConfig = {
  role: 'Frontend Developer',
  experienceLevel: 'Junior (0-2 yrs)',
  interviewType: 'Behavioral (STAR)',
  difficulty: 'Medium',
  candidateName: 'Candidate',
};

const InterviewContext = createContext<InterviewContextType | null>(null);

const STORAGE_KEY_CONFIG = 'viewpilot-interview-config';
const STORAGE_KEY_MESSAGES = 'viewpilot-interview-messages';
const STORAGE_KEY_REPORT = 'viewpilot-interview-report';

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<InterviewConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [report, setReportState] = useState<EvaluationReport | null>(null);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const maxQuestions = 6;

  // Hydrate from localStorage on client
  useEffect(() => {
    setMounted(true);
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (savedConfig) setConfigState(JSON.parse(savedConfig));

      const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (savedMessages) setMessages(JSON.parse(savedMessages));

      const savedReport = localStorage.getItem(STORAGE_KEY_REPORT);
      if (savedReport) setReportState(JSON.parse(savedReport));
    } catch (e) {
      console.warn('Failed to parse saved interview state from localStorage', e);
    }
  }, []);

  const setConfig = (newConfig: Partial<InterviewConfig>) => {
    setConfigState((prev) => {
      const updated = { ...prev, ...newConfig };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const setReport = (newReport: EvaluationReport | null) => {
    setReportState(newReport);
    if (typeof window !== 'undefined') {
      if (newReport) {
        localStorage.setItem(STORAGE_KEY_REPORT, JSON.stringify(newReport));
      } else {
        localStorage.removeItem(STORAGE_KEY_REPORT);
      }
    }
  };

  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
    const newMessage: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };

    setMessages((prev) => {
      const updated = [...prev, newMessage];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));
      }
      return updated;
    });

    return newMessage;
  };

  const resetSession = () => {
    setMessages([]);
    setReportState(null);
    setIsSessionActive(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_MESSAGES);
      localStorage.removeItem(STORAGE_KEY_REPORT);
    }
  };

  // Count how many substantive questions the interviewer asked
  const currentQuestionCount = messages.filter(
    (m) => m.role === 'interviewer' && !m.isFollowUp
  ).length;

  return (
    <InterviewContext.Provider
      value={{
        config,
        setConfig,
        messages,
        setMessages,
        addMessage,
        currentQuestionCount,
        maxQuestions,
        report,
        setReport,
        resetSession,
        isSessionActive,
        setIsSessionActive,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
