'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  InterviewConfig,
  ChatMessage,
  EvaluationReport,
  SessionHistoryItem,
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
  history: SessionHistoryItem[];
  saveReportToHistory: (report: EvaluationReport, cfg?: InterviewConfig) => void;
  clearHistory: () => void;
}

const DEFAULT_CONFIG: InterviewConfig = {
  role: 'Frontend Developer',
  experienceLevel: 'Junior (0-2 yrs)',
  interviewType: 'Behavioral (STAR)',
  difficulty: 'Medium',
  strictness: 'Standard',
  proctoringEnabled: true,
  candidateName: 'Candidate',
};

const DEFAULT_BASELINE_HISTORY: SessionHistoryItem[] = [
  {
    id: 'session-baseline-01',
    completedAt: '2 days ago',
    timestamp: Date.now() - 2 * 86400000,
    role: 'Frontend Developer',
    experienceLevel: 'Junior (0-2 yrs)',
    interviewType: 'Behavioral (STAR)',
    difficulty: 'Medium',
    strictness: 'Standard',
    overallScore: 6.8,
    verdict: 'Lean Hire',
    dimensions: {
      communication: 6.5,
      roleKnowledge: 7.2,
      problemSolving: 6.8,
      answerQuality: 6.7,
    },
    metrics: {
      wordsPerMinute: 112,
      totalWords: 380,
      paceAssessment: 'Ideal Pace',
      fillerWordCount: 7,
    },
    integrityScore: 98,
    readinessIndex: 68,
    summary: 'Initial baseline evaluation. Good raw potential, but lacked STAR structure and concrete metrics in the impact phase.',
  },
];

const InterviewContext = createContext<InterviewContextType | null>(null);

const STORAGE_KEY_CONFIG = 'viewpilot-interview-config';
const STORAGE_KEY_MESSAGES = 'viewpilot-interview-messages';
const STORAGE_KEY_REPORT = 'viewpilot-interview-report';
const STORAGE_KEY_HISTORY = 'viewpilot-interview-history';

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<InterviewConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [report, setReportState] = useState<EvaluationReport | null>(null);
  const [history, setHistory] = useState<SessionHistoryItem[]>(DEFAULT_BASELINE_HISTORY);
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

      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved interview state from localStorage', e);
    }
  }, []);

  const saveReportToHistory = (newReport: EvaluationReport, cfg?: InterviewConfig) => {
    const currentCfg = cfg || config;
    const historyItem: SessionHistoryItem = {
      id: newReport.id || `session-${Date.now()}`,
      completedAt: newReport.completedAt || new Date().toLocaleDateString(undefined, { dateStyle: 'medium' }),
      timestamp: Date.now(),
      role: currentCfg.role,
      experienceLevel: currentCfg.experienceLevel,
      interviewType: currentCfg.interviewType,
      difficulty: currentCfg.difficulty,
      strictness: currentCfg.strictness || newReport.strictness || 'Standard',
      overallScore: newReport.overallScore,
      verdict: newReport.verdict || 'Hire',
      dimensions: {
        communication: newReport.dimensions.communication.score,
        roleKnowledge: newReport.dimensions.roleKnowledge.score,
        problemSolving: newReport.dimensions.problemSolving.score,
        answerQuality: newReport.dimensions.answerQuality.score,
      },
      metrics: newReport.paceMetrics,
      videoMetrics: newReport.videoMetrics,
      integrityScore: newReport.integrityReport?.integrityScore ?? 98,
      readinessIndex: newReport.jobReadiness?.readinessIndex ?? Math.round(newReport.overallScore * 10),
      summary: newReport.executiveSummary,
      report: newReport,
    };

    setHistory((prev) => {
      // Deduplicate by ID
      const filtered = prev.filter((item) => item.id !== historyItem.id);
      const updated = [historyItem, ...filtered];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      }
      return updated;
    });
  };

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
        saveReportToHistory(newReport);
      } else {
        localStorage.removeItem(STORAGE_KEY_REPORT);
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
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
        history,
        saveReportToHistory,
        clearHistory,
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
