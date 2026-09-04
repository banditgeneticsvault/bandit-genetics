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

export type ContactFormStatus = "idle" | "unconfigured" | "error";

export type ContactFormState = {
  status: ContactFormStatus;
  fieldErrors: ContactFieldErrors;
};

export const initialContactState: ContactFormState = {
  status: "idle",
  fieldErrors: {},
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseContactForm(
  input: Record<string, unknown>,
  messages: { required: string; invalidEmail: string },
): { ok: true; data: ContactFields } | { ok: false; fieldErrors: ContactFieldErrors } {
  const name = normalizeLine(input.name, CONTACT_LIMITS.name);
  const email = normalizeLine(input.email, CONTACT_LIMITS.email).toLowerCase();
  const subject = normalizeLine(input.subject, CONTACT_LIMITS.subject);
  const message = normalizeMessage(input.message, CONTACT_LIMITS.message);

  const fieldErrors: ContactFieldErrors = {};

  if (!name) fieldErrors.name = messages.required;
  if (!email) fieldErrors.email = messages.required;
  else if (!EMAIL_PATTERN.test(email)) fieldErrors.email = messages.invalidEmail;
  if (!subject) fieldErrors.subject = messages.required;
  if (!message) fieldErrors.message = messages.required;

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return { ok: true, data: { name, email, subject, message } };
}

export function isHoneypotFilled(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Email delivery is not wired. Keep this function as the single server-side
 * seam so a provider can be added without changing the form.
 */
export async function deliverContactMessage(
  payload: ContactFields,
): Promise<{ ok: true } | { ok: false; reason: "unconfigured" }> {
  void payload.name;
  return { ok: false, reason: "unconfigured" };
}

function normalizeLine(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function normalizeMessage(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().slice(0, max);
}
