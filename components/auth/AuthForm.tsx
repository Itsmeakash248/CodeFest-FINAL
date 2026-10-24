"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  CircleDot,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  UserRound,
} from "lucide-react";
import { login } from "@/lib/client/api";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import ScoreRing from "@/components/ui/ScoreRing";
import { cn } from "@/components/ui/cn";

interface AuthFormProps {
  nextPath: string;
  initialMode?: "signin" | "signup";
}

export default function AuthForm({ nextPath, initialMode = "signin" }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Frontend Developer");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"form" | "demo" | "google" | "github" | null>(null);

  async function enter(
    nextEmail: string,
    nextName: string | undefined,
    triggerMode: "form" | "demo" | "google" | "github"
  ) {
    setError(null);
    setLoading(triggerMode);
    try {
      await login(nextEmail, nextName);
      router.push(nextPath);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not open the workspace. Try again.");
      setLoading(null);
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      setError("Enter an email address, or continue with the demo account.");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name to personalize your candidate assessment report.");
      return;
    }
    const finalName = name.trim() || (mode === "signup" ? "New Candidate" : undefined);
    void enter(email.trim(), finalName, "form");
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      {/* Background ambient lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="aurora left-[-6%] top-[-8%] h-[520px] w-[520px] bg-[#B9573D]/15 dark:bg-[#F0A18A]/10" />
        <div className="aurora right-[-10%] bottom-[-12%] h-[480px] w-[480px] bg-[#625B8A]/15 dark:bg-[#C9BDF7]/10" />
      </div>

      <div className="relative mx-auto grid min-h-dvh w-full max-w-[1400px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* narrative / branding side */}
        <div className="flex flex-col justify-between px-5 pb-10 pt-7 sm:px-10 lg:px-14 lg:py-10">
          <div className="flex items-center justify-between">
            <Link href="/" aria-label="ViewPilot Pro home" className="flex items-center gap-2">
              <Logo size={28} />
              <span className="font-serif-hero text-xl font-bold tracking-tight text-[var(--text-primary)]">
                ViewPilot <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-[var(--primary-container)] text-[var(--on-primary-container)] ml-1">PRO</span>
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-[var(--outline)]/40 bg-[var(--surface-container)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:border-[var(--primary)]"
            >
              Back to Home
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="my-10 max-w-[560px] lg:my-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--outline)]/40 bg-[var(--surface-container)] px-3 py-1.5">
              <CircleDot size={9} className="text-[var(--primary)] animate-pulse" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                Live Proctor Shield • Zero-friction auth
              </span>
            </div>

            <h1 className="mt-6 font-serif-hero text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-[var(--text-primary)]">
              Master the interview.
              <br />
              <span className="text-[var(--primary)] italic">Get hired faster.</span>
            </h1>

            <p className="mt-4 max-w-[460px] text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
              Continuous candidate proctoring, STAR method rubrics, and instant AI coaching telemetry tailored for top-tier tech roles.
            </p>

            <div className="mt-7 space-y-3.5">
              {[
                {
                  icon: Sparkles,
                  title: "Adaptive AI Interview Simulator",
                  body: "Questions probe deeper into real technical trade-offs based on candidate responses.",
                },
                {
                  icon: ShieldCheck,
                  title: "Authenticity & Proctoring Shield",
                  body: "Passive tab focus tracking, clipboard injection audit, and synthetic AI pattern flags.",
                },
                {
                  icon: UserCheck,
                  title: "Evidence-Backed Scorecard",
                  body: "Four weighted dimensions (Communication, Technical Depth, Problem Solving, Answer Quality).",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-container)] text-[var(--primary)]">
                      <Icon size={16} strokeWidth={2} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
                      <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Micro scorecard preview */}
            <div className="mt-8 rounded-3xl border border-[var(--outline)]/30 bg-[var(--surface-container)]/70 p-4 sm:max-w-[440px]">
              <div className="flex items-center gap-3">
                <ScoreRing score={8.4} size={64} stroke={5} label="overall" />
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
                    Audit Sample
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                    &ldquo;Alex isolated GPU re-renders using Chrome DevTools, reducing frame drops from 22fps to 60fps.&rdquo;
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[var(--outline)]/20 pt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                <span>Verified Authentic</span>
                <span className="text-[var(--success)] font-bold">98% Integrity Pass</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">
            <span>Team Mooncraft</span>
            <span className="h-1 w-1 rounded-full bg-[var(--outline)]" />
            <span>CodeFest 2026</span>
            <span className="h-1 w-1 rounded-full bg-[var(--outline)]" />
            <span>AI Job Readiness Platform</span>
          </div>
        </div>

        {/* form side */}
        <div className="flex items-center justify-center px-4 pb-14 sm:px-8 lg:border-l lg:border-[var(--outline)]/25 lg:bg-[var(--surface-container)]/20 lg:px-12 lg:py-10">
          <div className="w-full max-w-[440px]">
            <div className="glass p-6 sm:p-8 space-y-5 bg-[var(--surface)] border border-[var(--outline)]/30 shadow-lg rounded-[28px]">
              {/* Header Mode Switcher Tabs */}
              <div className="flex items-center justify-between gap-2 border-b border-[var(--outline)]/20 pb-4">
                <div className="flex items-center p-1 rounded-full bg-[var(--surface-container)] border border-[var(--outline)]/30 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                    }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                      mode === "signin"
                        ? "bg-[var(--primary)] text-white shadow-xs"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    <KeyRound size={13} />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                    }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                      mode === "signup"
                        ? "bg-[var(--primary)] text-white shadow-xs"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    <UserPlus size={13} />
                    <span>Create Account</span>
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="font-serif-hero text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  {mode === "signin" ? "Welcome back" : "Create candidate profile"}
                </h2>
                <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {mode === "signin"
                    ? "Sign in to access your interview workspace, practice records, and AI coaching history."
                    : "Register to practice realistic behavioral & technical interviews with live proctoring."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-3.5">
                {mode === "signup" && (
                  <div>
                    <label htmlFor="auth-name" className="mb-1 block text-xs font-semibold text-[var(--text-primary)]">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserRound
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                      />
                      <input
                        id="auth-name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        className="input !pl-10 text-xs sm:text-sm"
                        required={mode === "signup"}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="auth-email" className="mb-1 block text-xs font-semibold text-[var(--text-primary)]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                    />
                    <input
                      id="auth-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="input !pl-10 text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {mode === "signup" && (
                  <div>
                    <label htmlFor="auth-role" className="mb-1 block text-xs font-semibold text-[var(--text-primary)]">
                      Target Role
                    </label>
                    <div className="relative">
                      <Briefcase
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                      />
                      <select
                        id="auth-role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="input !pl-10 text-xs sm:text-sm"
                      >
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="AI / ML Engineer">AI / ML Engineer</option>
                        <option value="System Architect">System Architect</option>
                        <option value="Product Manager">Product Manager</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label htmlFor="auth-password" className="text-xs font-semibold text-[var(--text-primary)]">
                      Password
                    </label>
                    {mode === "signin" && (
                      <span className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--primary)] cursor-pointer">
                        Forgot?
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                    />
                    <input
                      id="auth-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === "signin" ? "Enter your password" : "At least 8 characters"}
                      className="input !pl-10 !pr-10 text-xs sm:text-sm"
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {mode === "signup" && (
                  <label className="flex items-start gap-2 pt-1 text-[11px] text-[var(--text-secondary)] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded accent-[var(--primary)]"
                    />
                    <span>
                      Enable Live Anti-Cheat & Camera Proctoring Shield for authentic readiness telemetry.
                    </span>
                  </label>
                )}

                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-2xl border border-[var(--error)]/30 bg-[var(--error)]/10 p-3 text-xs text-[var(--error)]"
                  >
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full !py-3 !text-sm font-semibold rounded-full bg-[var(--primary)] text-white hover:opacity-90 shadow-sm transition-all"
                  loading={loading === "form"}
                  disabled={loading !== null}
                >
                  {mode === "signin" ? "Sign In to Workspace" : "Create Account & Start"}
                  {loading !== "form" && <ArrowRight size={15} />}
                </Button>
              </form>

              {/* Or Divider */}
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-[var(--outline)]/20" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                  or quick access
                </span>
                <span className="h-px flex-1 bg-[var(--outline)]/20" />
              </div>

              {/* One-Click Demo Candidate Login */}
              <Button
                variant="soft"
                onClick={() => void enter("demo@viewpilot.app", "Demo Candidate", "demo")}
                loading={loading === "demo"}
                disabled={loading !== null}
                className="w-full !py-2.5 !text-xs font-semibold rounded-full border border-[var(--primary)]/30 bg-[var(--primary-container)]/40 hover:bg-[var(--primary-container)]/70 text-[var(--text-primary)]"
              >
                <Sparkles size={14} className="text-[var(--primary)]" />
                <span>One-Click Demo Candidate Login</span>
              </Button>

              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => void enter("google.candidate@viewpilot.app", "Google User", "google")}
                  disabled={loading !== null}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-full border border-[var(--outline)]/30 bg-[var(--surface-container)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-container-high)] transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => void enter("github.candidate@viewpilot.app", "GitHub Dev", "github")}
                  disabled={loading !== null}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-full border border-[var(--outline)]/30 bg-[var(--surface-container)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-container-high)] transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Mode switch link */}
              <div className="pt-2 text-center text-xs text-[var(--text-secondary)]">
                {mode === "signin" ? (
                  <span>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                      }}
                      className="font-bold text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      Sign up for free
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setError(null);
                      }}
                      className="font-bold text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      Sign in here
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Bottom info */}
            <div className="mt-4 flex items-center justify-between px-2 text-[11px] text-[var(--text-secondary)]">
              <Link href="/" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
                <span>ViewPilot Landing</span>
                <ArrowUpRight size={11} />
              </Link>
              <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                TLS Encrypted • Client-First
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
