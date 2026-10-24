'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Brain,
  MessageSquareCheck,
  Award,
  Zap,
  Target,
  Quote,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start overflow-hidden px-4 sm:px-6 py-8 sm:py-16">
      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full flex flex-col items-center text-center space-y-6 pt-4 sm:pt-8"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-container)] border border-[var(--primary)]/30 text-[var(--on-primary-container)] text-xs sm:text-sm font-semibold tracking-wide shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-[var(--primary)] animate-pulse" />
          <span>CodeFest 2026 • AI-Powered Job Readiness</span>
        </motion.div>

        {/* Hero Heading */}
        <motion.h1
          variants={itemVariants}
          className="font-serif-hero text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08] max-w-3xl"
        >
          Master your next interview with an{' '}
          <span className="text-[var(--primary)] italic">adaptive AI coach</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed"
        >
          Dynamic conversational practice tailored to your exact target role. Get instant,
          evidence-backed feedback across communication, technical depth, and problem-solving.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 w-full sm:w-auto"
        >
          <Link href="/setup" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-4 shadow-expressive-md hover:shadow-expressive-lg group"
              rightIcon={
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              }
            >
              Start Free Practice Session
            </Button>
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto text-center"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-sm sm:text-base border-[var(--outline)]"
            >
              How ViewPilot Works
            </Button>
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-4 text-xs sm:text-sm text-[var(--text-secondary)] font-medium"
        >
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> No signup required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> Zero API keys in browser
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> Coaching, never gatekeeping
          </span>
        </motion.div>
      </motion.div>

      {/* Interactive Feature Demo Preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="max-w-5xl w-full mt-12 sm:mt-16"
      >
        <Card
          variant="elevated"
          className="p-6 sm:p-8 bg-gradient-to-b from-[var(--surface)] to-[var(--surface-container)] border border-[var(--outline)]/40 shadow-expressive-lg"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left Mock Preview: Interview Chat */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--outline)]/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-xs">
                    VP
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[var(--text-primary)]">
                      ViewPilot Interviewer
                    </h2>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Target: Frontend Developer • Behavioral (STAR)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--secondary-container)] text-[var(--secondary)]">
                  Question 2 of 6
                </span>
              </div>

              {/* Chat Bubble AI */}
              <div className="bg-[var(--surface-container)] p-4 rounded-[22px] rounded-tl-sm text-sm text-[var(--text-primary)] border border-[var(--outline)]/30 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] block">
                  Adaptive Follow-up
                </span>
                <p>
                  "You mentioned optimizing bundle size with tree-shaking, but how did you measure
                  the tangible impact on Largest Contentful Paint (LCP) for your mobile users?"
                </p>
              </div>

              {/* Chat Bubble Candidate */}
              <div className="bg-[var(--primary-container)] text-[var(--on-primary-container)] p-4 rounded-[22px] rounded-tr-sm text-sm ml-auto max-w-[90%] border border-[var(--primary)]/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] block">
                  Your Answer
                </span>
                <p>
                  "We instrumented Web Vitals in our analytics pipeline. Initial LCP was 3.8s on 3G;
                  after dynamic imports and code-splitting, it dropped to 1.9s, directly improving
                  our checkout conversion by 12%."
                </p>
              </div>
            </div>

            {/* Right Mock Preview: Real-time Rubric */}
            <div className="flex-1 w-full bg-[var(--surface)] p-6 rounded-[24px] border border-[var(--outline)]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-hero text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[var(--primary)]" />
                  Evidence-Backed Rubric
                </h3>
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-[var(--primary)] text-[var(--on-primary)]">
                  Overall: 8.8 / 10
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-[16px] bg-[var(--surface-container)]/70 border border-[var(--outline)]/30">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[var(--text-primary)]">Answer Quality & Metrics</span>
                    <span className="text-[var(--success)] font-bold">9.2 / 10</span>
                  </div>
                  <div className="w-full bg-[var(--outline)]/20 rounded-full h-1.5 mt-2">
                    <div className="bg-[var(--success)] h-1.5 rounded-full w-[92%]" />
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-2 flex items-start gap-1">
                    <Quote className="w-3.5 h-3.5 text-[var(--primary)] shrink-0 inline mt-0.5" />
                    <span>Evidence cited: "dropped to 1.9s, improving checkout conversion by 12%"</span>
                  </p>
                </div>

                <div className="p-3 rounded-[16px] bg-[var(--surface-container)]/70 border border-[var(--outline)]/30">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[var(--text-primary)]">Technical Depth</span>
                    <span className="text-[var(--primary)] font-bold">8.5 / 10</span>
                  </div>
                  <div className="w-full bg-[var(--outline)]/20 rounded-full h-1.5 mt-2">
                    <div className="bg-[var(--primary)] h-1.5 rounded-full w-[85%]" />
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-2">
                    Specific mention of Web Vitals and dynamic code-splitting demonstrated core competency.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/setup" className="block">
                  <Button variant="tonal" size="sm" className="w-full text-xs font-semibold">
                    Practice This Role Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Feature Pillar Grid */}
      <div id="how-it-works" className="max-w-5xl w-full mt-20 sm:mt-28 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
            Architected for Excellence
          </span>
          <h2 className="font-serif-hero text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Why ViewPilot outperforms generic mock interviews
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
            Engineered with strict rubric constraints, adaptive AI branching, and complete privacy isolation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="elevated" className="space-y-4 hover:border-[var(--primary)]/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)] flex items-center justify-center">
              <Brain className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Adaptive Follow-ups
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Interviews aren't rigid scripts. ViewPilot dynamically assesses your response and probes deeper into vague claims or challenges assumptions just like real hiring managers.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-4 hover:border-[var(--secondary)]/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[var(--secondary-container)] text-[var(--secondary)] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              4-Dimension Rubrics
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Every practice session is graded systematically on Communication, Role Knowledge, Problem Solving, and Answer Quality with transparent criteria.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-4 hover:border-[var(--tertiary)]/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[var(--tertiary-container)] text-[var(--tertiary)] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Verbatim Evidence Grounding
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Zero mysterious scores. Every feedback point directly quotes phrases from your transcript, providing clear blueprints to transform weak answers into compelling stories.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-4 hover:border-[var(--success)]/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#386A4A]/15 text-[#386A4A] dark:text-[#9BD0A6] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Fairness & Bias Safeguards
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Strict deterministic temperature bounds and demographic-neutral prompt constraints ensure consistent scoring without hallucinated feedback.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-4 hover:border-[var(--warning)]/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#8A5B16]/15 text-[#8A5B16] dark:text-[#F0C078] flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Speech & Cadence Telemetry
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Real-time pace coaching tracks words-per-minute (WPM), speech cadence, and vocal filler words to refine your delivery.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-4 hover:border-[var(--primary)]/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[var(--primary-container)] text-[var(--primary)] flex items-center justify-center">
              <MessageSquareCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Multi-Session Progress
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Track your Job Readiness Index and competency trajectory across attempts, auditing progress from your first diagnostic baseline to placement ready.
            </p>
          </Card>
        </div>
      </div>

      {/* 5 Specialist AI Agents Showcase */}
      <div className="max-w-5xl w-full mt-20 sm:mt-28 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
            Multi-Agent Team
          </span>
          <h2 className="font-serif-hero text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Five specialist coaches. One unified workspace.
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
            Switch between targeted coaches who specialize in real interview dynamics, resume rewrites, skill diagnostics, and career navigation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card variant="elevated" className="p-6 space-y-4 hover:border-[var(--primary)]/60 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-sm">
                IC
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Interview Coach</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Conducts realistic, role-specific mock interviews and probes deep into vague answers with the 4-part STAR method.
              </p>
            </div>
            <Link href="/dashboard?agent=interview-coach">
              <Button variant="tonal" size="sm" className="w-full text-xs">Chat with Coach →</Button>
            </Link>
          </Card>

          <Card variant="elevated" className="p-6 space-y-4 hover:border-[var(--secondary)]/60 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm">
                RR
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Resume Reviewer</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Pinpoints weak bullets, formats missing metrics into Action-Result impacts, and checks ATS keywords.
              </p>
            </div>
            <Link href="/dashboard?agent=resume-reviewer">
              <Button variant="tonal" size="sm" className="w-full text-xs">Review Resume →</Button>
            </Link>
          </Card>

          <Card variant="elevated" className="p-6 space-y-4 hover:border-emerald-500/60 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                SA
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Skill Analyzer</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Maps target role requirements against candidate capabilities and generates customized technical drills.
              </p>
            </div>
            <Link href="/dashboard?agent=skill-analyzer">
              <Button variant="tonal" size="sm" className="w-full text-xs">Analyze Skills →</Button>
            </Link>
          </Card>

          <Card variant="elevated" className="p-6 space-y-4 hover:border-amber-500/60 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                CA
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Career Advisor</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Synthesizes interview feedback into 14-day high-impact action plans and compensation positioning advice.
              </p>
            </div>
            <Link href="/dashboard?agent=career-advisor">
              <Button variant="tonal" size="sm" className="w-full text-xs">Explore Strategy →</Button>
            </Link>
          </Card>

          <Card variant="elevated" className="p-6 space-y-4 hover:border-rose-500/60 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm">
                CT
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Communication Trainer</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Refines verbal delivery, eliminates filler words, and sharpens executive presence under pressure.
              </p>
            </div>
            <Link href="/dashboard?agent=communication-trainer">
              <Button variant="tonal" size="sm" className="w-full text-xs">Train Communication →</Button>
            </Link>
          </Card>

          <Card variant="filled" className="p-6 space-y-4 bg-gradient-to-br from-[var(--surface-container)] to-[var(--surface-container-high)] border border-[var(--primary)]/40 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] block">
                Visual Pipelines
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Workflow Builder</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Chain multi-agent actions into automated prep pipelines: resume ingest → question generation → live mock → report.
              </p>
            </div>
            <Link href="/dashboard?mode=workflow">
              <Button variant="primary" size="sm" className="w-full text-xs">Open Workflow Builder →</Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-5xl w-full mt-20 mb-8">
        <Card
          variant="filled"
          className="p-8 sm:p-12 text-center bg-[var(--surface-container-high)] border border-[var(--outline)]/40 relative overflow-hidden"
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-[var(--surface)] p-2 border border-[var(--outline)]/30 shadow-xs flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="MoonCraft Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <h2 className="font-serif-hero text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Ready to elevate your interview readiness?
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)]">
              Select your target role, configure difficulty, and complete a 5-minute targeted interview with our AI coach right now.
            </p>
            <div className="pt-2">
              <Link href="/setup">
                <Button size="lg" className="px-8 py-4 text-base font-semibold shadow-expressive-md">
                  Launch Onboarding Setup →
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl pt-10 pb-6 border-t border-[var(--outline)]/20 text-center text-xs text-[var(--text-secondary)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>ViewPilot • Designed & Engineered by Team MoonCraft</span>
        <span>CodeFest 2026 Hackathon Finalist</span>
      </footer>
    </div>
  );
}
