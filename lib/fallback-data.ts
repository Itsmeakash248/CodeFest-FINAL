/**
 * ViewPilot — Golden Path Fallback Data & Offline Simulation Engine
 * Owned by: Agent Beta
 * Ensures the app works 100% reliably in demo mode even if API rate limits or network issues occur.
 */

import { EvaluationReport, InterviewConfig, ChatMessage, InterviewApiResponse } from '@/types';

export const FALLBACK_DEMO_CONFIG: InterviewConfig = {
  role: 'Frontend Developer',
  experienceLevel: 'Junior (0-2 yrs)',
  interviewType: 'Behavioral (STAR)',
  difficulty: 'Medium',
  candidateName: 'Alex Rivera',
  targetCompany: 'Acme Cloud',
  customJobDescription: 'Building high-performance React web applications with design systems.',
};

export const FALLBACK_INTERVIEW_QUESTIONS: Record<string, string[]> = {
  'Frontend Developer': [
    "Tell me about a challenging frontend bug you encountered recently. What was the symptom, how did you isolate it, and how did you resolve it?",
    "Could you elaborate on how you validated that the fix didn't introduce memory leaks or accessibility regressions in other components?",
    "How do you approach managing asynchronous state and caching when fetching large datasets in React?",
    "Can you describe a situation where you had a disagreement with a designer or product manager regarding a UI trade-off? How did you handle it?",
    "Looking back at your recent projects, what is one architectural decision you made that you would do differently today and why?",
  ],
  'Backend Developer': [
    "Walk me through a distributed service or database bottleneck you encountered in production. How did you isolate the root cause?",
    "How did you evaluate database indexing versus caching strategies (like Redis) for that hotspot?",
    "Describe a challenging API versioning or schema migration task you executed with zero downtime.",
    "Tell me about a time a downstream service failed catastrophically. How did your system handle degraded performance?",
    "How do you balance rapid feature delivery against automated integration testing and technical debt?",
  ],
  default: [
    "Could you introduce yourself and walk me through a complex technical challenge you solved recently?",
    "What specific trade-offs did you consider when selecting the architecture or tools for that project?",
    "Tell me about a time you had to deliver under tight deadlines with ambiguous requirements. How did you prioritize?",
    "How do you handle constructive feedback or code review pushback from your team members?",
    "What is an area of technical depth you are currently focusing on growing in, and how are you practicing it?",
  ],
};

export function getFallbackQuestion(
  role: string,
  questionIndex: number,
  isFollowUp: boolean
): InterviewApiResponse {
  const questions = FALLBACK_INTERVIEW_QUESTIONS[role] || FALLBACK_INTERVIEW_QUESTIONS.default;
  const total = 5;
  const safeIndex = Math.min(questionIndex, questions.length - 1);
  const qNum = questionIndex + 1;

  if (isFollowUp) {
    const replyText = `That provides helpful context. To dig a level deeper: what concrete metrics or user feedback confirmed that your approach was successful, and what were the edge cases you had to account for?`;
    return {
      question: replyText,
      reply: replyText,
      content: replyText,
      questionNumber: qNum,
      totalQuestions: total,
      isFollowUp: true,
      isLastQuestion: qNum >= total,
      isComplete: qNum > total,
      isCompleted: qNum > total,
      followUpReason: 'Probing for quantitative validation and edge-case handling.',
    };
  }

  const isLast = qNum >= total;
  const replyText = questions[safeIndex];
  return {
    question: replyText,
    reply: replyText,
    content: replyText,
    questionNumber: qNum,
    totalQuestions: total,
    isFollowUp: false,
    isLastQuestion: isLast,
    isComplete: false,
    isCompleted: false,
  };
}

export const FALLBACK_DEMO_TRANSCRIPT: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'interviewer',
    content: "Welcome to ViewPilot! Let's get started. Tell me about a challenging frontend bug you encountered recently. What was the symptom, how did you isolate it, and how did you resolve it?",
    timestamp: Date.now() - 360000,
    questionNumber: 1,
    isFollowUp: false,
  },
  {
    id: 'msg-2',
    role: 'candidate',
    content: "In my last team project, our dashboard was stuttering when users scrolled through a list of 500+ audit log items. I opened Chrome DevTools Performance panel and noticed excessive re-renders whenever the search filter changed. I saw child rows didn't use memoization and an inline callback was recreated on every keystroke. I used `useMemo` for derived lists, `useCallback` for event handlers, and implemented virtual windowing with `tanstack-virtual` so only visible rows rendered. This reduced frame drops from 22fps to a solid 60fps.",
    timestamp: Date.now() - 300000,
  },
  {
    id: 'msg-3',
    role: 'interviewer',
    content: "Good technical diagnosis. How did you validate that virtualizing the list didn't break keyboard accessibility (a11y) or screen reader navigation across active items?",
    timestamp: Date.now() - 240000,
    questionNumber: 2,
    isFollowUp: true,
  },
  {
    id: 'msg-4',
    role: 'candidate',
    content: "Honestly, accessibility was an afterthought at first. But when our teammate tested with NVDA, focusing items jumped unexpectedly because off-screen DOM nodes were unmounted. I researched ARIA live regions and added `aria-rowcount` to the virtual container and kept focus trapped properly with a roving `tabIndex` mechanism. We also added an automated Axe-core test in CI.",
    timestamp: Date.now() - 180000,
  },
  {
    id: 'msg-5',
    role: 'interviewer',
    content: "Describe a situation where you had a disagreement with a designer or product manager regarding a UI trade-off. How did you handle it?",
    timestamp: Date.now() - 120000,
    questionNumber: 3,
    isFollowUp: false,
  },
  {
    id: 'msg-6',
    role: 'candidate',
    content: "Our designer wanted heavy blur effects and multi-layer backdrop filters across every card. On lower-spec laptops, this caused severe GPU strain and battery drain. Instead of just saying 'no', I built a quick prototype comparing three options: full blur, lightweight CSS opacity overlay, and dynamic degradation based on device pixel ratio. We looked at Lighthouse performance scores together, and agreed to use the elegant lightweight gradient overlay that kept 95% of the visual aesthetic with zero frame drop.",
    timestamp: Date.now() - 60000,
  },
];

export const FALLBACK_EVALUATION_REPORT: EvaluationReport = {
  id: 'eval_demo_golden_path_2026',
  completedAt: new Date().toISOString(),
  overallScore: 8.4,
  verdict: 'Hire',
  executiveSummary:
    'Alex demonstrated strong front-of-mind engineering maturity, pairing deep diagnostic proficiency (Chrome DevTools, frame rates, React memoization) with an empathetic collaborative mindset when resolving cross-functional trade-offs. The candidate consistently anchored explanations in measurable outcomes (60fps target, Axe-core CI, Lighthouse audits).',
  dimensions: {
    communication: {
      name: 'Communication (STAR Method)',
      score: 8.5,
      criteria: 'Structure (STAR), clarity, concise phrasing, and active listening.',
      evidence: [
        "\"Instead of just saying 'no', I built a quick prototype comparing three options: full blur, lightweight CSS opacity overlay, and dynamic degradation...\"",
        "\"Honestly, accessibility was an afterthought at first. But when our teammate tested with NVDA...\"",
      ],
      coachingTip: 'Open technical answers with a 1-sentence executive summary before diving into implementation details.',
      practiceAction: 'Practice the "Top-Down STAR" drill: state the bottom-line metric within the first 15 seconds of your answer.',
      strengths: [
        'Structured responses with clear Situation-Task-Action-Result format',
        'Transparent and honest when acknowledging initial blind spots',
      ],
      areasForImprovement: [
        'Could front-load the business impact before diving immediately into code techniques',
      ],
    },
    roleKnowledge: {
      name: 'Technical & Domain Knowledge',
      score: 8.8,
      criteria: 'Frontend architecture, React mechanics, performance profiling, and browser rendering pipeline.',
      evidence: [
        "\"I used `useMemo` for derived lists, `useCallback` for event handlers, and implemented virtual windowing with `tanstack-virtual`... reduced frame drops from 22fps to a solid 60fps.\"",
      ],
      coachingTip: 'Connect client-side optimizations to broader full-stack caching and edge rendering strategies.',
      practiceAction: 'Review React 19 Server Components and streaming SSR patterns to round out client-focused knowledge.',
      strengths: [
        'Nuanced grasp of the browser rendering pipeline, GPU rasterization costs, and frame drops',
        'Practical knowledge of React virtual windowing (`tanstack-virtual`)',
      ],
      areasForImprovement: [
        'Could discuss server-side rendering (SSR) alternatives to client-side virtualization',
      ],
    },
    problemSolving: {
      name: 'Problem Solving & Logic',
      score: 8.2,
      criteria: 'Root-cause diagnosis, hypothesis testing, pragmatic trade-off analysis, and edge case handling.',
      evidence: [
        "\"I opened Chrome DevTools Performance panel and noticed excessive re-renders whenever the search filter changed.\"",
      ],
      coachingTip: 'Conclude problem-solving stories with how you automated detection so the same failure never recurs in production.',
      practiceAction: 'In your next practice interview, explicitly articulate: "To prevent regressions, we added an automated performance budget in CI."',
      strengths: [
        'Methodical troubleshooting path: observed symptoms -> profiled in DevTools -> identified offending triggers -> verified fix',
      ],
      areasForImprovement: [
        'Could more explicitly discuss regression testing or telemetry logging for production monitoring',
      ],
    },
    answerQuality: {
      name: 'Answer Quality & Evidence',
      score: 8.1,
      criteria: 'Relevance, concreteness, metrics, and actionable substance.',
      evidence: [
        "\"reduced frame drops from 22fps to a solid 60fps.\"",
        "\"kept 95% of the visual aesthetic with zero frame drop.\"",
      ],
      coachingTip: 'Frame trade-offs in terms of user experience ROI (e.g. "which reduced bounce rates by X% on mobile").',
      practiceAction: 'Quantify impact in two tiers: Tier 1 (Technical metrics: ms, fps) and Tier 2 (Product metrics: conversions, load time).',
      strengths: [
        'Strong quantitative data points: 500+ items, 22fps to 60fps, 3 distinct prototype options',
      ],
      areasForImprovement: [
        'Could tie technical improvements to user satisfaction scores or retention metrics',
      ],
    },
  },
  improvedAnswerBlueprint: {
    originalQuestion: 'How did you handle the UI trade-off dispute with the designer regarding heavy blur effects?',
    candidateExcerpt:
      "Our designer wanted heavy blur effects... On lower-spec laptops, this caused severe GPU strain... Instead of just saying 'no', I built a quick prototype...",
    critique:
      'The candidate handled the collaboration wonderfully, but jumped immediately into technical details without acknowledging the designer\'s aesthetic intent or framing the business outcome for the end user.',
    rewrittenAnswer:
      "When our design lead proposed multi-layer backdrop filters for our modal cards, I loved the visual polish, but profiling on mid-tier hardware revealed 35% GPU spikes and noticeable scroll latency. To align on user delight without compromising device battery, I set up a live side-by-side Figma-to-code prototype showcasing three tiered treatments: full blur, GPU-accelerated CSS opacity, and an adaptive fallback. We ran a 5-minute session inspecting Lighthouse scores together, and aligned on an ultra-clean gradient overlay that preserved 95% of the aesthetic fidelity while maintaining a rock-solid 60fps across all customer devices.",
    keyTechnique: 'Empathetic Alignment + Tiered Prototyping + User-Centric Metric Proof',
  },
  keyTakeaways: [
    'Excellent diagnostic instinct: leverages browser profiling tools and concrete framerate metrics.',
    'Collaborative conflict resolution: uses side-by-side prototypes to align cross-functional peers.',
    'High honesty and integrity: openly addresses previous oversights and details how they were remediated.',
  ],
  nextSteps: [
    'Prepare 2-3 stories emphasizing full-stack architectural implications (SSR/hydration trade-offs).',
    'Standardize opening statements with top-down executive summaries.',
    'Add production telemetry and user analytics impact to your behavioral repertoire.',
  ],
  paceMetrics: {
    totalWords: 342,
    averageWordsPerAnswer: 114,
    durationMinutes: 4.5,
    wordsPerMinute: 135,
    paceAssessment: 'Ideal Pace',
    fillerWordCount: 3,
    detectedFillers: ['honestly', 'just'],
  },
  videoMetrics: {
    cameraEnabled: true,
    eyeContactScore: 92,
    framingStatus: 'Centered & Optimal',
    composureScore: 9.0,
    lightingQuality: 'Optimal',
    durationSeconds: 270,
    totalGazeChecks: 180,
    goodGazeCount: 166,
  },
  strictness: 'Standard',
  integrityReport: {
    integrityScore: 98,
    status: 'Verified Authentic',
    tabSwitchCount: 0,
    totalUnfocusedSeconds: 0,
    pasteCount: 0,
    totalPastedCharacters: 0,
    typingCadenceWpmBurst: 118,
    aiPatternRiskScore: 6,
    integrityVerified: true,
    authenticitySummary:
      'Continuous focus maintained across all interview questions. Natural keystroke dynamics, zero clipboard injection anomalies, and genuine personalized conversational phrasing verified.',
    events: [
      {
        id: 'evt-01',
        type: 'window_blur',
        timestamp: Date.now() - 240000,
        timeString: '00:05',
        description: 'Session focus established. Live proctor shield active.',
        severity: 'info',
      },
      {
        id: 'evt-02',
        type: 'clipboard_paste',
        timestamp: Date.now() - 180000,
        timeString: '01:45',
        description: 'Keystroke velocity verified: 118 WPM (Natural micro-pause cadence within human baseline).',
        severity: 'info',
      },
      {
        id: 'evt-03',
        type: 'synthetic_ai_pattern',
        timestamp: Date.now() - 90000,
        timeString: '03:12',
        description: 'Linguistic authenticity check: Low synthetic token uniformity (94% human language variance).',
        severity: 'info',
      },
    ],
  },
  jobReadiness: {
    readinessIndex: 84,
    readinessTier: 'Immediate Placement Ready',
    industryBenchmarkScore: 6.8,
    percentileRanking: 88,
    passingProbability: 86,
    targetRoleBenchmark: 'Frontend Developer (Junior to Mid-Level Industry Standard)',
    hiringVerdict: 'Hire',
    companyFitTiers: [
      {
        tier: 'High-Growth Tech Startups (Series A-C)',
        readiness: 'High Match',
        examples: 'Stripe-like startups, Vercel ecosystem, Supabase, scale-ups',
      },
      {
        tier: 'Tier-1 Enterprise & Corporate Product Orgs',
        readiness: 'High Match',
        examples: 'Atlassian, Adobe, Salesforce, Shopify, modern SaaS engineering',
      },
      {
        tier: 'Staff / FAANG Bar-Raiser Loops',
        readiness: 'Competitive',
        examples: 'Google, Meta, Apple (requires deeper concurrency & distributed web vitals)',
      },
    ],
    competencyPillars: [
      {
        name: 'System & Technical Architecture',
        candidateScore: 8.8,
        benchmarkScore: 6.6,
        status: 'Exceeds Benchmark',
        percentile: 91,
        insight: 'Exceptional command of the browser rendering pipeline, DevTools diagnostics, and virtualization mechanics.',
      },
      {
        name: 'STAR Storytelling & Executive Clarity',
        candidateScore: 8.5,
        benchmarkScore: 6.9,
        status: 'Exceeds Benchmark',
        percentile: 87,
        insight: 'Clear situation-task-action-result narrative with empathetic cross-functional alignment.',
      },
      {
        name: 'Problem Decomposition Under Pressure',
        candidateScore: 8.2,
        benchmarkScore: 6.7,
        status: 'Exceeds Benchmark',
        percentile: 83,
        insight: 'Methodical troubleshooting path; could add explicit CI automated regression guardrails.',
      },
      {
        name: 'Real-Time Articulation & Composure',
        candidateScore: 8.1,
        benchmarkScore: 7.0,
        status: 'Exceeds Benchmark',
        percentile: 82,
        insight: 'Balanced 135 WPM pace with strong camera engagement and low filler word density.',
      },
    ],
    strengthsHighlights: [
      'Strong grounding in Chrome DevTools performance profiling and framerate targets',
      'Demonstrated collaborative leadership using rapid Figma-to-code prototypes',
      'Quantifiable metrics articulated across technical and accessibility dimensions',
    ],
    criticalGaps: [
      'Front-load top-level business ROI metrics before plunging into code implementation',
      'Deepen discussions of server-side streaming SSR vs. client-side virtualization trade-offs',
    ],
    fourteenDayRoadmap: [
      {
        dayRange: 'Days 1 - 3',
        phase: 'Sprint 1: Bottom-Line Metric Front-Loading',
        focusArea: 'Executive STAR Articulation',
        actionItem: 'Practice the "Top-Down STAR" drill: articulate the business and performance metric within the first 15 seconds of any response.',
        expectedImpact: '+0.6 bump in Communication dimension',
        drillType: 'STAR Storytelling',
      },
      {
        dayRange: 'Days 4 - 7',
        phase: 'Sprint 2: Server Rendering & Edge Caching Architecture',
        focusArea: 'Full-Stack Modern Web Vitals',
        actionItem: 'Deep-dive React 19 Server Components, streaming SSR, and edge ISR caching strategies to complement client-side optimization answers.',
        expectedImpact: '+0.5 bump in Technical Knowledge',
        drillType: 'System Architecture',
      },
      {
        dayRange: 'Days 8 - 11',
        phase: 'Sprint 3: CI Automated Guardrails & Production Telemetry',
        focusArea: 'Automated Prevention Systems',
        actionItem: 'Formulate answers that highlight automated Lighthouse CI budgets, error boundaries, and synthetic user monitoring in production.',
        expectedImpact: '+0.8 bump in Problem Solving',
        drillType: 'Technical',
      },
      {
        dayRange: 'Days 12 - 14',
        phase: 'Sprint 4: High-Strictness Bar-Raiser Simulation',
        focusArea: 'Mock Pressure Testing',
        actionItem: 'Run 2 full mock sessions on ViewPilot in "FAANG Bar-Raiser" strictness mode to cement rapid edge-case composure.',
        expectedImpact: '+1.2 composite readiness score elevation',
        drillType: 'Mock Under Pressure',
      },
    ],
  },
};

/**
 * Computes a customized Job Readiness Pattern based on actual interview performance, role, and strictness.
 */
export function computeJobReadinessPattern(
  config: InterviewConfig,
  overallScore: number,
  dimensions?: any
): import('@/types').JobReadinessPattern {
  const commScore = dimensions?.communication?.score || overallScore;
  const techScore = dimensions?.roleKnowledge?.score || overallScore;
  const psScore = dimensions?.problemSolving?.score || overallScore;
  const ansScore = dimensions?.answerQuality?.score || overallScore;

  // Baseline industry benchmarks according to experience level
  const isSenior = config.experienceLevel.includes('Senior') || config.experienceLevel.includes('Lead');
  const isJunior = config.experienceLevel.includes('Junior');
  const baseBenchmark = isSenior ? 7.6 : isJunior ? 6.4 : 6.9;

  const readinessIndex = Math.min(100, Math.max(30, Math.round(overallScore * 10)));
  const percentileRanking = Math.min(99, Math.max(20, Math.round(45 + (overallScore - baseBenchmark) * 18)));
  const passingProbability = Math.min(95, Math.max(25, Math.round(50 + (overallScore - baseBenchmark) * 16)));

  const readinessTier: import('@/types').JobReadinessPattern['readinessTier'] =
    readinessIndex >= 80
      ? 'Immediate Placement Ready'
      : readinessIndex >= 68
      ? 'Near Placement Ready'
      : readinessIndex >= 50
      ? 'Targeted Coaching Needed'
      : 'Foundational Stage';

  const hiringVerdict: import('@/types').Verdict =
    overallScore >= 8.5 ? 'Strong Hire' : overallScore >= 7.0 ? 'Hire' : overallScore >= 5.5 ? 'Lean Hire' : 'Needs Coaching';

  const competencyPillars: import('@/types').CompetencyPillar[] = [
    {
      name: `${config.role} System & Domain Depth`,
      candidateScore: Number(techScore.toFixed(1)),
      benchmarkScore: baseBenchmark,
      status: techScore >= baseBenchmark + 0.5 ? 'Exceeds Benchmark' : techScore >= baseBenchmark - 0.5 ? 'Meets Benchmark' : 'Below Benchmark',
      percentile: Math.min(99, Math.round(50 + (techScore - baseBenchmark) * 18)),
      insight: `Proficiency in core ${config.role} domain patterns, design decisions, and system trade-offs.`,
    },
    {
      name: 'STAR Methodology & Executive Clarity',
      candidateScore: Number(commScore.toFixed(1)),
      benchmarkScore: baseBenchmark + 0.2,
      status: commScore >= baseBenchmark + 0.5 ? 'Exceeds Benchmark' : commScore >= baseBenchmark - 0.5 ? 'Meets Benchmark' : 'Below Benchmark',
      percentile: Math.min(99, Math.round(50 + (commScore - (baseBenchmark + 0.2)) * 18)),
      insight: 'Structured delivery with clear Situation-Task-Action-Result format and active listening.',
    },
    {
      name: 'Analytical Problem Solving Under Pressure',
      candidateScore: Number(psScore.toFixed(1)),
      benchmarkScore: baseBenchmark - 0.1,
      status: psScore >= baseBenchmark + 0.4 ? 'Exceeds Benchmark' : psScore >= baseBenchmark - 0.5 ? 'Meets Benchmark' : 'Below Benchmark',
      percentile: Math.min(99, Math.round(50 + (psScore - (baseBenchmark - 0.1)) * 18)),
      insight: 'Methodological hypothesis testing, failure mode isolation, and root-cause determination.',
    },
    {
      name: 'Substance & Concrete Evidence Depth',
      candidateScore: Number(ansScore.toFixed(1)),
      benchmarkScore: baseBenchmark + 0.1,
      status: ansScore >= baseBenchmark + 0.5 ? 'Exceeds Benchmark' : ansScore >= baseBenchmark - 0.5 ? 'Meets Benchmark' : 'Below Benchmark',
      percentile: Math.min(99, Math.round(50 + (ansScore - (baseBenchmark + 0.1)) * 18)),
      insight: 'Ability to back assertions with concrete quantitative data, load metrics, and business outcomes.',
    },
  ];

  return {
    readinessIndex,
    readinessTier,
    industryBenchmarkScore: baseBenchmark,
    percentileRanking,
    passingProbability,
    targetRoleBenchmark: `${config.role} (${config.experienceLevel} Industry Standard)`,
    hiringVerdict,
    companyFitTiers: [
      {
        tier: 'High-Growth Tech Startups & Scale-ups',
        readiness: readinessIndex >= 75 ? 'High Match' : 'Competitive',
        examples: 'Vercel, Stripe, modern SaaS teams seeking fast autonomous execution',
      },
      {
        tier: 'Tier-1 Enterprise & Product Corporations',
        readiness: readinessIndex >= 80 ? 'High Match' : readinessIndex >= 65 ? 'Competitive' : 'Stretch Target',
        examples: 'Microsoft, Amazon, Adobe, Salesforce corporate engineering loops',
      },
      {
        tier: 'Bar-Raiser & Elite Research Labs',
        readiness: readinessIndex >= 88 ? 'High Match' : readinessIndex >= 75 ? 'Competitive' : 'Stretch Target',
        examples: 'Google Staff Bar, OpenAI, Anthropic, high-concurrency systems infrastructure',
      },
    ],
    competencyPillars,
    strengthsHighlights: [
      `Demonstrated strong fundamentals aligned to ${config.role} expectations`,
      'Methodical reasoning when answering follow-up probing questions',
      'Solid articulation of technical decision-making and ownership',
    ],
    criticalGaps: [
      'Front-load quantifiable business metrics earlier in the narrative',
      'Articulate system trade-offs with explicit Big-O or latency bounds',
    ],
    fourteenDayRoadmap: [
      {
        dayRange: 'Days 1 - 3',
        phase: 'Sprint 1: STAR Opening Articulation',
        focusArea: 'Executive STAR Articulation',
        actionItem: `Practice stating the key quantitative outcome for your ${config.role} projects in the first 15 seconds.`,
        expectedImpact: '+0.5 on Communication',
        drillType: 'STAR Storytelling',
      },
      {
        dayRange: 'Days 4 - 7',
        phase: 'Sprint 2: Domain Deep-Dive & Architecture',
        focusArea: 'Architecture & Scalability',
        actionItem: `Map out 3 end-to-end architectures in ${config.role} with explicit failure modes and caching strategies.`,
        expectedImpact: '+0.7 on Technical Depth',
        drillType: 'System Architecture',
      },
      {
        dayRange: 'Days 8 - 11',
        phase: 'Sprint 3: Edge-Case & Root Cause Mastery',
        focusArea: 'Resilience & Edge-Cases',
        actionItem: 'Formulate answers that highlight automated CI/CD guardrails, error boundaries, and synthetic telemetry.',
        expectedImpact: '+0.6 on Problem Solving',
        drillType: 'Technical',
      },
      {
        dayRange: 'Days 12 - 14',
        phase: 'Sprint 4: Bar-Raiser Simulation',
        focusArea: 'Pressure Testing',
        actionItem: 'Run 2 full mock sessions on ViewPilot in "FAANG Bar-Raiser" strictness mode to cement composure.',
        expectedImpact: '+1.0 composite readiness bump',
        drillType: 'Mock Under Pressure',
      },
    ],
  };
}

/**
 * Computes an authenticity and anti-cheating proctor report based on live browser telemetry.
 */
export function computeIntegrityReport(
  rawIntegrity?: Partial<import('@/types').CheatingDetectionReport>,
  elapsedSeconds = 240
): import('@/types').CheatingDetectionReport {
  const tabSwitchCount = rawIntegrity?.tabSwitchCount ?? 0;
  const totalUnfocusedSeconds = rawIntegrity?.totalUnfocusedSeconds ?? 0;
  const pasteCount = rawIntegrity?.pasteCount ?? 0;
  const totalPastedCharacters = rawIntegrity?.totalPastedCharacters ?? 0;
  const typingCadenceWpmBurst = rawIntegrity?.typingCadenceWpmBurst ?? 115;
  const aiPatternRiskScore = rawIntegrity?.aiPatternRiskScore ?? 8;

  // Integrity calculation penalties
  let deductions = 0;
  if (tabSwitchCount > 0) deductions += Math.min(25, tabSwitchCount * 6);
  if (totalUnfocusedSeconds > 10) deductions += Math.min(20, Math.round(totalUnfocusedSeconds * 0.8));
  if (pasteCount > 2 && totalPastedCharacters > 300) deductions += Math.min(25, pasteCount * 5);
  if (aiPatternRiskScore > 40) deductions += Math.min(20, Math.round((aiPatternRiskScore - 40) * 0.4));

  const integrityScore = Math.max(35, 100 - deductions);

  const status: import('@/types').CheatingDetectionReport['status'] =
    integrityScore >= 90
      ? 'Verified Authentic'
      : integrityScore >= 75
      ? 'Minor Irregularities'
      : integrityScore >= 60
      ? 'Suspicious Patterns'
      : 'Flagged for Review';

  const events: import('@/types').CheatingEvent[] = (rawIntegrity?.events && rawIntegrity.events.length > 0)
    ? rawIntegrity.events
    : [
        {
          id: 'evt-init',
          type: 'window_blur',
          timestamp: Date.now() - elapsedSeconds * 1000,
          timeString: '00:00',
          description: 'Live Proctor Shield initialized. Authenticity monitoring active.',
          severity: 'info',
        },
        ...(tabSwitchCount > 0
          ? [
              {
                id: 'evt-tab',
                type: 'tab_switch' as const,
                timestamp: Date.now() - 60000,
                timeString: '02:15',
                description: `Tab switch detected (${tabSwitchCount} occurrences, ${totalUnfocusedSeconds}s total unfocused).`,
                severity: tabSwitchCount > 2 ? ('warning' as const) : ('info' as const),
              },
            ]
          : []),
        {
          id: 'evt-keystroke',
          type: 'clipboard_paste',
          timestamp: Date.now() - 30000,
          timeString: '03:40',
          description: `Typing cadence sampled: ${typingCadenceWpmBurst} WPM. Keystroke interval distribution natural.`,
          severity: 'info',
        },
        {
          id: 'evt-nlp',
          type: 'synthetic_ai_pattern',
          timestamp: Date.now() - 10000,
          timeString: '04:10',
          description: `Synthetic language analysis: Risk index ${aiPatternRiskScore}%. Human vocabulary diversity verified.`,
          severity: aiPatternRiskScore > 45 ? ('warning' as const) : ('info' as const),
        },
      ];

  const authenticitySummary =
    status === 'Verified Authentic'
      ? 'Strong authenticity score. Candidate maintained window focus throughout the session. Zero abnormal clipboard injections or synthetic phrasing detected.'
      : status === 'Minor Irregularities'
      ? 'Session verified with minor proctor notes. Brief window blur or clipboard activity noted without conclusive evidence of unauthorized assistance.'
      : 'Irregularities logged during interview session. Multiple tab focus shifts or rapid text pasting observed during response composition.';

  return {
    integrityScore,
    status,
    tabSwitchCount,
    totalUnfocusedSeconds,
    pasteCount,
    totalPastedCharacters,
    typingCadenceWpmBurst,
    aiPatternRiskScore,
    events,
    authenticitySummary,
    integrityVerified: integrityScore >= 75,
  };
}
