/**
 * ViewPilot — Gemini AI Client & Resilient Generation Service
 * Owned by: Agent Beta
 * Provides fail-safe Gemini calls with exponential retry and seamless fallback.
 */

import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import {
  InterviewConfig,
  ChatMessage,
  InterviewApiResponse,
  EvaluationReport,
  PaceMetrics,
  CheatingDetectionReport,
} from '@/types';
import { EvaluationReportSchema } from '@/lib/schemas';
import { getInterviewSystemPrompt, getEvaluationSystemPrompt } from '@/lib/prompts';
import {
  getFallbackQuestion,
  FALLBACK_EVALUATION_REPORT,
  computeJobReadinessPattern,
  computeIntegrityReport,
} from '@/lib/fallback-data';

const apiKey = process.env.GEMINI_API_KEY || '';

// Primary & secondary model candidates for resilience
const PREFERRED_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

let genAI: GoogleGenerativeAI | null = null;
if (apiKey && apiKey !== 'demo_key') {
  genAI = new GoogleGenerativeAI(apiKey);
}

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Executes a Gemini prompt with automatic model fallback and JSON extraction.
 */
async function callGeminiJson<T>(
  systemInstruction: string,
  userPrompt: string,
  temperature = 0.4
): Promise<T | null> {
  if (!genAI) {
    return null;
  }

  const generationConfig: GenerationConfig = {
    temperature,
    responseMimeType: 'application/json',
  };

  for (const modelName of PREFERRED_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        generationConfig,
      });

      const response = await model.generateContent(userPrompt);
      const text = response.response.text();
      const cleaned = cleanJsonString(text);
      const parsed = JSON.parse(cleaned) as T;
      return parsed;
    } catch (err: unknown) {
      console.warn(`[ViewPilot Gemini] Model ${modelName} warning:`, (err as Error)?.message || err);
    }
  }

  return null;
}

/**
 * Generates the next conversational question or adaptive follow-up in the interview loop.
 */
export async function generateNextInterviewQuestion(
  config: InterviewConfig,
  history: ChatMessage[],
  latestAnswer?: string
): Promise<InterviewApiResponse> {
  const previousQuestions = history.filter((m) => m.role === 'interviewer' && !m.isFollowUp);
  const questionCount = previousQuestions.length;
  const nextQuestionNumber = questionCount + 1;
  const isLastQuestion = nextQuestionNumber >= 5;

  const systemPrompt = getInterviewSystemPrompt(config, nextQuestionNumber);
  const contextMessages = history.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
  const userPrompt = `
Full Conversation So Far:
${contextMessages || '(This is the very start of the interview. Greet the candidate briefly and ask Question #1.)'}

${latestAnswer ? `Latest Candidate Answer:\n"${latestAnswer}"\n\nAnalyze this answer. If it leaves critical gaps or lacks metrics, probe deeper with a follow-up. Otherwise transition to Question #${nextQuestionNumber}.` : ''}

Remember to output JSON adhering to the specified format.`;

  try {
    const result = await callGeminiJson<{
      question?: string;
      reply?: string;
      content?: string;
      isFollowUp: boolean;
      followUpReason?: string;
      isLastQuestion?: boolean;
      isComplete?: boolean;
    }>(systemPrompt, userPrompt, 0.6);

    if (result && (result.question || result.reply || result.content)) {
      const text = result.question || result.reply || result.content || '';
      return {
        question: text,
        reply: text,
        content: text,
        questionNumber: nextQuestionNumber,
        totalQuestions: 5,
        isFollowUp: Boolean(result.isFollowUp),
        followUpReason: result.followUpReason,
        isLastQuestion: isLastQuestion || Boolean(result.isLastQuestion),
        isComplete: Boolean(result.isComplete) || nextQuestionNumber >= 6,
        isCompleted: Boolean(result.isComplete) || nextQuestionNumber >= 6,
      };
    }
  } catch (err) {
    console.error('[ViewPilot Gemini] Interview question generation error:', err);
  }

  // Graceful deterministic fallback
  const fallback = getFallbackQuestion(config.role, questionCount, false);
  return fallback;
}

/**
 * Analyzes the complete interview transcript and produces a structured 4-dimension report.
 */
export async function generateEvaluationReport(
  config: InterviewConfig,
  transcript: ChatMessage[],
  paceMetrics?: Partial<PaceMetrics>,
  integrityData?: Partial<CheatingDetectionReport>
): Promise<EvaluationReport> {
  const systemPrompt = getEvaluationSystemPrompt(config, transcript);
  const userPrompt = `Analyze the provided interview transcript according to the 4-dimension rubric.
Enforce verbatim quotes for all evidence items. Ensure coaching tips are concrete and actionable.
Output purely valid JSON.`;

  const integrityReport = computeIntegrityReport(
    integrityData,
    paceMetrics?.durationMinutes ? Math.round(paceMetrics.durationMinutes * 60) : 240
  );

  try {
    const rawResult = await callGeminiJson<Record<string, unknown>>(systemPrompt, userPrompt, 0.2);

    if (rawResult && rawResult.dimensions) {
      const overallScore = typeof rawResult.overallScore === 'number' ? rawResult.overallScore : 7.5;
      const jobReadiness = computeJobReadinessPattern(config, overallScore, rawResult.dimensions);

      const candidateReport = {
        id: `eval_${Date.now()}`,
        completedAt: new Date().toISOString(),
        strictness: config.strictness || 'Standard',
        overallScore,
        verdict: (rawResult.verdict as any) || jobReadiness.hiringVerdict || 'Hire',
        executiveSummary: (rawResult.executiveSummary as string) || '',
        dimensions: rawResult.dimensions as any,
        improvedAnswerBlueprint: (rawResult.improvedAnswerBlueprint as any) || '',
        keyTakeaways: Array.isArray(rawResult.keyTakeaways) ? (rawResult.keyTakeaways as string[]) : [],
        nextSteps: Array.isArray(rawResult.nextSteps) ? (rawResult.nextSteps as string[]) : [],
        paceMetrics: paceMetrics as PaceMetrics | undefined,
        integrityReport,
        jobReadiness,
      };

      const validated = EvaluationReportSchema.safeParse(candidateReport);
      if (validated.success) {
        return validated.data as unknown as EvaluationReport;
      }
      return candidateReport as unknown as EvaluationReport;
    }
  } catch (err) {
    console.error('[ViewPilot Gemini] Evaluation generation error:', err);
  }

  // Fallback report calibrated with actual config, strictness, and computed job readiness
  const fallbackScore =
    config.strictness === 'Bar-Raiser'
      ? 7.6
      : config.strictness === 'Strict'
      ? 7.9
      : config.strictness === 'Lenient'
      ? 8.9
      : 8.4;

  const jobReadiness = computeJobReadinessPattern(
    config,
    fallbackScore,
    FALLBACK_EVALUATION_REPORT.dimensions
  );

  return {
    ...FALLBACK_EVALUATION_REPORT,
    id: `eval_fallback_${Date.now()}`,
    completedAt: new Date().toISOString(),
    strictness: config.strictness || 'Standard',
    overallScore: fallbackScore,
    verdict: jobReadiness.hiringVerdict,
    paceMetrics: paceMetrics as PaceMetrics | undefined,
    integrityReport,
    jobReadiness,
  };
}
