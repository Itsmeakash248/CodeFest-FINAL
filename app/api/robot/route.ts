import { getRobotStatus, setRobotExpression, setRobotInterviewTurn } from "@/lib/robot/client";

export async function GET() {
  const status = await getRobotStatus();
  return Response.json(status, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  let turnResult: { configured: boolean; online: boolean; sent: boolean } | null = null;
  if (typeof body.stage === "string") {
    turnResult = await setRobotInterviewTurn({
      stage: body.stage as any,
      question: typeof body.question === "string" ? body.question : undefined,
      q: typeof body.q === "number" ? body.q : undefined,
      total: typeof body.total === "number" ? body.total : undefined,
    });
  }

  let exprResult: { configured: boolean; online: boolean; sent: boolean; expression: string } | null = null;
  if (typeof body.expression === "string" || body.nod === true) {
    const expr = body.nod ? "nod" : (body.expression as string);
    exprResult = await setRobotExpression(expr);
  }

  return Response.json(
    {
      configured: turnResult?.configured ?? exprResult?.configured ?? false,
      online: turnResult?.online ?? exprResult?.online ?? false,
      turn: turnResult,
      expression: exprResult,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
