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

export type StrictnessLevel =
  | 'Lenient'
  | 'Standard'
  | 'Strict'
  | 'Bar-Raiser';

export interface InterviewConfig {
  role: TargetRole;
  experienceLevel: ExperienceLevel;
  interviewType: InterviewType;
  difficulty: DifficultyLevel;
  strictness?: StrictnessLevel;
  proctoringEnabled?: boolean;
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

export interface VideoPresenceMetrics {
  cameraEnabled: boolean;
  eyeContactScore: number; // 0-100%
  framingStatus: 'Centered & Optimal' | 'Slightly Off-Center' | 'Sub-optimal Lighting' | 'Not Detected';
  composureScore: number; // 1-10
  lightingQuality: 'Optimal' | 'Dim' | 'Harsh';
  durationSeconds: number;
  totalGazeChecks?: number;
  goodGazeCount?: number;
}

export type Verdict =
  | 'Strong Hire'
  | 'Hire'
  | 'Lean Hire'
  | 'Needs Coaching';

// Cheating Detection & Integrity Telemetry Models
export interface CheatingEvent {
  id: string;
  type: 'tab_switch' | 'window_blur' | 'clipboard_paste' | 'synthetic_ai_pattern' | 'gaze_anomaly';
  timestamp: number;
  timeString: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  details?: string;
}

export interface CheatingDetectionReport {
  integrityScore: number; // 0 - 100
  status: 'Verified Authentic' | 'Minor Irregularities' | 'Suspicious Patterns' | 'Flagged for Review';
  tabSwitchCount: number;
  totalUnfocusedSeconds: number;
  pasteCount: number;
  totalPastedCharacters: number;
  typingCadenceWpmBurst: number;
  aiPatternRiskScore: number; // 0 - 100%
  events: CheatingEvent[];
  authenticitySummary: string;
  integrityVerified: boolean;
}

// Job Readiness Patterns & Benchmarking Models
export interface CompetencyPillar {
  name: string;
  candidateScore: number; // 1.0 - 10.0
  benchmarkScore: number; // 1.0 - 10.0
  status: 'Exceeds Benchmark' | 'Meets Benchmark' | 'Below Benchmark';
  percentile: number; // e.g. 85th percentile
  insight: string;
}

export interface ActionPlanMilestone {
  dayRange: string;
  phase: string;
  focusArea: string;
  actionItem: string;
  expectedImpact: string;
  drillType: 'Technical' | 'STAR Storytelling' | 'System Architecture' | 'Mock Under Pressure';
}

export interface CompanyFitTier {
  tier: string;
  readiness: 'High Match' | 'Competitive' | 'Stretch Target';
  examples: string;
}

export interface JobReadinessPattern {
  readinessIndex: number; // 0 - 100
  readinessTier: 'Immediate Placement Ready' | 'Near Placement Ready' | 'Targeted Coaching Needed' | 'Foundational Stage';
  industryBenchmarkScore: number; // e.g. 6.8
  percentileRanking: number; // e.g. 82
  passingProbability: number; // e.g. 78%
  targetRoleBenchmark: string;
  hiringVerdict: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'Needs Coaching';
  companyFitTiers: CompanyFitTier[];
  competencyPillars: CompetencyPillar[];
  strengthsHighlights: string[];
  criticalGaps: string[];
  fourteenDayRoadmap: ActionPlanMilestone[];
}

export interface EvaluationReport {
  id?: string;
  completedAt?: string;
  strictness?: StrictnessLevel;
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
  videoMetrics?: VideoPresenceMetrics;
  integrityReport?: CheatingDetectionReport;
  jobReadiness?: JobReadinessPattern;
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
  videoMetrics?: Partial<VideoPresenceMetrics>;
  integrityData?: Partial<CheatingDetectionReport>;
}

export interface SessionHistoryItem {
  id: string;
  completedAt: string;
  timestamp: number;
  role: string;
  experienceLevel: string;
  interviewType: string;
  difficulty: string;
  strictness?: StrictnessLevel;
  overallScore: number;
  verdict: Verdict;
  dimensions: {
    communication: number;
    roleKnowledge: number;
    problemSolving: number;
    answerQuality: number;
  };
  metrics?: Partial<PaceMetrics>;
  videoMetrics?: Partial<VideoPresenceMetrics>;
  integrityScore?: number;
  readinessIndex?: number;
  summary: string;
  report?: EvaluationReport;
}

export interface EvaluateApiResponse {
  success: boolean;
  report: EvaluationReport;
  isFallback?: boolean;
  notice?: string;
}

