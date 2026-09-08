import "server-only";

import nodemailer from "nodemailer";

export type MailDeliveryResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "send_failed" };

function readSmtpConfig() {
  const host = process.env.CONTACT_SMTP_HOST?.trim();
  const portRaw = process.env.CONTACT_SMTP_PORT?.trim();
  const user = process.env.CONTACT_SMTP_USER?.trim();
  const pass = process.env.CONTACT_SMTP_PASSWORD?.trim();
  const destination = process.env.CONTACT_DESTINATION_EMAIL?.trim();
  const port = portRaw ? Number(portRaw) : Number.NaN;

  if (
    !host ||
    !user ||
    !pass ||
    !destination ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    return null;
  }

  return { host, port, user, pass, destination };
}

/** Strip CR/LF so submitted values cannot inject SMTP headers. */
function headerSafe(value: string) {
  return value.replace(/[\0\r\n\u2028\u2029]+/g, " ").trim();
}

export async function sendBanditMail(input: {
  replyTo: string;
  subject: string;
  text: string;
}): Promise<MailDeliveryResult> {
  const config = readSmtpConfig();
  if (!config) {
    return { ok: false, reason: "unconfigured" };
  }

  const from = headerSafe(config.user);
  const to = headerSafe(config.destination);
  const replyTo = headerSafe(input.replyTo);
  const subject = headerSafe(input.subject);

  if (!from || !to || !replyTo || !subject) {
    return { ok: false, reason: "send_failed" };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port === 587,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `Bandit Genetics <${from}>`,
      to,
      replyTo,
      subject,
      text: input.text,
    });

    if (info.rejected && info.rejected.length > 0) {
      console.error("mail.smtp.rejected");
      return { ok: false, reason: "send_failed" };
    }

    return { ok: true };
  } catch {
    console.error("mail.smtp.failed");
    return { ok: false, reason: "send_failed" };
  }
}
