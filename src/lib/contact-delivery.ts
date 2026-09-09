import "server-only";

import type { ContactFields } from "@/lib/contact";
import {
  escapeHtml,
  formatSubmittedAt,
  sendBanditMail,
  type MailDeliveryResult,
} from "@/lib/mail";

export type ContactDeliveryResult = MailDeliveryResult;

function contactText(payload: ContactFields, submitted: string) {
  return [
    "New Bandit Genetics Contact Request",
    "",
    `Customer Name: ${payload.name}`,
    `Customer Email: ${payload.email}`,
    `Subject: ${payload.subject}`,
    `Submitted: ${submitted}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}

function contactHtml(payload: ContactFields, submitted: string) {
  const message = escapeHtml(payload.message).replaceAll("\n", "<br>");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Bandit Genetics Contact Request</title>
</head>
<body style="margin:0;padding:24px;background:#f4f1ea;color:#161616;font-family:Georgia,'Times New Roman',serif;line-height:1.5;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #d8d2c4;padding:24px;">
    <p style="margin:0 0 8px;font-size:12px;color:#8a7316;">Bandit Genetics</p>
    <h1 style="margin:0 0 20px;font-size:22px;">New Bandit Genetics Contact Request</h1>
    <p style="margin:0 0 12px;"><strong>Customer Name</strong><br>${escapeHtml(payload.name)}</p>
    <p style="margin:0 0 12px;"><strong>Customer Email</strong><br>${escapeHtml(payload.email)}</p>
    <p style="margin:0 0 12px;"><strong>Subject</strong><br>${escapeHtml(payload.subject)}</p>
    <p style="margin:0 0 12px;"><strong>Submitted</strong><br>${escapeHtml(submitted)}</p>
    <p style="margin:0 0 8px;"><strong>Message</strong></p>
    <p style="margin:0;white-space:pre-wrap;">${message}</p>
  </div>
</body>
</html>`;
}

export async function deliverContactMessage(
  payload: ContactFields,
): Promise<ContactDeliveryResult> {
  const submitted = formatSubmittedAt();
  return sendBanditMail({
    subject: "New Bandit Genetics Contact Request",
    text: contactText(payload, submitted),
    html: contactHtml(payload, submitted),
  });
}
