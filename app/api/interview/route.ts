import { NextRequest, NextResponse } from 'next/server';
import { InterviewApiRequestSchema } from '@/lib/schemas';
import { generateNextInterviewQuestion } from '@/lib/gemini';
import { getFallbackQuestion } from '@/lib/fallback-data';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const validation = InterviewApiRequestSchema.safeParse(rawBody);

    if (!validation.success) {
      console.warn('[API /api/interview] Schema validation warning, proceeding with raw payload:', validation.error.issues);
    }

    const config = rawBody.config || {
      role: 'Frontend Developer',
      experienceLevel: 'Junior (0-2 yrs)',
      interviewType: 'Behavioral (STAR)',
      difficulty: 'Medium',
    };
    const history = Array.isArray(rawBody.history) ? rawBody.history : [];
    const latestAnswer = rawBody.latestAnswer || rawBody.currentAnswer || '';
    const action = rawBody.action || (history.length === 0 ? 'start' : 'reply');

    if (action === 'start' && history.length === 0) {
      const initial = await generateNextInterviewQuestion(config, [], undefined);
      const questionText = initial.question || initial.reply || initial.content;
      return NextResponse.json({
        success: true,
        question: questionText,
        reply: questionText,
        content: questionText,
        isFollowUp: false,
        isComplete: false,
        questionNumber: 1,
        totalQuestions: 5,
      });
    }

    const response = await generateNextInterviewQuestion(config, history, latestAnswer);

    const questionText = response.question || response.reply || response.content;
    return NextResponse.json({
      success: true,
      question: questionText,
      reply: questionText,
      content: questionText,
      isFollowUp: response.isFollowUp,
      isComplete: response.isComplete || response.isCompleted,
      questionNumber: response.questionNumber,
      totalQuestions: response.totalQuestions,
      followUpReason: response.followUpReason,
    });
  } catch (error) {
    console.error('[API /api/interview] Uncaught error:', error);
    const fallback = getFallbackQuestion('Frontend Developer', 0, false);
    return NextResponse.json(
      {
        success: true,
        question: fallback.question || fallback.reply,
        content: fallback.question || fallback.reply,
        isFollowUp: false,
        isComplete: false,
        isFallback: true,
        notice: 'Served via ViewPilot local engine.',
      },
      { status: 200 }
    );
  }
}
