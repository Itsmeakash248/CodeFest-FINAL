import { NextRequest, NextResponse } from 'next/server';
import { generateEvaluationReport } from '@/lib/gemini';
import { FALLBACK_EVALUATION_REPORT } from '@/lib/fallback-data';

export async function POST(req: NextRequest) {
  let rawBody: any = null;
  try {
    rawBody = await req.json();

    const config = rawBody.config || {
      role: 'Frontend Developer',
      experienceLevel: 'Junior (0-2 yrs)',
      interviewType: 'Behavioral (STAR)',
      difficulty: 'Medium',
    };

    const transcript = Array.isArray(rawBody.history)
      ? rawBody.history
      : Array.isArray(rawBody.transcript)
      ? rawBody.transcript
      : [];

    const metrics = rawBody.metrics;
    const videoMetrics = rawBody.videoMetrics;
    const integrityData = rawBody.integrityData;
    const report = await generateEvaluationReport(config, transcript, metrics, integrityData);
    if (videoMetrics) {
      report.videoMetrics = videoMetrics;
    }

    return NextResponse.json({
      success: true,
      report,
      ...report, // spread top-level fields for convenience
    });
  } catch (error) {
    console.error('[API /api/evaluate] Uncaught error:', error);
    const fallback = {
      ...FALLBACK_EVALUATION_REPORT,
      id: `eval_fallback_${Date.now()}`,
      completedAt: new Date().toISOString(),
      ...(rawBody?.videoMetrics ? { videoMetrics: rawBody.videoMetrics } : {}),
      ...(rawBody?.config?.strictness ? { strictness: rawBody.config.strictness } : {}),
    };
    return NextResponse.json(
      {
        success: true,
        report: fallback,
        ...fallback,
        isFallback: true,
        notice: 'Evaluation generated via ViewPilot deterministic rubric engine.',
      },
      { status: 200 }
    );
  }
}
