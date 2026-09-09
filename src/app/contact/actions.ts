"use server";

import { pageCopy } from "@/content/site";
import {
  isHoneypotFilled,
  parseContactForm,
  type ContactFormState,
} from "@/lib/contact";
import { deliverContactMessage } from "@/lib/contact-delivery";

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (isHoneypotFilled(formData.get("website"))) {
    console.info("contact.submit.ignored");
    return { status: "idle", fieldErrors: {} };
  }

  const parsed = parseContactForm(
    {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    },
    {
      nameRequired: pageCopy.contact.nameRequired,
      emailRequired: pageCopy.contact.emailRequired,
      invalidEmail: pageCopy.contact.invalidEmail,
      subjectRequired: pageCopy.contact.subjectRequired,
      messageRequired: pageCopy.contact.messageRequired,
    },
  );

  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }

  try {
    const delivered = await deliverContactMessage(parsed.data);
    if (!delivered.ok) {
      if (delivered.reason === "unconfigured") {
        console.error("CONTACT_ACTION_FAILED", { stage: "smtp_unconfigured" });
        return { status: "unconfigured", fieldErrors: {} };
      }
      console.error("CONTACT_ACTION_FAILED", { stage: "smtp_rejected" });
      return { status: "error", fieldErrors: {} };
    }
    return { status: "success", fieldErrors: {} };
  } catch {
    console.error("CONTACT_ACTION_FAILED", { stage: "submit" });
    return { status: "error", fieldErrors: {} };
  }
}
