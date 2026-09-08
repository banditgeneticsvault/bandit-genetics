import "server-only";

import nodemailer from "nodemailer";

const SUPPORT_ADDRESS = "support@banditgenetics.com";
const LEGACY_PROTON_ADDRESS = "banditgeneticsvault@proton.me";
const DEFAULT_SMTP_HOST = "smtp.protonmail.ch";
const DEFAULT_SMTP_PORT = 587;
const REPLY_TO_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type MailDeliveryResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "send_failed" };

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  destination: string;
};

function firstEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return { name, value };
  }
  return null;
}

function readPort() {
  const raw = firstEnv(["CONTACT_SMTP_PORT", "SMTP_PORT"])?.value;
  if (!raw) return DEFAULT_SMTP_PORT;
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return null;
  return port;
}

function resolveAuthorizedAddress(raw: string | undefined) {
  const value = headerSafe(raw ?? "");
  if (!value) return "";
  if (value.toLowerCase() === LEGACY_PROTON_ADDRESS) {
    console.info("mail.address.legacy_proton_me");
    return SUPPORT_ADDRESS;
  }
  return value;
}

function readSmtpConfig():
  | { ok: true; config: SmtpConfig }
  | { ok: false; missing: string[] } {
  const host = firstEnv(["CONTACT_SMTP_HOST", "SMTP_HOST"])?.value ?? DEFAULT_SMTP_HOST;
  const port = readPort();
  const user = firstEnv(["CONTACT_SMTP_USER", "SMTP_USER"]);
  const pass = firstEnv(["CONTACT_SMTP_PASSWORD", "SMTP_PASSWORD"]);
  const fromRaw = firstEnv(["EMAIL_FROM", "CONTACT_FROM_EMAIL"])?.value ?? user?.value;
  const destinationRaw = firstEnv([
    "CONTACT_DESTINATION_EMAIL",
    "CONTACT_NOTIFICATION_EMAIL",
    "ORDER_NOTIFICATION_EMAIL",
  ])?.value;

  const missing: string[] = [];
  if (!user) missing.push("CONTACT_SMTP_USER");
  if (!pass) missing.push("CONTACT_SMTP_PASSWORD");
  if (port === null) missing.push("CONTACT_SMTP_PORT");
  if (missing.length > 0) {
    return { ok: false, missing };
  }

  const authorizedUser = resolveAuthorizedAddress(user!.value) || SUPPORT_ADDRESS;
  const from =
    resolveAuthorizedAddress(fromRaw) || authorizedUser || SUPPORT_ADDRESS;

  return {
    ok: true,
    config: {
      host,
      port: port as number,
      user: user!.value,
      pass: pass!.value,
      from,
      destination: resolveAuthorizedAddress(destinationRaw) || SUPPORT_ADDRESS,
    },
  };
}

/** Strip CR/LF so submitted values cannot inject SMTP headers. */
function headerSafe(value: string) {
  return value.replace(/[\0\r\n\u2028\u2029]+/g, " ").trim();
}

function isValidReplyTo(value: string) {
  return REPLY_TO_PATTERN.test(value) && value.length <= 254;
}

function classifySmtpError(error: unknown) {
  const err = error as {
    code?: string;
    command?: string;
    responseCode?: number;
    response?: string;
  };
  const code = (err.code ?? "").toUpperCase();
  const command = (err.command ?? "").toUpperCase();
  const responseCode = err.responseCode ?? 0;
  const response = (err.response ?? "").toLowerCase();

  if (
    code === "EAUTH" ||
    responseCode === 535 ||
    responseCode === 530 ||
    response.includes("authentication")
  ) {
    return "auth_failed";
  }
  if (
    code === "ECONNECTION" ||
    code === "ETIMEDOUT" ||
    code === "ESOCKET" ||
    code === "EDNS" ||
    code === "ENOTFOUND" ||
    code === "EHOSTUNREACH"
  ) {
    return "connection_failed";
  }
  if (command === "MAIL FROM" || responseCode === 553) {
    return "sender_rejected";
  }
  if (command === "RCPT TO" || response.includes("recipient")) {
    return "recipient_rejected";
  }
  return "send_failed";
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatSubmittedAt(value?: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

export async function sendBanditMail(input: {
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}): Promise<MailDeliveryResult> {
  const loaded = readSmtpConfig();
  if (!loaded.ok) {
    console.error("mail.smtp.unconfigured", { missing: loaded.missing });
    return { ok: false, reason: "unconfigured" };
  }

  const { config } = loaded;
  const from = headerSafe(config.from);
  const to = headerSafe(config.destination);
  const replyTo = headerSafe(input.replyTo).toLowerCase();
  const subject = headerSafe(input.subject);

  if (!from || !to || !subject || !isValidReplyTo(replyTo)) {
    console.error("mail.smtp.invalid_headers", {
      fromSet: Boolean(from),
      toSet: Boolean(to),
      subjectSet: Boolean(subject),
      replyToValid: isValidReplyTo(replyTo),
    });
    return { ok: false, reason: "send_failed" };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port !== 465,
    authMethod: "PLAIN",
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
    socketTimeout: 20_000,
    tls: {
      minVersion: "TLSv1.2",
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `Bandit Genetics <${from}>`,
      to,
      replyTo,
      envelope: {
        from: headerSafe(config.user) || from,
        to,
      },
      subject,
      text: input.text,
      html: input.html,
    });

    if (info.rejected && info.rejected.length > 0) {
      console.error("mail.smtp.rejected", { count: info.rejected.length });
      return { ok: false, reason: "send_failed" };
    }

    console.info("mail.smtp.accepted", {
      host: config.host,
      port: config.port,
      messageId: info.messageId ? "set" : "missing",
    });
    return { ok: true };
  } catch (error) {
    console.error("mail.smtp.failed", {
      kind: classifySmtpError(error),
      host: config.host,
      port: config.port,
    });
    return { ok: false, reason: "send_failed" };
  }
}
