"use client";

import { useActionState, useId, useState, type FormEvent, type HTMLAttributes } from "react";
import {
  initialContactState,
  submitContact,
} from "@/app/contact/actions";
import { pageCopy } from "@/content/site";
import {
  CONTACT_LIMITS,
  parseContactForm,
  type ContactFieldErrors,
} from "@/lib/contact";
import { cn } from "@/lib/cn";

const copy = pageCopy.contact;

const fieldClassName =
  "min-h-12 w-full rounded-none border border-white/12 bg-black/55 px-3 py-3 font-sans text-copy text-frost outline-none placeholder:text-ice/35 focus-visible:border-gold";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialContactState,
  );
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors>({});
  const formId = useId();
  const statusId = `${formId}-status`;
  const fieldErrors: ContactFieldErrors = pending
    ? {}
    : Object.keys(clientErrors).length > 0
      ? clientErrors
      : (state?.fieldErrors ?? {});
  const showDeliveryError =
    !pending && state?.status === "error" && !hasFieldErrors(fieldErrors);
  const showSuccess = !pending && state?.status === "success";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const parsed = parseContactForm(
      {
        name: readField(form, "name"),
        email: readField(form, "email"),
        subject: readField(form, "subject"),
        message: readField(form, "message"),
      },
      {
        required: copy.required,
        invalidEmail: copy.invalidEmail,
      },
    );

    if (!parsed.ok) {
      event.preventDefault();
      setClientErrors(parsed.fieldErrors);
      return;
    }

    setClientErrors({});
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="border border-white/10 bg-charcoal/95"
      aria-busy={pending}
      aria-describedby={showDeliveryError || showSuccess ? statusId : undefined}
    >
      <div className="grid gap-6 px-5 py-6 md:px-8 md:py-8">
        <Field
          id={`${formId}-name`}
          name="name"
          label={copy.nameLabel}
          autoComplete="name"
          maxLength={CONTACT_LIMITS.name}
          error={fieldErrors.name}
          disabled={pending}
          required
        />

        <Field
          id={`${formId}-email`}
          name="email"
          type="email"
          label={copy.emailLabel}
          autoComplete="email"
          inputMode="email"
          maxLength={CONTACT_LIMITS.email}
          error={fieldErrors.email}
          disabled={pending}
          required
        />

        <Field
          id={`${formId}-subject`}
          name="subject"
          label={copy.subjectLabel}
          autoComplete="off"
          maxLength={CONTACT_LIMITS.subject}
          error={fieldErrors.subject}
          disabled={pending}
          required
        />

        <Field
          id={`${formId}-message`}
          name="message"
          label={copy.messageLabel}
          as="textarea"
          maxLength={CONTACT_LIMITS.message}
          error={fieldErrors.message}
          disabled={pending}
          required
        />

        <div className="sr-only">
          <label htmlFor={`${formId}-website`}>{copy.honeypotLabel}</label>
          <input
            id={`${formId}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {showSuccess ? (
          <p
            id={statusId}
            role="status"
            className="border border-white/10 bg-black/40 px-4 py-3 text-copy leading-relaxed text-ice"
          >
            {copy.success}
          </p>
        ) : null}

        {showDeliveryError ? (
          <p
            id={statusId}
            role="alert"
            className="border border-white/10 bg-black/40 px-4 py-3 text-copy leading-relaxed text-ice"
          >
            {copy.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex min-h-12 w-full items-center justify-center border px-6 font-label text-ui font-semibold tracking-[0.22em] uppercase transition-colors sm:w-auto sm:min-w-[12.5rem]",
            pending
              ? "cursor-wait border-gunmetal bg-gunmetal text-ice/70"
              : "border-frost bg-frost text-black hover:border-ice hover:bg-ice",
          )}
        >
          {pending ? copy.submitting : copy.submit}
        </button>
      </div>
    </form>
  );
}

function hasFieldErrors(errors: ContactFieldErrors) {
  return Object.values(errors).some(Boolean);
}

function readField(form: HTMLFormElement, name: string) {
  const value = new FormData(form).get(name);
  return typeof value === "string" ? value : "";
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  as?: "input" | "textarea";
};

function Field({
  id,
  name,
  label,
  error,
  disabled,
  required,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
  as = "input",
}: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="font-label text-ui tracking-[0.22em] text-ice/70 uppercase"
      >
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          rows={7}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(fieldClassName, "min-h-40 resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={fieldClassName}
        />
      )}
      {error ? (
        <p id={errorId} role="alert" className="text-copy text-gold">
          {error}
        </p>
      ) : null}
    </div>
  );
}
