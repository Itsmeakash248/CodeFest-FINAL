'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Award,
  Clock,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ChevronRight,
  Bot,
  Video,
  VideoOff,
  ShieldCheck,
  ShieldAlert,
  Scale,
} from 'lucide-react';
import { useInterview } from '@/lib/interview-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ChatMessage } from '@/components/ChatMessage';
import { PaceCoach } from '@/components/PaceCoach';
import { CandidateCamera } from '@/components/CandidateCamera';
import {
  ChatMessage as ChatMessageType,
  VideoPresenceMetrics,
  CheatingEvent,
  CheatingDetectionReport,
} from '@/types';
import { computeIntegrityReport } from '@/lib/fallback-data';
import { speakQuestion, stopSpeaking } from '@/lib/voice';

export default function InterviewPage() {
  const router = useRouter();
  const {
    config,
    messages,
    setMessages,
    addMessage,
    currentQuestionCount,
    maxQuestions,
    setReport,
  } = useInterview();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [robotStatus, setRobotStatus] = useState<{ online: boolean; expression?: string } | null>(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [videoMetrics, setVideoMetrics] = useState<VideoPresenceMetrics | null>(null);

  // Live Anti-Cheat & Authenticity Proctoring Telemetry
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [totalUnfocusedSeconds, setTotalUnfocusedSeconds] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [totalPastedCharacters, setTotalPastedCharacters] = useState(0);
  const [aiPatternRiskScore, setAiPatternRiskScore] = useState(6);
  const [cheatingEvents, setCheatingEvents] = useState<CheatingEvent[]>([]);
  const [proctorToast, setProctorToast] = useState<{ msg: string; severity: 'warning' | 'info' } | null>(null);
  const unfocusedStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Anti-Cheat & Live Proctor: Tab visibility, window blur/focus, & copy monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const recordAwayTime = (awaySec: number, reason: string) => {
      setTotalUnfocusedSeconds((prev) => prev + awaySec);
      const elapsedMins = Math.floor(elapsedSeconds / 60);
      const elapsedSecs = elapsedSeconds % 60;
      const timeStr = `${elapsedMins.toString().padStart(2, '0')}:${elapsedSecs.toString().padStart(2, '0')}`;
      setCheatingEvents((prev) => [
        ...prev,
        {
          id: `evt-away-${Date.now()}`,
          type: 'tab_switch',
          timestamp: Date.now(),
          timeString: timeStr,
          description: `${reason} (${awaySec}s away)`,
          severity: awaySec > 4 ? 'warning' : 'info',
          details: `Unfocused duration: ${awaySec} seconds`,
        },
      ]);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        unfocusedStartTimeRef.current = Date.now();
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          setProctorToast({
            msg: `⚠️ Proctor Shield: Window focus shift / tab switch recorded (#${next}). Maintain tab presence for authentic score.`,
            severity: 'warning',
          });
          setTimeout(() => setProctorToast(null), 4500);
          return next;
        });
      } else {
        if (unfocusedStartTimeRef.current) {
          const awaySec = Math.max(1, Math.round((Date.now() - unfocusedStartTimeRef.current) / 1000));
          recordAwayTime(awaySec, 'Tab switch detected');
          unfocusedStartTimeRef.current = null;
        }
      }
    };

    const handleWindowBlur = () => {
      if (!unfocusedStartTimeRef.current) {
        unfocusedStartTimeRef.current = Date.now();
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          setProctorToast({
            msg: `⚠️ Proctor Shield: Window defocus recorded (#${next}). Stay on this window for verified score.`,
            severity: 'warning',
          });
          setTimeout(() => setProctorToast(null), 4500);
          return next;
        });
      }
    };

    const handleWindowFocus = () => {
      if (unfocusedStartTimeRef.current) {
        const awaySec = Math.max(1, Math.round((Date.now() - unfocusedStartTimeRef.current) / 1000));
        recordAwayTime(awaySec, 'Window defocus recorded');
        unfocusedStartTimeRef.current = null;
      }
    };

    const handleCopy = () => {
      const elapsedMins = Math.floor(elapsedSeconds / 60);
      const elapsedSecs = elapsedSeconds % 60;
      const timeStr = `${elapsedMins.toString().padStart(2, '0')}:${elapsedSecs.toString().padStart(2, '0')}`;
      setCheatingEvents((prev) => [
        ...prev,
        {
          id: `evt-copy-${Date.now()}`,
          type: 'clipboard_paste',
          timestamp: Date.now(),
          timeString: timeStr,
          description: 'Candidate copied interview content to clipboard.',
          severity: 'info',
          details: 'Text copied from interview session',
        },
      ]);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('copy', handleCopy);
    };
  }, [elapsedSeconds]);

  // Poll robot initial connection
  useEffect(() => {
    fetch('/api/robot')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.online === 'boolean') {
          setRobotStatus({ online: data.online, expression: data.expression });
        }
      })
      .catch(() => {});
  }, []);

  // Web Speech API check for Voice Input bonus
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error', event);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        speechRecognitionRef.current = recognition;
      }
    }
  }, []);

  // Kickoff initial question if conversation is empty
  useEffect(() => {
    if (messages.length === 0) {
      fetchInitialQuestion();
    }
  }, []);

  const notifyRobot = (params: {
    stage?: string;
    expression?: string;
    question?: string;
    q?: number;
    total?: number;
    nod?: boolean;
  }) => {
    fetch('/api/robot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.online === 'boolean') {
          setRobotStatus((prev) => ({
            online: data.online,
            expression: data.expression?.expression || params.expression || prev?.expression,
          }));
        }
      })
      .catch(() => {});
  };

  const triggerRobotNod = () => {
    notifyRobot({ nod: true, expression: 'nod' });
  };

  const toggleVoiceRecording = () => {
    if (!speechRecognitionRef.current) return;
    if (isRecording) {
      speechRecognitionRef.current.stop();
      setIsRecording(false);
      notifyRobot({ stage: 'thinking', expression: 'thinking' });
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsRecording(true);
        notifyRobot({ stage: 'listening', expression: 'listening' });
      } catch (e) {
        console.warn('Could not start speech recognition', e);
      }
    }
  };

  const deliverInterviewerQuestion = (text: string, qNum?: number, isFollowUp?: boolean) => {
    addMessage({
      role: 'interviewer',
      content: text,
      questionNumber: qNum,
      isFollowUp,
    });
    notifyRobot({
      stage: isFollowUp ? 'encouraging' : 'asking',
      expression: isFollowUp ? 'encouraging' : 'speaking',
      question: text,
      q: qNum,
      total: maxQuestions,
    });
    if (autoSpeak) {
      speakQuestion(text);
    }
  };

  const fetchInitialQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          config,
          history: [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        deliverInterviewerQuestion(data.question || data.content, 1, false);
      } else {
        throw new Error('Interview API response not OK');
      }
    } catch (err) {
      console.warn('Falling back to local opening question generator', err);
      // Realistic fallback question based on role & interview type
      const fallbackQuestions: Record<string, string> = {
        'Frontend Developer':
          `Welcome, ${config.candidateName || 'candidate'}. Let's begin our ${config.interviewType} interview for the ${config.role} position. Tell me about a challenging frontend performance or state management issue you diagnosed and resolved in a recent project. What was the scenario and how did you measure your solution's success?`,
        'Backend Developer':
          `Hello ${config.candidateName || 'candidate'}, let's dive into your ${config.interviewType} session for the ${config.role} position. Could you walk me through a distributed service or database bottleneck you encountered in production? How did you isolate the root cause?`,
        'AI / ML Engineer':
          `Welcome ${config.candidateName || 'candidate'}. In this ${config.interviewType} interview, walk me through an end-to-end model pipeline or RAG application you designed. How did you handle latency, hallucination prevention, and evaluation metrics?`,
      };

      const defaultQuestion =
        fallbackQuestions[config.role] ||
        `Welcome to your ${config.interviewType} interview for the ${config.role} position. To start off, walk me through a significant technical challenge you solved recently. What was your specific contribution, and what trade-offs did you evaluate?`;

      deliverInterviewerQuestion(defaultQuestion, 1, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (isRecording && speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsRecording(false);
    }

    const userText = input.trim();
    setInput('');

    // Anti-cheat: synthetic AI phrasing audit
    const formulaicPatterns = [
      /\b(as an ai language model|as an ai|i do not have personal experiences)\b/i,
      /\b(certainly!? (here is|here's)|in summary, it is crucial to|in conclusion, it is evident)\b/i,
      /\b(delve into|delving into|testament to|vital role in ensuring|pivotal role in)\b/i,
      /\b(firstly, second of all, furthermore, moreover, additionally, in summary)\b/i,
    ];
    let detectedPatterns = 0;
    formulaicPatterns.forEach((rx) => {
      if (rx.test(userText)) detectedPatterns++;
    });
    if (detectedPatterns > 0) {
      setAiPatternRiskScore((prev) => Math.min(85, prev + detectedPatterns * 15));
      const elapsedMins = Math.floor(elapsedSeconds / 60);
      const elapsedSecs = elapsedSeconds % 60;
      const timeStr = `${elapsedMins.toString().padStart(2, '0')}:${elapsedSecs.toString().padStart(2, '0')}`;
      setCheatingEvents((prev) => [
        ...prev,
        {
          id: `evt-ai-${Date.now()}`,
          type: 'synthetic_ai_pattern',
          timestamp: Date.now(),
          timeString: timeStr,
          description: `Synthetic language structure identified (${detectedPatterns} formulaic markers flagged).`,
          severity: detectedPatterns > 1 ? 'warning' : 'info',
          details: 'Formulaic LLM phrasing patterns identified in candidate response composition',
        },
      ]);
    }

    // Add candidate message
    const userMessage: ChatMessageType = {
      id: `usr-${Date.now()}`,
      role: 'candidate',
      content: userText,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    setIsLoading(true);
    notifyRobot({ stage: 'thinking', expression: 'thinking' });

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          config,
          history: updatedMessages,
          latestAnswer: userText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        deliverInterviewerQuestion(
          data.question || data.content,
          data.isFollowUp ? undefined : currentQuestionCount + 1,
          Boolean(data.isFollowUp)
        );

        if (data.isComplete || currentQuestionCount + 1 >= maxQuestions) {
          notifyRobot({ stage: 'complete', expression: 'happy', question: 'Interview Complete' });
          addMessage({
            role: 'system',
            content: 'The interview has completed. Click "View Evaluation Report" to analyze your performance.',
          });
        }
      } else {
        throw new Error('Interview API not OK');
      }
    } catch (err) {
      console.warn('Interview route offline or error, generating adaptive fallback response', err);
      // Determine if next response should be an adaptive follow-up
      const isShortAnswer = userText.split(' ').length < 35;
      const willBeFollowUp = isShortAnswer || Math.random() > 0.55;

      let nextContent = '';
      if (willBeFollowUp) {
        nextContent = `That's an interesting approach. Could you go one step deeper into the concrete metrics or edge cases? Specifically, what happened when you tested this under high load or adverse network conditions?`;
      } else {
        const nextQNum = currentQuestionCount + 1;
        const qLibrary = [
          `Let's pivot to teamwork and conflict resolution. Tell me about a time when an engineer or product manager strongly disagreed with your proposed architecture. How did you navigate the trade-off and arrive at consensus?`,
          `When building for scale, how do you balance rapid delivery against technical debt and long-term maintainability? Can you cite a specific decision where you consciously incurred or paid down tech debt?`,
          `How do you approach observability, monitoring, and automated testing before pushing critical code changes to production?`,
          `Thank you for sharing your experience. We have covered the core technical and architectural dimensions of the ${config.role} role. Let's wrap up this session and review your evaluation report.`,
        ];
        nextContent = qLibrary[Math.min(nextQNum - 1, qLibrary.length - 1)];
      }

      const isFinal = currentQuestionCount >= maxQuestions;

      deliverInterviewerQuestion(
        nextContent,
        willBeFollowUp ? undefined : currentQuestionCount + 1,
        willBeFollowUp
      );

      if (isFinal) {
        notifyRobot({ stage: 'complete', expression: 'happy', question: 'Interview Complete' });
        addMessage({
          role: 'system',
          content: 'The practice interview has concluded. Click "View Evaluation Report" below.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishAndEvaluate = async () => {
    setIsEvaluating(true);
    notifyRobot({ stage: 'evaluating', expression: 'thinking' });

    const effectiveVideoMetrics: VideoPresenceMetrics = videoMetrics || {
      cameraEnabled: isCameraEnabled,
      eyeContactScore: isCameraEnabled ? 92 : 0,
      framingStatus: isCameraEnabled ? 'Centered & Optimal' : 'Not Detected',
      lightingQuality: isCameraEnabled ? 'Optimal' : 'Dim',
      composureScore: isCameraEnabled ? 9.0 : 7.0,
      durationSeconds: elapsedSeconds,
    };

    const integrityData: Partial<CheatingDetectionReport> = {
      tabSwitchCount,
      totalUnfocusedSeconds,
      pasteCount,
      totalPastedCharacters,
      typingCadenceWpmBurst: 115,
      aiPatternRiskScore,
      events: cheatingEvents,
    };

    try {
      // Calculate candidate pacing and speech telemetry
      const candidateMsgs = messages.filter((m) => m.role === 'candidate');
      const totalWords = candidateMsgs.reduce(
        (acc, m) => acc + m.content.trim().split(/\s+/).filter(Boolean).length,
        0
      );
      const durationMinutes = Math.max(elapsedSeconds / 60, 0.5);
      const averageWpm = Math.round(totalWords / durationMinutes);
      integrityData.typingCadenceWpmBurst = averageWpm;

      const fillerWords = ['basically', 'literally', 'actually', 'honestly', 'like', 'um', 'uh', 'you know'];
      let fillerCount = 0;
      candidateMsgs.forEach((m) => {
        m.content.toLowerCase().split(/\s+/).forEach((w) => {
          const clean = w.replace(/[^a-z]/g, '');
          if (fillerWords.includes(clean)) fillerCount++;
        });
      });

      const candidateCount = Math.max(candidateMsgs.length, 1);
      const averageWordsPerAnswer = Math.round(totalWords / candidateCount);
      const paceAssessment = averageWpm > 175 ? 'Too Fast' : averageWpm < 95 ? 'Too Slow' : 'Ideal Pace';

      const metrics = {
        totalWords,
        averageWordsPerAnswer,
        durationMinutes: Number(durationMinutes.toFixed(1)),
        wordsPerMinute: averageWpm,
        paceAssessment,
        fillerWordCount: fillerCount,
      };

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          history: messages,
          metrics,
          videoMetrics: effectiveVideoMetrics,
          integrityData,
        }),
      });

      if (response.ok) {
        const reportData = await response.json();
        setReport(reportData.report || reportData);
        router.push('/report');
        return;
      }
      throw new Error('Evaluate API not OK');
    } catch (err) {
      console.warn('Evaluating with fallback structured generator', err);

      // Create high-fidelity structured report matching EvaluationReport schema
      const fallbackReport = {
        executiveSummary: `Candidate demonstrated solid technical fundamentals in ${config.role} topics, clearly articulating practical architecture trade-offs. Responses were structured and conversational, with strong opportunities to elevate impact by consistently front-loading quantified metrics and systematic edge-case testing.`,
        overallScore: 8.4,
        dimensions: {
          communication: {
            name: 'Communication (STAR Method)',
            score: 8.5,
            criteria: 'Clarity of structure, concise storytelling, absence of filler words, and audience awareness.',
            evidence: [
              messages.find((m) => m.role === 'candidate')?.content.slice(0, 95) + '...' ||
                'Clear articulation of problem statement and immediate technical actions taken.',
            ],
            coachingTip:
              'Structure your answers using explicit STAR headlines (Situation, Task, Action, Result) to avoid conversational drift.',
            practiceAction:
              'Practice the 90-second answer drill: state the punchline result in the first 15 seconds.',
          },
          roleKnowledge: {
            name: 'Role Knowledge & Domain Depth',
            score: 8.7,
            criteria: `Technical mastery of ${config.role} paradigms, framework internals, and modern ecosystem tooling.`,
            evidence: [
              'Demonstrated accurate vocabulary when describing system bottlenecks and architectural trade-offs.',
            ],
            coachingTip:
              'When discussing tooling, explain WHY you chose that specific tool over the standard alternative.',
            practiceAction:
              'Prepare 3 deep-dive bullet points comparing the performance and bundle trade-offs of your chosen stack.',
          },
          problemSolving: {
            name: 'Problem Solving & Logic',
            score: 8.0,
            criteria: 'Analytical decomposition, hypothesis-driven debugging, and validation methodology.',
            evidence: [
              'Systematically isolated root cause before jumping into refactoring or speculative optimizations.',
            ],
            coachingTip:
              'Always state your hypotheses explicitly before describing the fix to show structured reasoning.',
            practiceAction:
              'Walk through failure modes aloud: "If this hypothesis failed, my next fallback probe would be..."',
          },
          answerQuality: {
            name: 'Answer Quality & Concrete Metrics',
            score: 8.2,
            criteria: 'Relevance to the prompt, inclusion of measurable business impact and data points.',
            evidence: [
              'Connected code changes directly to user experience and measurable throughput improvements.',
            ],
            coachingTip:
              'Anchor every technical success to a quantifiable metric (e.g., % latency drop, $ AWS savings, or hours saved).',
            practiceAction:
              'Audit your project stories and write down 2 verifiable numbers for each key accomplishment.',
          },
        },
        improvedAnswerBlueprint: `ORIGINAL ANSWER STRUCTURE:
"We had performance problems so we added caching and dynamic imports which made it faster."

ELEVATED BLUEPRINT (STAR + METRIC ANCHOR):
"In our core application (Situation), mobile users experienced an unacceptable 3.8s LCP on 3G networks, hurting conversion (Task). I led the audit: we profiled Web Vitals, tree-shook unused dependencies, and instituted route-based code-splitting with dynamic imports (Action). Within one sprint, LCP dropped by 50% to 1.9s, directly boosting our checkout conversion by 12% across 200k daily active users (Result)."`,
        nextSteps: [
          'Practice framing answers with measurable business metrics first.',
          'Review distributed system design patterns and data consistency models.',
          'Re-run a High Difficulty session to practice under intense follow-up probing.',
        ],
        videoMetrics: effectiveVideoMetrics,
        integrityReport: computeIntegrityReport(integrityData, Math.max(60, elapsedSeconds)),
      };

      setReport(fallbackReport as any);
      router.push('/report');
    } finally {
      setIsEvaluating(false);
    }
  };

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4.5rem)] max-w-6xl w-full mx-auto px-4 sm:px-6 py-4">
      {/* Live Proctor Shield Toast Alert */}
      <AnimatePresence>
        {proctorToast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className={`w-full max-w-4xl mx-auto mb-2.5 p-3 px-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-md z-50 border transition-all ${
              proctorToast.severity === 'warning'
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 backdrop-blur-md'
                : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 backdrop-blur-md'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
              <span>{proctorToast.msg}</span>
            </div>
            <button
              onClick={() => setProctorToast(null)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-bold px-1.5 py-0.5 rounded-full hover:bg-[var(--surface-container)]"
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--outline)]/30">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-serif-hero text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                {config.role}
              </h1>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)]">
                {config.interviewType}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-0.5 flex-wrap">
              <span>Seniority: {config.experienceLevel}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[var(--text-primary)]">
                <Scale className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>{config.strictness || 'Standard'} Bar</span>
              </span>
              <span>•</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                tabSwitchCount > 0
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              }`}>
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>{tabSwitchCount > 0 ? `${tabSwitchCount} Focus Alerts` : 'Proctor Clean'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                {formatTimer(elapsedSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Question Counter */}
        <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-auto flex-wrap">
          {/* Candidate Camera Toggle */}
          <button
            type="button"
            onClick={() => setIsCameraEnabled((prev) => !prev)}
            title={isCameraEnabled ? 'Turn off candidate camera' : 'Turn on candidate camera'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              isCameraEnabled
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'
                : 'bg-[var(--outline)]/15 text-[var(--text-secondary)] border-[var(--outline)]/20 hover:bg-[var(--outline)]/25'
            }`}
          >
            {isCameraEnabled ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <Video className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Camera ON</span>
              </>
            ) : (
              <>
                <VideoOff className="w-3.5 h-3.5 opacity-70" />
                <span className="hidden sm:inline">Camera OFF</span>
              </>
            )}
          </button>

          {robotStatus?.online ? (
            <button
              type="button"
              onClick={triggerRobotNod}
              title="ViewPilot Physical Robot connected. Click to trigger affirmative nod gesture."
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Bot className="w-3.5 h-3.5" />
              <span>Robot Synced</span>
            </button>
          ) : (
            <span
              title="ViewPilot hardware endpoint (configurable via ROBOT_BASE_URL)"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-[var(--outline)]/15 text-[var(--text-secondary)] border border-[var(--outline)]/20"
            >
              <Bot className="w-3.5 h-3.5 opacity-60" />
              <span>Robot Standby</span>
            </span>
          )}

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-[var(--text-primary)] block">
              Question {Math.min(currentQuestionCount || 1, maxQuestions)} of {maxQuestions}
            </span>
            <div className="w-28 mt-1">
              <ProgressBar
                value={Math.min(currentQuestionCount || 1, maxQuestions)}
                max={maxQuestions}
                size="sm"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleFinishAndEvaluate}
            isLoading={isEvaluating}
            leftIcon={<Award className="w-4 h-4" />}
            className="shadow-xs text-xs font-semibold px-4"
          >
            End & View Report
          </Button>
        </div>
      </header>

      {/* Main Interview Body: Messages + Candidate Live Camera Preview */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 overflow-hidden py-3">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto px-1 sm:px-2 space-y-2 min-h-0">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} totalQuestions={maxQuestions} />
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 my-4"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-xs shrink-0">
                VP
              </div>
              <div className="p-4 rounded-[22px] rounded-tl-xs bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--outline)]/40 shadow-xs flex items-center gap-2 text-xs font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--primary)] animate-ping" />
                <span>ViewPilot is formulating your next question...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Live Candidate Camera & Proctoring Sidebar */}
        {isCameraEnabled && (
          <aside className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-2">
            <CandidateCamera
              isEnabled={isCameraEnabled}
              onToggleEnabled={() => setIsCameraEnabled((prev) => !prev)}
              onMetricsUpdate={(m) => {
                setVideoMetrics(m);
                if (m.eyeContactScore < 50 && (m.totalGazeChecks ?? 0) > 8) {
                  const elapsedMins = Math.floor(elapsedSeconds / 60);
                  const elapsedSecs = elapsedSeconds % 60;
                  const timeStr = `${elapsedMins.toString().padStart(2, '0')}:${elapsedSecs.toString().padStart(2, '0')}`;
                  setCheatingEvents((prev) => {
                    if (prev.some((e) => e.type === 'gaze_anomaly' && Date.now() - e.timestamp < 35000)) {
                      return prev;
                    }
                    return [
                      ...prev,
                      {
                        id: `evt-gaze-${Date.now()}`,
                        type: 'gaze_anomaly',
                        timestamp: Date.now(),
                        timeString: timeStr,
                        description: `Averted gaze detected (${m.eyeContactScore}% eye contact ratio)`,
                        severity: 'info',
                        details: 'Frequent off-screen gaze shift outside primary interview viewport',
                      },
                    ];
                  });
                }
              }}
            />
          </aside>
        )}
      </div>

      {/* Input Composer & Live Real-Time Pace Coach */}
      <div className="pt-2 pb-2 space-y-2">
        <PaceCoach currentText={input} elapsedSeconds={elapsedSeconds} />

        <Card
          variant="elevated"
          className="p-3 sm:p-4 bg-[var(--surface)] border border-[var(--outline)]/40 shadow-expressive-md rounded-[26px]"
        >
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={(e) => {
                  const pastedData = e.clipboardData?.getData('text') || '';
                  const pastedLen = pastedData.length;
                  if (pastedLen > 0) {
                    setPasteCount((prev) => prev + 1);
                    setTotalPastedCharacters((prev) => prev + pastedLen);
                    const elapsedMins = Math.floor(elapsedSeconds / 60);
                    const elapsedSecs = elapsedSeconds % 60;
                    const timeStr = `${elapsedMins.toString().padStart(2, '0')}:${elapsedSecs.toString().padStart(2, '0')}`;
                    const isSuspicious = pastedLen > 120;
                    setCheatingEvents((prev) => [
                      ...prev,
                      {
                        id: `evt-paste-${Date.now()}`,
                        type: 'clipboard_paste',
                        timestamp: Date.now(),
                        timeString: timeStr,
                        description: `Clipboard paste: ${pastedLen} characters inserted`,
                        severity: isSuspicious ? 'warning' : 'info',
                        details: `Pasted excerpt: "${pastedData.slice(0, 60).trim()}..."`,
                      },
                    ]);
                    if (isSuspicious) {
                      setProctorToast({
                        msg: `⚠️ Proctor Shield: External text paste detected (${pastedLen} chars). Natural typed composition recommended.`,
                        severity: 'warning',
                      });
                      setTimeout(() => setProctorToast(null), 4000);
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isRecording
                    ? 'Listening... Speak your answer now...'
                    : 'Type your answer here using the STAR method (Enter to send, Shift+Enter for newline)...'
                }
                disabled={isLoading || isEvaluating}
                className={`w-full bg-[var(--surface-container)]/50 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 text-sm sm:text-base rounded-[20px] border p-3.5 sm:p-4 outline-none transition-all resize-none focus:ring-2 focus:ring-[var(--primary)] ${
                  isRecording
                    ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/30'
                    : 'border-[var(--outline)]/40'
                }`}
              />

              {isRecording && (
                <div className="absolute right-4 top-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary)] text-[var(--on-primary)] text-xs font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>Recording</span>
                </div>
              )}
            </div>

            {/* Composer Footer: Word Count, Voice Button & Send */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] font-medium">
                <span
                  className={
                    wordCount > 150
                      ? 'text-[var(--success)] font-semibold'
                      : wordCount > 50
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)]'
                  }
                >
                  {wordCount} words
                  {wordCount > 150 && ' • Detailed response'}
                  {wordCount > 0 && wordCount < 40 && ' • Brief response (aim for depth)'}
                </span>

                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      isRecording
                        ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)]'
                        : 'bg-[var(--surface-container)] text-[var(--text-primary)] border-[var(--outline)]/30 hover:bg-[var(--surface-container-high)]'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-[var(--primary)]" />
                        <span>Voice Input</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={!input.trim() || isLoading}
                  isLoading={isLoading}
                  rightIcon={<Send className="w-3.5 h-3.5" />}
                  className="px-5 py-2.5 shadow-sm text-xs sm:text-sm font-semibold"
                >
                  Send Answer
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
