const EXPRESSIONS = [
  "neutral",
  "listening",
  "thinking",
  "happy",
  "encouraging",
  "nod",
  "speaking",
  "curious",
  "surprised",
  "focused",
] as const;

export type RobotExpression = (typeof EXPRESSIONS)[number];

export interface RobotStatus {
  configured: boolean;
  online: boolean;
  expression?: string;
  role?: string;
  battery?: number;
  ip?: string;
  interview?: {
    stage: string;
    q: number;
    total: number;
    question: string;
  };
  error?: string;
}

function baseUrl(): string | null {
  const raw = process.env.ROBOT_BASE_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function robotConfigured(): boolean {
  return baseUrl() !== null;
}

export async function getRobotStatus(): Promise<RobotStatus> {
  const base = baseUrl();
  if (!base) return { configured: false, online: false, expression: "offline" };
  try {
    const response = await fetch(`${base}/status`, {
      signal: AbortSignal.timeout(1800),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Robot returned ${response.status}`);
    const data = (await response.json()) as Record<string, unknown>;
    return {
      configured: true,
      online: true,
      expression: typeof data.expression === "string" ? data.expression : "neutral",
      role: typeof data.role === "string" ? data.role : "ViewPilot AI Interviewer",
      battery: typeof data.battery === "number" ? data.battery : 95,
      ip: typeof data.ip === "string" ? data.ip : undefined,
      interview: typeof data.interview === "object" && data.interview !== null ? (data.interview as any) : undefined,
    };
  } catch {
    return { configured: true, online: false, expression: "offline", error: "Robot unreachable" };
  }
}

export async function setRobotExpression(
  expression: string
): Promise<{ configured: boolean; online: boolean; sent: boolean; expression: string }> {
  const base = baseUrl();
  const safe = EXPRESSIONS.includes(expression as RobotExpression) ? expression : "neutral";
  if (!base) return { configured: false, online: false, sent: false, expression: safe };
  try {
    const response = await fetch(`${base}/expression`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression: safe }),
      signal: AbortSignal.timeout(1800),
      cache: "no-store",
    });
    return {
      configured: true,
      online: response.ok,
      sent: response.ok,
      expression: safe,
    };
  } catch {
    return { configured: true, online: false, sent: false, expression: safe };
  }
}

export async function setRobotInterviewTurn(params: {
  stage: "asking" | "listening" | "thinking" | "encouraging" | "evaluating" | "complete" | "idle";
  question?: string;
  q?: number;
  total?: number;
}): Promise<{ configured: boolean; online: boolean; sent: boolean }> {
  const base = baseUrl();
  if (!base) return { configured: false, online: false, sent: false };
  try {
    const response = await fetch(`${base}/api/interview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(1800),
      cache: "no-store",
    });
    return {
      configured: true,
      online: response.ok,
      sent: response.ok,
    };
  } catch {
    return { configured: true, online: false, sent: false };
  }
}
