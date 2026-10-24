'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Server,
  Layers,
  Cpu,
  Database,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Flame,
  Shield,
  FileText,
  Upload,
  FileUp,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TextField } from '@/components/ui/TextField';
import { useInterview } from '@/lib/interview-context';
import {
  TargetRole,
  ExperienceLevel,
  InterviewType,
  DifficultyLevel,
} from '@/types';

const ROLES: { id: TargetRole; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'Frontend Developer',
    label: 'Frontend Developer',
    desc: 'React, Next.js, Web Vitals, CSS architecture, accessibility',
    icon: <Code2 className="w-5 h-5 text-[var(--primary)]" />,
  },
  {
    id: 'Backend Developer',
    label: 'Backend Developer',
    desc: 'Node.js, APIs, distributed databases, concurrency, caching',
    icon: <Server className="w-5 h-5 text-[var(--secondary)]" />,
  },
  {
    id: 'Full Stack Engineer',
    label: 'Full Stack Engineer',
    desc: 'End-to-end web architecture, DB schema to modern UI state',
    icon: <Layers className="w-5 h-5 text-[var(--primary)]" />,
  },
  {
    id: 'AI / ML Engineer',
    label: 'AI / ML Engineer',
    desc: 'LLMs, prompt engineering, RAG, PyTorch, model deployment',
    icon: <Cpu className="w-5 h-5 text-[var(--tertiary)]" />,
  },
  {
    id: 'Data Scientist',
    label: 'Data Scientist',
    desc: 'Statistical modeling, experiment design, SQL, analytics pipelines',
    icon: <Database className="w-5 h-5 text-[var(--secondary)]" />,
  },
  {
    id: 'Product Manager',
    label: 'Product Manager',
    desc: 'User empathy, metrics, prioritization, cross-functional leadership',
    icon: <Briefcase className="w-5 h-5 text-[var(--tertiary)]" />,
  },
];

const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string; desc: string }[] = [
  {
    id: 'Junior (0-2 yrs)',
    label: 'Junior (0-2 yrs)',
    desc: 'Focus on computer science fundamentals, fast learning, and execution.',
  },
  {
    id: 'Mid-Level (3-5 yrs)',
    label: 'Mid-Level (3-5 yrs)',
    desc: 'Focus on end-to-end project ownership, trade-offs, and mentoring.',
  },
  {
    id: 'Senior (5+ yrs)',
    label: 'Senior (5+ yrs)',
    desc: 'Focus on high-level architecture, team scaling, and ambiguous problems.',
  },
];

const INTERVIEW_TYPES: { id: InterviewType; label: string; desc: string }[] = [
  {
    id: 'Behavioral (STAR)',
    label: 'Behavioral (STAR)',
    desc: 'Assess communication, teamwork, conflict resolution, and leadership.',
  },
  {
    id: 'Technical Deep-Dive',
    label: 'Technical Deep-Dive',
    desc: 'Evaluate language internals, framework performance, and clean code.',
  },
  {
    id: 'System Design',
    label: 'System Design',
    desc: 'Architect scalable systems, fault tolerance, caching, and data flow.',
  },
  {
    id: 'Problem Solving',
    label: 'Problem Solving',
    desc: 'Structured analytical thinking, edge-case breakdown, and trade-offs.',
  },
];

const DIFFICULTIES: {
  id: DifficultyLevel;
  label: string;
  desc: string;
  badge: string;
}[] = [
  {
    id: 'Easy',
    label: 'Easy',
    desc: 'Supportive pacing, guided questions, and gentle follow-ups.',
    badge: 'Beginner Friendly',
  },
  {
    id: 'Medium',
    label: 'Medium',
    desc: 'Realistic standard tech company bar with focused follow-ups.',
    badge: 'Industry Standard',
  },
  {
    id: 'Hard',
    label: 'Hard',
    desc: 'Rigorous scrutiny, rapid counter-questions, and deep probing.',
    badge: 'Staff / FAANG Bar',
  },
];

export function OnboardingWizard() {
  const router = useRouter();
  const { config, setConfig, resetSession } = useInterview();

  const [step, setStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<TargetRole>(
    (config.role as TargetRole) || 'Frontend Developer'
  );
  const [selectedExp, setSelectedExp] = useState<ExperienceLevel>(
    (config.experienceLevel as ExperienceLevel) || 'Junior (0-2 yrs)'
  );
  const [selectedType, setSelectedType] = useState<InterviewType>(
    (config.interviewType as InterviewType) || 'Behavioral (STAR)'
  );
  const [selectedDiff, setSelectedDiff] = useState<DifficultyLevel>(
    (config.difficulty as DifficultyLevel) || 'Medium'
  );
  const [candidateName, setCandidateName] = useState<string>(
    config.candidateName || 'Alex Chen'
  );
  const [resumeText, setResumeText] = useState<string>(config.resumeText || '');
  const [showResumeInput, setShowResumeInput] = useState<boolean>(false);
  const [isParsingResume, setIsParsingResume] = useState<boolean>(false);
  const [parsedFileName, setParsedFileName] = useState<string>('');
  const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
  const [parseStatusMsg, setParseStatusMsg] = useState<string>('');

  const totalSteps = 4;

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);
    setParsedFileName(file.name);
    setParseStatusMsg('Extracting technical background & project history...');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to parse resume');
      }

      const data = await res.json();
      if (data.rawText) {
        setResumeText(data.rawText);
        setDetectedSkills(data.skills || []);
        setParseStatusMsg(`Successfully extracted ${data.skills?.length || 0} core competencies from ${file.name}`);
        setShowResumeInput(true);
      }
    } catch (err) {
      console.warn('Resume parse warning, falling back to basic extraction:', err);
      setParseStatusMsg('File uploaded. You can review or edit the summary text below.');
      setShowResumeInput(true);
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleStartInterview();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleStartInterview = () => {
    resetSession();
    setConfig({
      role: selectedRole,
      experienceLevel: selectedExp,
      interviewType: selectedType,
      difficulty: selectedDiff,
      candidateName,
      resumeText,
    });
    router.push('/interview');
  };

  const handleQuickDemoFill = () => {
    setSelectedRole('Frontend Developer');
    setSelectedExp('Junior (0-2 yrs)');
    setSelectedType('Behavioral (STAR)');
    setSelectedDiff('Medium');
    setCandidateName('Alex (Demo Candidate)');
    setStep(4);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header and Progress */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              Step {step} of {totalSteps}
            </span>
            <h1 className="font-serif-hero text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {step === 1 && 'Select Target Role'}
              {step === 2 && 'Experience & Background'}
              {step === 3 && 'Choose Interview Focus'}
              {step === 4 && 'Pacing & Difficulty Calibration'}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--primary-container)] text-[var(--on-primary-container)] hover:brightness-95 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Fill Golden Demo Preset</span>
          </button>
        </div>

        <ProgressBar value={step} max={totalSteps} variant="primary" size="md" />
      </div>

      {/* Main Wizard Card */}
      <Card variant="elevated" className="p-6 sm:p-8 min-h-[440px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {/* STEP 1: TARGET ROLE */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <p className="text-sm text-[var(--text-secondary)]">
                Which specific role are you preparing to interview for? ViewPilot will adapt its
                technical depth and scenario framing accordingly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {ROLES.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-4 rounded-[22px] border cursor-pointer transition-all duration-200 flex items-start gap-3.5 select-none ${
                        isSelected
                          ? 'bg-[var(--primary-container)]/70 border-[var(--primary)] shadow-sm'
                          : 'bg-[var(--surface-container)]/50 border-[var(--outline)]/40 hover:bg-[var(--surface-container)]'
                      }`}
                    >
                      <div className="p-2 rounded-full bg-[var(--surface)] shrink-0 border border-[var(--outline)]/30">
                        {r.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[var(--text-primary)]">
                            {r.label}
                          </h4>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                          {r.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: EXPERIENCE LEVEL & NAME */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Candidate Profile
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Enter your name and select seniority tier to calibrate interview expectations.
                </p>
              </div>

              <div className="space-y-4">
                <TextField
                  label="Candidate Name"
                  placeholder="e.g., Alex Chen"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />

                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] pl-2">
                    Seniority Level
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {EXPERIENCE_LEVELS.map((exp) => {
                      const isSelected = selectedExp === exp.id;
                      return (
                        <div
                          key={exp.id}
                          onClick={() => setSelectedExp(exp.id)}
                          className={`p-4 rounded-[20px] border cursor-pointer transition-all duration-200 flex items-center justify-between select-none ${
                            isSelected
                              ? 'bg-[var(--primary-container)]/70 border-[var(--primary)] shadow-sm'
                              : 'bg-[var(--surface-container)]/50 border-[var(--outline)]/40 hover:bg-[var(--surface-container)]'
                          }`}
                        >
                          <div>
                            <h4 className="text-sm font-bold text-[var(--text-primary)]">
                              {exp.label}
                            </h4>
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                              {exp.desc}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0 ml-3" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Resume Expansion */}
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowResumeInput(!showResumeInput)}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--primary)] hover:underline"
                    >
                      <FileUp className="w-4 h-4" />
                      <span>
                        {showResumeInput
                          ? 'Hide Resume Personalization'
                          : '+ Upload Resume / Custom Project Context (P1 Bonus)'}
                      </span>
                    </button>

                    {resumeText && (
                      <span className="text-[11px] font-semibold text-[var(--success)] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resume Loaded</span>
                      </span>
                    )}
                  </div>

                  {showResumeInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 space-y-3 p-4 rounded-[22px] bg-[var(--surface-container)]/50 border border-[var(--outline)]/30"
                    >
                      {/* File Upload Zone */}
                      <div className="relative border-2 border-dashed border-[var(--outline)]/50 hover:border-[var(--primary)] rounded-[18px] p-4 text-center transition-colors bg-[var(--surface)]">
                        <input
                          type="file"
                          id="resume-upload"
                          accept=".pdf,.txt,.md,.doc,.docx"
                          onChange={handleResumeFileUpload}
                          disabled={isParsingResume}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                          {isParsingResume ? (
                            <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin" />
                          ) : (
                            <Upload className="w-6 h-6 text-[var(--primary)]" />
                          )}
                          <div className="text-xs font-semibold text-[var(--text-primary)]">
                            {isParsingResume
                              ? 'Analyzing resume with Gemini parser...'
                              : parsedFileName
                              ? `Uploaded: ${parsedFileName} (Click or drop to replace)`
                              : 'Click or drag & drop candidate resume (.pdf, .txt)'}
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            Automatically identifies skills, past projects, and architecture decisions.
                          </p>
                        </div>
                      </div>

                      {parseStatusMsg && (
                        <p className="text-[11px] font-medium text-[var(--text-primary)] pl-1">
                          {parseStatusMsg}
                        </p>
                      )}

                      {/* Detected Skills Pill Grid */}
                      {detectedSkills.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Detected Competencies
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {detectedSkills.map((sk) => (
                              <Chip key={sk} selected className="text-xs px-3 py-1">
                                {sk}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[var(--text-secondary)] block">
                          Resume Context Preview (Sent to Interviewer AI)
                        </label>
                        <textarea
                          rows={3}
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          placeholder="Paste summary points from your resume or key projects here to tailor questions..."
                          className="w-full bg-[var(--surface)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 text-xs rounded-[16px] border border-[var(--outline)]/50 p-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: INTERVIEW TYPE */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <p className="text-sm text-[var(--text-secondary)]">
                Choose the interview style you want to practice. The AI interviewer will tailor its rubric and scoring criteria to this format.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {INTERVIEW_TYPES.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-[22px] border cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 select-none ${
                        isSelected
                          ? 'bg-[var(--primary-container)]/70 border-[var(--primary)] shadow-sm'
                          : 'bg-[var(--surface-container)]/50 border-[var(--outline)]/40 hover:bg-[var(--surface-container)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">
                          {type.label}
                        </h4>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {type.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: DIFFICULTY & REVIEW */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Calibrate Difficulty
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Higher difficulty incorporates rapid follow-up probing, metric scrutiny, and edge-case testing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DIFFICULTIES.map((diff) => {
                  const isSelected = selectedDiff === diff.id;
                  return (
                    <div
                      key={diff.id}
                      onClick={() => setSelectedDiff(diff.id)}
                      className={`p-4 rounded-[22px] border cursor-pointer transition-all duration-200 flex flex-col justify-between gap-2 select-none ${
                        isSelected
                          ? 'bg-[var(--primary-container)]/70 border-[var(--primary)] shadow-sm'
                          : 'bg-[var(--surface-container)]/50 border-[var(--outline)]/40 hover:bg-[var(--surface-container)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--outline)]/30">
                          {diff.badge}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                        )}
                      </div>
                      <h4 className="text-base font-bold text-[var(--text-primary)] mt-1">
                        {diff.label}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {diff.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Summary Pill Bar */}
              <div className="p-4 rounded-[20px] bg-[var(--surface-container)] border border-[var(--outline)]/30 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                  Configured Session Summary
                </span>
                <div className="flex flex-wrap gap-2">
                  <Chip selected>{selectedRole}</Chip>
                  <Chip selected>{selectedExp}</Chip>
                  <Chip selected>{selectedType}</Chip>
                  <Chip selected>{selectedDiff} Bar</Chip>
                  {candidateName && <Chip>{candidateName}</Chip>}
                  {resumeText && <Chip selected>Resume Tailored</Chip>}
                  {detectedSkills.slice(0, 3).map((sk) => (
                    <Chip key={sk}>+ {sk}</Chip>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--outline)]/20 mt-6">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handlePrev}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shadow-expressive-sm"
          >
            {step === totalSteps ? 'Start Interview Now' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
