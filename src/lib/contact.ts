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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseContactForm(
  input: Record<string, unknown>,
  messages: { required: string; invalidEmail: string },
): { ok: true; data: ContactFields } | { ok: false; fieldErrors: ContactFieldErrors } {
  const name = normalize(input.name, CONTACT_LIMITS.name);
  const email = normalize(input.email, CONTACT_LIMITS.email).toLowerCase();
  const subject = normalize(input.subject, CONTACT_LIMITS.subject);
  const message = normalize(input.message, CONTACT_LIMITS.message);

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
 * Email delivery is not wired yet. Keep this function as the single server-side
 * seam so a provider can be added without changing the form.
 */
export async function deliverContactMessage(
  payload: ContactFields,
): Promise<{ ok: boolean }> {
  void payload;
  return { ok: false };
}

function normalize(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}
