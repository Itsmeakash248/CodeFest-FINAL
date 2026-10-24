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
};
