import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Log In & Sign In | ViewPilot Pro",
  description: "Open the ViewPilot Pro workspace. Sign in to your account or practice with demo authentication.",
};

export const dynamic = "force-dynamic";

function safeNext(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  if (raw === "/login" || raw.startsWith("/login?") || raw === "/signin" || raw === "/signup") return "/dashboard";
  return raw;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const modeParam = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const initialMode = modeParam === "signup" ? "signup" : "signin";
  return <AuthForm nextPath={safeNext(params.next)} initialMode={initialMode} />;
}
