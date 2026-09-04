"use client";

import { useActionState, useId, useState, type FormEvent, type HTMLAttributes } from "react";
import { submitContact } from "@/app/contact/actions";
import { OrderEmailLink } from "@/components/layout/OrderEmailLink";
import { pageCopy } from "@/content/site";
import {
  CONTACT_LIMITS,
  initialContactState,
  parseContactForm,
  type ContactFieldErrors,
} from "@/lib/contact";
import { cn } from "@/lib/cn";

const copy = pageCopy.contact;

const fieldClassName =
  "min-h-12 w-full rounded-none border border-white/12 bg-black/55 px-3 py-3 font-sans text-copy text-frost outline-none placeholder:text-ice/35 focus-visible:border-gold";

export function ContactForm({
  selectedStrain,
}: {
  selectedStrain?: { slug: string; name: string };
}) {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialContactState,
  );
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors>({});
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: selectedStrain ? `Inquiry · ${selectedStrain.name}` : "",
    message: selectedStrain
      ? `I want to inquire about ${selectedStrain.name}. Looking for a custom bulk seed order.`
      : "",
  });
  const formId = useId();
  const statusId = `${formId}-status`;
  const fieldErrors: ContactFieldErrors = pending
    ? {}
    : Object.keys(clientErrors).length > 0
      ? clientErrors
      : (state?.fieldErrors ?? {});
  const showFieldErrors = hasFieldErrors(fieldErrors);
  const sent = !pending && state?.status === "success";
  const locked = pending || sent;
  const showUnconfigured =
    !pending && state?.status === "unconfigured" && !showFieldErrors;
  const showUnexpectedError =
    !pending && state?.status === "error" && !showFieldErrors;
  const statusMessage = sent
    ? copy.success
    : showUnconfigured
      ? copy.unconfigured
      : showUnexpectedError
        ? copy.error
        : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (pending || sent) {
      event.preventDefault();
      return;
    }

    const form = event.currentTarget;
    const parsed = parseContactForm(
      {
        name: values.name,
        email: values.email,
        subject: values.subject,
        message: values.message,
      },
      {
        required: copy.required,
        invalidEmail: copy.invalidEmail,
      },
    );

    if (!parsed.ok) {
      event.preventDefault();
      setClientErrors(parsed.fieldErrors);
      const firstInvalid = Object.keys(parsed.fieldErrors)[0];
      if (firstInvalid) {
        form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      }
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
      aria-describedby={statusMessage ? statusId : undefined}
    >
      <div className="grid gap-6 px-5 py-6 md:px-8 md:py-8">
        {selectedStrain ? (
          <p className="font-label text-ui tracking-[0.16em] text-gold uppercase">
            Selected file: {selectedStrain.name}
          </p>
        ) : null}
        <Field
          id={`${formId}-name`}
          name="name"
          label={copy.nameLabel}
          autoComplete="name"
          maxLength={CONTACT_LIMITS.name}
          error={fieldErrors.name}
          disabled={locked}
          value={values.name}
          onChange={(value) => setValues((current) => ({ ...current, name: value }))}
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
          disabled={locked}
          value={values.email}
          onChange={(value) => setValues((current) => ({ ...current, email: value }))}
          required
        />

        <Field
          id={`${formId}-subject`}
          name="subject"
          label={copy.subjectLabel}
          autoComplete="off"
          maxLength={CONTACT_LIMITS.subject}
          error={fieldErrors.subject}
          disabled={locked}
          value={values.subject}
          onChange={(value) => setValues((current) => ({ ...current, subject: value }))}
          required
        />

        <Field
          id={`${formId}-message`}
          name="message"
          label={copy.messageLabel}
          as="textarea"
          maxLength={CONTACT_LIMITS.message}
          error={fieldErrors.message}
          disabled={locked}
          value={values.message}
          onChange={(value) => setValues((current) => ({ ...current, message: value }))}
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

        {statusMessage ? (
          <p
            id={statusId}
            role={showUnexpectedError ? "alert" : "status"}
            aria-live={showUnexpectedError ? "assertive" : "polite"}
            className="break-words border border-white/10 bg-black/40 px-4 py-3 text-copy leading-relaxed text-ice"
          >
            {sent ? (
              statusMessage
            ) : (
              <>
                {statusMessage} <OrderEmailLink />.
              </>
            )}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={locked}
          aria-disabled={locked}
          className={cn(
            "inline-flex min-h-12 w-full items-center justify-center border px-6 font-label text-ui font-semibold tracking-[0.22em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto sm:min-w-[12.5rem]",
            locked
              ? "cursor-not-allowed border-gunmetal bg-gunmetal text-ice/70"
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
  value: string;
  onChange: (value: string) => void;
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
  value,
  onChange,
}: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="font-label text-ui tracking-[0.22em] text-gold uppercase"
      >
        {label}
        {required ? (
          <span className="font-sans tracking-normal text-ice/70 normal-case">
            {" "}
            <span aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </span>
        ) : null}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          aria-required={required || undefined}
          disabled={disabled}
          maxLength={maxLength}
          rows={7}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(fieldClassName, "min-h-40 resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          aria-required={required || undefined}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
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
