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
    console.info("contact.submit.ignored");
    return { status: "unconfigured", fieldErrors: {} };
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
      console.info("contact.delivery.unconfigured");
      return { status: "unconfigured", fieldErrors: {} };
    }
    return { status: "unconfigured", fieldErrors: {} };
  } catch {
    console.error("contact.submit.failed");
    return { status: "error", fieldErrors: {} };
  }
}
