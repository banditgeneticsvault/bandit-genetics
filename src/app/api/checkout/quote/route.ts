import "server-only";

import { NextResponse } from "next/server";
import { parseCheckoutCartPayload } from "@/lib/checkout-cart";
import {
  publicQuotePayload,
  syncCheckoutPromotion,
} from "@/lib/checkout-promotion";
import { PROMOTION_THRESHOLD_CENTS } from "@/lib/shipping-promotion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "malformed" }, { status: 400 });
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const rawItems =
    typeof record.items === "string"
      ? record.items
      : JSON.stringify(Array.isArray(record.items) ? record.items : []);
  const parsed = parseCheckoutCartPayload(rawItems);
  if (!parsed.ok) {
    if (parsed.reason === "empty") {
      return NextResponse.json({
        merchandiseSubtotalCents: 0,
        shippingCents: 0,
        taxCents: 0,
        totalCents: 0,
        promotionStatus: "not_qualified",
        remainingCents: PROMOTION_THRESHOLD_CENTS,
        freeShipping: false,
        promotionalGiftApplied: false,
        gift: null,
      });
    }
    return NextResponse.json({ error: parsed.reason }, { status: 400 });
  }

  const synced = await syncCheckoutPromotion({
    items: parsed.lines,
    promotionalProductId: record.promotionalProductId,
  });
  if (!synced.ok) {
    if (synced.reason === "empty") {
      return NextResponse.json({
        merchandiseSubtotalCents: 0,
        shippingCents: 0,
        taxCents: 0,
        totalCents: 0,
        promotionStatus: "not_qualified",
        remainingCents: PROMOTION_THRESHOLD_CENTS,
        freeShipping: false,
        promotionalGiftApplied: false,
        gift: null,
      });
    }
    return NextResponse.json({ error: synced.reason }, { status: 400 });
  }

  return NextResponse.json(publicQuotePayload(synced.quote));
}
