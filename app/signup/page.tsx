import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up & Register | ViewPilot Pro",
  description: "Create your ViewPilot Pro candidate account. Start preparing with adaptive AI mock interviews and proctoring telemetry.",
};

export const dynamic = "force-dynamic";

function safeNext(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  if (raw === "/login" || raw.startsWith("/login?") || raw === "/signin" || raw === "/signup") return "/dashboard";
  return raw;
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return <AuthForm nextPath={safeNext(params.next)} initialMode="signup" />;
}
