import "server-only";

import { NextResponse } from "next/server";
import { lookupOrderForSession } from "@/lib/stripe/webhooks";
import { isStripeCheckoutSessionId } from "@/lib/stripe/association";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isSessionId(value: string) {
  return isStripeCheckoutSessionId(value);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id") ?? "";
  if (!isSessionId(sessionId)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const result = await lookupOrderForSession(sessionId);
  if (!result.sessionFound) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    orderStatus: result.order?.status ?? "pending",
    paid: result.order?.status === "paid",
  });
}
