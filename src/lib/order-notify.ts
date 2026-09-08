import "server-only";

import { formatUsd } from "@/lib/cart";
import { sendBanditMail, type MailDeliveryResult } from "@/lib/mail";
import type { Order, OrderLine } from "@/lib/orders/types";

function lineDescription(line: OrderLine) {
  const kind = line.kind === "promotional" ? " (promotional gift)" : "";
  return `- ${line.strainName} — ${line.packLabel} × ${line.quantity}${kind}`;
}

export function orderNotificationText(order: Order) {
  const paid = order.lines.filter((line) => line.kind !== "promotional");
  const gifts = order.lines.filter((line) => line.kind === "promotional");

  const blocks = [
    "Bandit Genetics order request",
    "",
    `Submitted: ${order.updatedAt || order.createdAt}`,
    `Order ID: ${order.id}`,
    "",
    `Customer name: ${order.customerName}`,
    `Customer email: ${order.customerEmail}`,
    "",
    "Requested genetics:",
    ...(paid.length > 0 ? paid.map(lineDescription) : ["- None recorded"]),
  ];

  if (gifts.length > 0) {
    blocks.push("", "Promotional gift:", ...gifts.map(lineDescription));
  }

  blocks.push(
    "",
    `Merchandise subtotal: ${formatUsd(order.subtotalCents)}`,
    `Shipping: ${order.freeShipping ? "FREE" : formatUsd(order.shippingCents)}`,
    `Order total: ${formatUsd(order.totalCents)}`,
  );

  return blocks.join("\n");
}

export async function deliverOrderRequest(
  order: Order,
): Promise<MailDeliveryResult> {
  return sendBanditMail({
    replyTo: order.customerEmail,
    subject: `Bandit Genetics order request: ${order.customerName}`,
    text: orderNotificationText(order),
  });
}
