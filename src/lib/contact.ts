export const CONTACT_LIMITS = {
  name: 80,
  email: 254,
  subject: 120,
  message: 4000,
} as const;

export type ContactFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactFields, string>>;

export type ContactFormStatus = "idle" | "success" | "unconfigured" | "error";

export type ContactFormState = {
  status: ContactFormStatus;
  fieldErrors: ContactFieldErrors;
};

export const initialContactState: ContactFormState = {
  status: "idle",
  fieldErrors: {},
};

export const CONTACT_FIELD_ORDER = [
  "name",
  "email",
  "subject",
  "message",
] as const;

export type ContactParseMessages = {
  nameRequired: string;
  emailRequired: string;
  invalidEmail: string;
  subjectRequired: string;
  messageRequired: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseContactForm(
  input: Record<string, unknown>,
  messages: ContactParseMessages,
): { ok: true; data: ContactFields } | { ok: false; fieldErrors: ContactFieldErrors } {
  const name = normalizeLine(input.name, CONTACT_LIMITS.name);
  const email = normalizeLine(input.email, CONTACT_LIMITS.email).toLowerCase();
  const subject = normalizeLine(input.subject, CONTACT_LIMITS.subject);
  const message = normalizeMessage(input.message, CONTACT_LIMITS.message);

  const fieldErrors: ContactFieldErrors = {};

  if (!name) fieldErrors.name = messages.nameRequired;
  if (!email) fieldErrors.email = messages.emailRequired;
  else if (!EMAIL_PATTERN.test(email)) fieldErrors.email = messages.invalidEmail;
  if (!subject) fieldErrors.subject = messages.subjectRequired;
  if (!message) fieldErrors.message = messages.messageRequired;

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return { ok: true, data: { name, email, subject, message } };
}

export function isHoneypotFilled(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeLine(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function normalizeMessage(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().slice(0, max);
}
