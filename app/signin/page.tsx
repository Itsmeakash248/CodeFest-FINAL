import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign In | ViewPilot Pro",
  description: "Sign in to access your ViewPilot Pro interview dashboard, history, and AI coaching agents.",
};

export const dynamic = "force-dynamic";

function safeNext(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  if (raw === "/login" || raw.startsWith("/login?") || raw === "/signin" || raw === "/signup") return "/dashboard";
  return raw;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return <AuthForm nextPath={safeNext(params.next)} initialMode="signin" />;
}
