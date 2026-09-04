export function isStripeCheckoutSessionId(value: string) {
  return /^cs_(test|live)_[A-Za-z0-9]+$/.test(value);
}

export function stripeSessionOrderId(session: {
  metadata?: { orderId?: string | null } | null;
  client_reference_id?: string | null;
}): string | null {
  const fromMetadata = session.metadata?.orderId?.trim() ?? "";
  if (fromMetadata) return fromMetadata;
  const fromReference = session.client_reference_id?.trim() ?? "";
  return fromReference || null;
}

export function sessionBelongsToOrder(
  session: {
    id: string;
    metadata?: { orderId?: string | null } | null;
    client_reference_id?: string | null;
  },
  order: {
    id: string;
    stripeCheckoutSessionId: string | null;
  },
): boolean {
  const associatedId = stripeSessionOrderId(session);
  if (!associatedId || associatedId !== order.id) return false;
  if (
    order.stripeCheckoutSessionId &&
    order.stripeCheckoutSessionId !== session.id
  ) {
    return false;
  }
  return true;
}
