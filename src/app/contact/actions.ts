"use server";

import { pageCopy } from "@/content/site";
import {
  deliverContactMessage,
  isHoneypotFilled,
  parseContactForm,
  type ContactFormState,
} from "@/lib/contact";

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (isHoneypotFilled(formData.get("website"))) {
    return { status: "success", fieldErrors: {} };
  }

  const parsed = parseContactForm(
    {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    },
    {
      required: pageCopy.contact.required,
      invalidEmail: pageCopy.contact.invalidEmail,
    },
  );

  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }

  try {
    const delivered = await deliverContactMessage(parsed.data);
    if (!delivered.ok) {
      return { status: "error", fieldErrors: {} };
    }
    return { status: "success", fieldErrors: {} };
  } catch {
    return { status: "error", fieldErrors: {} };
  }
}
