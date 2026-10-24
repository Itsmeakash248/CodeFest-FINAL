export type TargetRole =
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Engineer'
  | 'AI / ML Engineer'
  | 'Data Scientist'
  | 'Product Manager';

export type ExperienceLevel =
  | 'Junior (0-2 yrs)'
  | 'Mid-Level (3-5 yrs)'
  | 'Senior (5+ yrs)';

export type InterviewType =
  | 'Behavioral (STAR)'
  | 'Technical Deep-Dive'
  | 'System Design'
  | 'Problem Solving';

export type DifficultyLevel =
  | 'Easy'
  | 'Medium'
  | 'Hard';

export interface InterviewConfig {
  role: TargetRole | string;
  experienceLevel: ExperienceLevel | string;
  interviewType: InterviewType | string;
  difficulty: DifficultyLevel | string;
  resumeText?: string;
  candidateName?: string;
}

export interface ChatMessage {
  id: string;
  role: 'interviewer' | 'candidate' | 'system';
  content: string;
  timestamp: number;
  questionNumber?: number;
  isFollowUp?: boolean;
  isStreaming?: boolean;
}

export interface DimensionEvaluation {
  name: string;
  score: number; // 1-10
  criteria: string;
  evidence: string[]; // verbatim transcript quotes
  coachingTip: string;
  practiceAction: string;
}

export interface EvaluationReport {
  executiveSummary: string;
  overallScore: number; // 1-10
  dimensions: {
    communication: DimensionEvaluation;
    roleKnowledge: DimensionEvaluation;
    problemSolving: DimensionEvaluation;
    answerQuality: DimensionEvaluation;
  };
  improvedAnswerBlueprint: string;
  nextSteps: string[];
}

export interface InterviewState {
  config: InterviewConfig;
  messages: ChatMessage[];
  currentQuestionIndex: number;
  totalQuestions: number;
  isComplete: boolean;
  isLoading: boolean;
}
