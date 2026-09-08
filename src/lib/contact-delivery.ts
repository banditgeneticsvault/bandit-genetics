import "server-only";

import type { ContactFields } from "@/lib/contact";
import { sendBanditMail, type MailDeliveryResult } from "@/lib/mail";

export type ContactDeliveryResult = MailDeliveryResult;

export async function deliverContactMessage(
  payload: ContactFields,
): Promise<ContactDeliveryResult> {
  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Subject: ${payload.subject}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  return sendBanditMail({
    replyTo: payload.email,
    subject: `Bandit Genetics Contact: ${payload.subject}`,
    text,
  });
}
