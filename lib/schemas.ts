/**
 * ViewPilot — Zod Validation Schemas
 * Owned by: Agent Beta
 * Ensures strict runtime type checking for API routes and Gemini structured outputs.
 */

import { z } from 'zod';

export const JobRoleSchema = z.string().min(2, 'Job role is required');

export const ExperienceLevelSchema = z.string().min(1, 'Experience level is required');

export const InterviewTypeSchema = z.string().min(1, 'Interview type is required');

export const DifficultyLevelSchema = z.string().min(1, 'Difficulty level is required');

export const StrictnessLevelSchema = z.enum(['Lenient', 'Standard', 'Strict', 'Bar-Raiser']);

export const InterviewConfigSchema = z.object({
  role: JobRoleSchema,
  experienceLevel: ExperienceLevelSchema,
  interviewType: InterviewTypeSchema,
  difficulty: DifficultyLevelSchema,
  strictness: StrictnessLevelSchema.optional().default('Standard'),
  proctoringEnabled: z.boolean().optional().default(true),
  candidateName: z.string().optional(),
  targetCompany: z.string().optional(),
  resumeText: z.string().optional(),
  customJobDescription: z.string().optional(),
});

export const MessageRoleSchema = z.enum(['interviewer', 'candidate', 'system']);

export const ChatMessageSchema = z.object({
  id: z.string().optional().default(() => `msg_${Date.now()}`),
  role: MessageRoleSchema,
  content: z.string().min(1, 'Message content cannot be empty'),
  timestamp: z.number().optional().default(() => Date.now()),
  questionNumber: z.number().optional(),
  isFollowUp: z.boolean().optional(),
  isStreaming: z.boolean().optional(),
  wordCount: z.number().optional(),
});

export const InterviewApiRequestSchema = z.object({
  action: z.enum(['start', 'reply']).optional(),
  config: InterviewConfigSchema,
  history: z.array(ChatMessageSchema).default([]),
  latestAnswer: z.string().optional(),
  currentAnswer: z.string().optional(),
});

export const DimensionEvaluationSchema = z.object({
  name: z.string(),
  score: z.number().min(1).max(10).describe('Score from 1 to 10'),
  criteria: z.string().describe('Evaluation criteria applied'),
  evidence: z.array(z.string()).describe('Verbatim transcript quotes'),
  coachingTip: z.string().describe('Concrete coaching advice for candidate improvement'),
  practiceAction: z.string().describe('Immediate actionable drill or exercise'),
  strengths: z.array(z.string()).optional(),
  areasForImprovement: z.array(z.string()).optional(),
});

export const ImprovedAnswerBlueprintSchema = z.union([
  z.string(),
  z.object({
    originalQuestion: z.string().optional(),
    candidateExcerpt: z.string().optional(),
    critique: z.string().optional(),
    rewrittenAnswer: z.string().describe('Model answer demonstrating best practices'),
    keyTechnique: z.string().optional(),
  }),
]);

export const CheatingEventSchema = z.object({
  id: z.string(),
  type: z.enum(['tab_switch', 'window_blur', 'clipboard_paste', 'synthetic_ai_pattern', 'gaze_anomaly']),
  timestamp: z.number(),
  timeString: z.string(),
  description: z.string(),
  severity: z.enum(['info', 'warning', 'critical']),
  details: z.string().optional(),
});

export const CheatingDetectionReportSchema = z.object({
  integrityScore: z.number().min(0).max(100),
  status: z.enum(['Verified Authentic', 'Minor Irregularities', 'Suspicious Patterns', 'Flagged for Review']),
  tabSwitchCount: z.number(),
  totalUnfocusedSeconds: z.number(),
  pasteCount: z.number(),
  totalPastedCharacters: z.number(),
  typingCadenceWpmBurst: z.number(),
  aiPatternRiskScore: z.number(),
  events: z.array(CheatingEventSchema),
  authenticitySummary: z.string(),
  integrityVerified: z.boolean(),
});

export const CompetencyPillarSchema = z.object({
  name: z.string(),
  candidateScore: z.number(),
  benchmarkScore: z.number(),
  status: z.enum(['Exceeds Benchmark', 'Meets Benchmark', 'Below Benchmark']),
  percentile: z.number(),
  insight: z.string(),
});

export const ActionPlanMilestoneSchema = z.object({
  dayRange: z.string(),
  phase: z.string(),
  focusArea: z.string(),
  actionItem: z.string(),
  expectedImpact: z.string(),
  drillType: z.enum(['Technical', 'STAR Storytelling', 'System Architecture', 'Mock Under Pressure']),
});

export const CompanyFitTierSchema = z.object({
  tier: z.string(),
  readiness: z.enum(['High Match', 'Competitive', 'Stretch Target']),
  examples: z.string(),
});

export const JobReadinessPatternSchema = z.object({
  readinessIndex: z.number().min(0).max(100),
  readinessTier: z.enum(['Immediate Placement Ready', 'Near Placement Ready', 'Targeted Coaching Needed', 'Foundational Stage']),
  industryBenchmarkScore: z.number(),
  percentileRanking: z.number(),
  passingProbability: z.number(),
  targetRoleBenchmark: z.string(),
  hiringVerdict: z.enum(['Strong Hire', 'Hire', 'Lean Hire', 'Needs Coaching']),
  companyFitTiers: z.array(CompanyFitTierSchema),
  competencyPillars: z.array(CompetencyPillarSchema),
  strengthsHighlights: z.array(z.string()),
  criticalGaps: z.array(z.string()),
  fourteenDayRoadmap: z.array(ActionPlanMilestoneSchema),
});

export const EvaluationReportSchema = z.object({
  id: z.string().optional().default(() => `eval_${Date.now()}`),
  completedAt: z.string().optional().default(() => new Date().toISOString()),
  strictness: StrictnessLevelSchema.optional(),
  overallScore: z.number().min(1).max(10),
  verdict: z.enum(['Strong Hire', 'Hire', 'Lean Hire', 'Needs Coaching']).optional(),
  executiveSummary: z.string().min(20),
  dimensions: z.object({
    communication: DimensionEvaluationSchema,
    roleKnowledge: DimensionEvaluationSchema,
    problemSolving: DimensionEvaluationSchema,
    answerQuality: DimensionEvaluationSchema,
  }),
  improvedAnswerBlueprint: ImprovedAnswerBlueprintSchema,
  nextSteps: z.array(z.string()).min(1),
  keyTakeaways: z.array(z.string()).optional(),
  integrityReport: CheatingDetectionReportSchema.optional(),
  jobReadiness: JobReadinessPatternSchema.optional(),
});

export const EvaluateApiRequestSchema = z.object({
  config: InterviewConfigSchema,
  history: z.array(ChatMessageSchema).optional(),
  transcript: z.array(ChatMessageSchema).optional(),
  metrics: z.record(z.string(), z.unknown()).optional(),
  integrityData: z.record(z.string(), z.unknown()).optional(),
});
