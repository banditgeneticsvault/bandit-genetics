import "server-only";

import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

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

function envValue(value: string | undefined) {
  return value?.trim() || "";
}

function smtpPresence() {
  return {
    vercelEnv: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    CONTACT_SMTP_HOST: Boolean(envValue(process.env.CONTACT_SMTP_HOST) || envValue(process.env.SMTP_HOST)),
    CONTACT_SMTP_PORT: Boolean(envValue(process.env.CONTACT_SMTP_PORT) || envValue(process.env.SMTP_PORT)),
    CONTACT_SMTP_USER: Boolean(envValue(process.env.CONTACT_SMTP_USER) || envValue(process.env.SMTP_USER)),
    CONTACT_SMTP_PASSWORD: Boolean(
      envValue(process.env.CONTACT_SMTP_PASSWORD) || envValue(process.env.SMTP_PASSWORD),
    ),
    EMAIL_FROM: Boolean(envValue(process.env.EMAIL_FROM) || envValue(process.env.CONTACT_FROM_EMAIL)),
    CONTACT_DESTINATION_EMAIL: Boolean(
      envValue(process.env.CONTACT_DESTINATION_EMAIL) ||
        envValue(process.env.CONTACT_NOTIFICATION_EMAIL) ||
        envValue(process.env.ORDER_NOTIFICATION_EMAIL),
    ),
  };
}

function readPort() {
  const raw =
    envValue(process.env.CONTACT_SMTP_PORT) || envValue(process.env.SMTP_PORT);
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
  const host =
    envValue(process.env.CONTACT_SMTP_HOST) ||
    envValue(process.env.SMTP_HOST) ||
    DEFAULT_SMTP_HOST;
  const port = readPort();
  const user =
    envValue(process.env.CONTACT_SMTP_USER) || envValue(process.env.SMTP_USER);
  const pass =
    envValue(process.env.CONTACT_SMTP_PASSWORD) ||
    envValue(process.env.SMTP_PASSWORD);
  const fromRaw =
    envValue(process.env.EMAIL_FROM) ||
    envValue(process.env.CONTACT_FROM_EMAIL) ||
    user;
  const destinationRaw =
    envValue(process.env.CONTACT_DESTINATION_EMAIL) ||
    envValue(process.env.CONTACT_NOTIFICATION_EMAIL) ||
    envValue(process.env.ORDER_NOTIFICATION_EMAIL);

  const missing: string[] = [];
  if (!user) missing.push("CONTACT_SMTP_USER");
  if (!pass) missing.push("CONTACT_SMTP_PASSWORD");
  if (port === null) missing.push("CONTACT_SMTP_PORT");
  if (missing.length > 0) {
    return { ok: false, missing };
  }

  const authorizedUser = resolveAuthorizedAddress(user) || SUPPORT_ADDRESS;
  const from =
    resolveAuthorizedAddress(fromRaw) || authorizedUser || SUPPORT_ADDRESS;

  return {
    ok: true,
    config: {
      host,
      port: port as number,
      user,
      pass,
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
    return "SMTP_AUTH_FAILED";
  }
  if (
    code === "ECONNECTION" ||
    code === "ETIMEDOUT" ||
    code === "ESOCKET" ||
    code === "EDNS" ||
    code === "ENOTFOUND" ||
    code === "EHOSTUNREACH"
  ) {
    return "SMTP_CONNECTION_FAILED";
  }
  if (command === "MAIL FROM" || responseCode === 553) {
    return "SMTP_REJECTED";
  }
  if (command === "RCPT TO" || response.includes("recipient")) {
    return "SMTP_REJECTED";
  }
  return "SMTP_SEND_FAILED";
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
    console.error("SMTP_NOT_CONFIGURED", {
      missing: loaded.missing,
      present: smtpPresence(),
    });
    return { ok: false, reason: "unconfigured" };
  }

  const { config } = loaded;
  const from = headerSafe(config.from);
  const to = headerSafe(config.destination);
  const replyTo = headerSafe(input.replyTo).toLowerCase();
  const subject = headerSafe(input.subject);

  if (!from || !to || !subject || !isValidReplyTo(replyTo)) {
    console.error("SMTP_SEND_FAILED", {
      reason: "invalid_headers",
      fromSet: Boolean(from),
      toSet: Boolean(to),
      subjectSet: Boolean(subject),
      replyToValid: isValidReplyTo(replyTo),
    });
    return { ok: false, reason: "send_failed" };
  }

  // Force IPv4. Vercel serverless DNS often fails or times out on IPv6 for Proton SMTP.
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
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 15_000,
    family: 4,
    tls: {
      minVersion: "TLSv1.2",
    },
  } as SMTPTransport.Options);

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
      console.error("SMTP_REJECTED", {
        count: info.rejected.length,
        host: config.host,
        port: config.port,
        vercelEnv: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
      });
      return { ok: false, reason: "send_failed" };
    }

    console.info("SMTP_ACCEPTED", {
      host: config.host,
      port: config.port,
      messageId: info.messageId ? "set" : "missing",
      vercelEnv: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    });
    return { ok: true };
  } catch (error) {
    console.error(classifySmtpError(error), {
      host: config.host,
      port: config.port,
      vercelEnv: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    });
    return { ok: false, reason: "send_failed" };
  } finally {
    transporter.close();
  }
}
