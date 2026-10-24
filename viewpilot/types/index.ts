/**
 * ViewPilot — Unified Shared TypeScript Interfaces & Domain Models
 * Co-owned & Harmonized: Agent Alpha + Agent Beta
 */

export type TargetRole =
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Engineer'
  | 'AI / ML Engineer'
  | 'Data Scientist'
  | 'Product Manager'
  | string;

export type JobRole = TargetRole;

export type ExperienceLevel =
  | 'Junior (0-2 yrs)'
  | 'Mid-Level (3-5 yrs)'
  | 'Senior (5+ yrs)'
  | 'Junior'
  | 'Mid-Level'
  | 'Senior'
  | 'Lead'
  | string;

export type InterviewType =
  | 'Behavioral (STAR)'
  | 'Technical Deep-Dive'
  | 'System Design'
  | 'Problem Solving'
  | 'Cultural Fit'
  | string;

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | string;

export interface InterviewConfig {
  role: TargetRole;
  experienceLevel: ExperienceLevel;
  interviewType: InterviewType;
  difficulty: DifficultyLevel;
  resumeText?: string;
  candidateName?: string;
  targetCompany?: string;
  customJobDescription?: string;
}

export type MessageRole = 'interviewer' | 'candidate' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  questionNumber?: number;
  isFollowUp?: boolean;
  isStreaming?: boolean;
  wordCount?: number;
}

export interface DimensionEvaluation {
  name: string;
  score: number; // 1-10
  criteria: string;
  evidence: string[]; // verbatim transcript quotes
  coachingTip: string;
  practiceAction: string;
  strengths?: string[];
  areasForImprovement?: string[];
}

export type DimensionKey =
  | 'communication'
  | 'roleKnowledge'
  | 'problemSolving'
  | 'answerQuality';

export interface ImprovedAnswerBlueprint {
  originalQuestion?: string;
  candidateExcerpt?: string;
  critique?: string;
  rewrittenAnswer: string;
  keyTechnique?: string;
}

export interface PaceMetrics {
  totalWords: number;
  averageWordsPerAnswer: number;
  durationMinutes: number;
  wordsPerMinute: number;
  paceAssessment: 'Too Fast' | 'Ideal Pace' | 'Too Slow';
  fillerWordCount?: number;
  detectedFillers?: string[];
}

export type Verdict =
  | 'Strong Hire'
  | 'Hire'
  | 'Lean Hire'
  | 'Needs Coaching';

export interface EvaluationReport {
  id?: string;
  completedAt?: string;
  executiveSummary: string;
  overallScore: number; // 1-10
  verdict?: Verdict;
  dimensions: {
    communication: DimensionEvaluation;
    roleKnowledge: DimensionEvaluation;
    problemSolving: DimensionEvaluation;
    answerQuality: DimensionEvaluation;
  };
  improvedAnswerBlueprint: string | ImprovedAnswerBlueprint;
  nextSteps: string[];
  keyTakeaways?: string[];
  paceMetrics?: PaceMetrics;
}

export interface InterviewState {
  config: InterviewConfig;
  messages: ChatMessage[];
  currentQuestionIndex: number;
  totalQuestions: number;
  isComplete: boolean;
  isLoading: boolean;
}

export interface InterviewApiRequest {
  action?: 'start' | 'reply';
  config: InterviewConfig;
  history: ChatMessage[];
  latestAnswer?: string;
  currentAnswer?: string;
}

export interface InterviewApiResponse {
  question?: string;
  reply?: string;
  content?: string;
  questionNumber: number;
  totalQuestions: number;
  isFollowUp: boolean;
  isLastQuestion: boolean;
  isComplete?: boolean;
  isCompleted?: boolean;
  followUpReason?: string;
}

export interface EvaluateApiRequest {
  config: InterviewConfig;
  history?: ChatMessage[];
  transcript?: ChatMessage[];
  metrics?: Partial<PaceMetrics>;
}

export interface EvaluateApiResponse {
  success: boolean;
  report: EvaluationReport;
  isFallback?: boolean;
  notice?: string;
}
