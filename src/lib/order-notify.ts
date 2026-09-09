import "server-only";

import { formatUsd } from "@/lib/cart";
import {
  escapeHtml,
  formatSubmittedAt,
  sendBanditMail,
  type MailDeliveryResult,
} from "@/lib/mail";
import type { Order, OrderLine } from "@/lib/orders/types";

function lineDescription(line: OrderLine) {
  const kind = line.kind === "promotional" ? " (promotional gift)" : "";
  return `- ${line.strainName} — ${line.packLabel} × ${line.quantity}${kind}`;
}

function lineHtml(line: OrderLine) {
  const gift = line.kind === "promotional" ? " (promotional gift)" : "";
  return `<li>${escapeHtml(line.strainName)} — ${escapeHtml(line.packLabel)} × ${line.quantity}${gift}</li>`;
}

export function orderNotificationText(order: Order) {
  const paid = order.lines.filter((line) => line.kind !== "promotional");
  const gifts = order.lines.filter((line) => line.kind === "promotional");
  const notes = order.customerNotes?.trim();

  const blocks = [
    "New Bandit Genetics Order Request",
    "",
    `Customer Name: ${order.customerName}`,
    `Customer Email: ${order.customerEmail}`,
    `Submitted: ${formatSubmittedAt(order.updatedAt || order.createdAt)}`,
    `Order ID: ${order.id}`,
    `Payment method: ${order.paymentMethod === "request" ? "Order request" : order.paymentMethod}`,
    `Order status: ${order.status}`,
    `Payment status: ${order.paymentStatus}`,
    "",
    "Shipping:",
    order.freeShipping ? "FREE (merchandise qualified)" : formatUsd(order.shippingCents),
    "Street address is not collected at checkout. Follow up with the customer for delivery details.",
    "",
    "Requested Items:",
    ...(paid.length > 0 ? paid.map(lineDescription) : ["- None recorded"]),
    "",
    "Quantities are listed next to each item above.",
  ];

  if (gifts.length > 0) {
    blocks.push("", "Promotional gift:", ...gifts.map(lineDescription));
  }

  blocks.push(
    "",
    `Merchandise subtotal: ${formatUsd(order.subtotalCents)}`,
    `Shipping: ${order.freeShipping ? "FREE" : formatUsd(order.shippingCents)}`,
    `Order total: ${formatUsd(order.totalCents)}`,
    "",
    "Customer Notes:",
    notes || "None",
  );

  return blocks.join("\n");
}

function orderNotificationHtml(order: Order) {
  const paid = order.lines.filter((line) => line.kind !== "promotional");
  const gifts = order.lines.filter((line) => line.kind === "promotional");
  const notes = order.customerNotes?.trim() || "None";
  const submitted = formatSubmittedAt(order.updatedAt || order.createdAt);
  const items =
    paid.length > 0
      ? `<ul style="margin:0;padding-left:20px;">${paid.map(lineHtml).join("")}</ul>`
      : "<p style=\"margin:0;\">None recorded</p>";
  const giftBlock =
    gifts.length > 0
      ? `<p style="margin:16px 0 8px;"><strong>Promotional gift</strong></p><ul style="margin:0;padding-left:20px;">${gifts.map(lineHtml).join("")}</ul>`
      : "";

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4f1ea;color:#161616;font-family:Georgia,'Times New Roman',serif;line-height:1.5;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #d8d2c4;padding:24px;">
    <p style="margin:0 0 8px;letter-spacing:.16em;font-size:12px;color:#8a7316;">BANDIT GENETICS</p>
    <h1 style="margin:0 0 20px;font-size:22px;">New Bandit Genetics Order Request</h1>
    <p style="margin:0 0 12px;"><strong>Customer Name</strong><br>${escapeHtml(order.customerName)}</p>
    <p style="margin:0 0 12px;"><strong>Customer Email</strong><br>${escapeHtml(order.customerEmail)}</p>
    <p style="margin:0 0 12px;"><strong>Submitted</strong><br>${escapeHtml(submitted)}</p>
    <p style="margin:0 0 12px;"><strong>Payment method</strong><br>${escapeHtml(
      order.paymentMethod === "request" ? "Order request" : order.paymentMethod,
    )}</p>
    <p style="margin:0 0 12px;"><strong>Order status</strong><br>${escapeHtml(order.status)}</p>
    <p style="margin:0 0 12px;"><strong>Payment status</strong><br>${escapeHtml(order.paymentStatus)}</p>
    <p style="margin:16px 0 8px;"><strong>Requested Items</strong></p>
    ${items}
    <p style="margin:16px 0 8px;"><strong>Quantities</strong><br>Shown next to each requested item.</p>
    ${giftBlock}
    <p style="margin:16px 0 8px;"><strong>Merchandise subtotal</strong><br>${escapeHtml(formatUsd(order.subtotalCents))}</p>
    <p style="margin:0 0 12px;"><strong>Shipping</strong><br>${
      order.freeShipping ? "FREE" : escapeHtml(formatUsd(order.shippingCents))
    }<br>Street address is not collected at checkout. Follow up with the customer for delivery details.</p>
    <p style="margin:0 0 12px;"><strong>Order total</strong><br>${escapeHtml(formatUsd(order.totalCents))}</p>
    <p style="margin:0 0 8px;"><strong>Customer Notes</strong></p>
    <p style="margin:0;white-space:pre-wrap;">${escapeHtml(notes).replaceAll("\n", "<br>")}</p>
    <p style="margin:20px 0 0;font-size:13px;color:#555;">Order ID: ${escapeHtml(order.id)}</p>
  </div>
</body>
</html>`;
}

export async function deliverOrderRequest(
  order: Order,
): Promise<MailDeliveryResult> {
  return sendBanditMail({
    replyTo: order.customerEmail,
    subject: "New Bandit Genetics Order Request",
    text: orderNotificationText(order),
    html: orderNotificationHtml(order),
  });
}
