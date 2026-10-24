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

export const InterviewConfigSchema = z.object({
  role: JobRoleSchema,
  experienceLevel: ExperienceLevelSchema,
  interviewType: InterviewTypeSchema,
  difficulty: DifficultyLevelSchema,
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

export const EvaluationReportSchema = z.object({
  id: z.string().optional().default(() => `eval_${Date.now()}`),
  completedAt: z.string().optional().default(() => new Date().toISOString()),
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
});

export const EvaluateApiRequestSchema = z.object({
  config: InterviewConfigSchema,
  history: z.array(ChatMessageSchema).optional(),
  transcript: z.array(ChatMessageSchema).optional(),
  metrics: z.record(z.string(), z.unknown()).optional(),
});
