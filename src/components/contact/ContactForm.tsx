"use client";

import { useActionState, useEffect, useId, useRef, useState, type FormEvent, type HTMLAttributes } from "react";
import { submitContact } from "@/app/contact/actions";
import { OrderEmailLink } from "@/components/layout/OrderEmailLink";
import { pageCopy } from "@/content/site";
import {
  CONTACT_FIELD_ORDER,
  CONTACT_LIMITS,
  initialContactState,
  parseContactForm,
  type ContactFieldErrors,
  type ContactParseMessages,
} from "@/lib/contact";
import { revealInvalidControl } from "@/lib/form-focus";
import { cn } from "@/lib/cn";

const copy = pageCopy.contact;

const parseMessages: ContactParseMessages = {
  nameRequired: copy.nameRequired,
  emailRequired: copy.emailRequired,
  invalidEmail: copy.invalidEmail,
  subjectRequired: copy.subjectRequired,
  messageRequired: copy.messageRequired,
};

const fieldClassName =
  "min-h-12 w-full scroll-mt-28 scroll-mb-28 rounded-none border bg-black/55 px-3 py-3 font-sans text-copy text-frost outline-none placeholder:text-ice/35 focus-visible:border-gold";

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
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);
  const fieldErrors = pending ? {} : clientErrors;
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

  useEffect(() => {
    if (wasPending.current && !pending && state?.fieldErrors) {
      setClientErrors(state.fieldErrors);
      if (Object.keys(state.fieldErrors).length > 0) {
        revealFirstInvalidField(formRef.current, state.fieldErrors);
      }
    }
    wasPending.current = pending;
  }, [pending, state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (pending || sent) {
      event.preventDefault();
      return;
    }

    const form = event.currentTarget;
    const parsed = parseContactForm(values, parseMessages);

    if (!parsed.ok) {
      event.preventDefault();
      setClientErrors(parsed.fieldErrors);
      revealFirstInvalidField(form, parsed.fieldErrors);
      return;
    }

    setClientErrors({});
  }

  return (
    <form
      ref={formRef}
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
          onChange={(value) => {
            setValues((current) => ({ ...current, name: value }));
            setClientErrors((current) =>
              updateFieldError(current, { ...values, name: value }, "name"),
            );
          }}
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
          onChange={(value) => {
            setValues((current) => ({ ...current, email: value }));
            setClientErrors((current) =>
              updateFieldError(current, { ...values, email: value }, "email"),
            );
          }}
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
          onChange={(value) => {
            setValues((current) => ({ ...current, subject: value }));
            setClientErrors((current) =>
              updateFieldError(current, { ...values, subject: value }, "subject"),
            );
          }}
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
          onChange={(value) => {
            setValues((current) => ({ ...current, message: value }));
            setClientErrors((current) =>
              updateFieldError(current, { ...values, message: value }, "message"),
            );
          }}
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
            role={showUnexpectedError || showUnconfigured ? "alert" : "status"}
            aria-live={showUnexpectedError || showUnconfigured ? "assertive" : "polite"}
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

function updateFieldError(
  current: ContactFieldErrors,
  values: Record<string, string>,
  field: keyof ContactFieldErrors,
) {
  if (!current[field]) return current;
  const parsed = parseContactForm(values, parseMessages);
  const next = { ...current };
  if (parsed.ok || !parsed.fieldErrors[field]) delete next[field];
  else next[field] = parsed.fieldErrors[field];
  return next;
}

function revealFirstInvalidField(
  form: HTMLFormElement | null,
  errors: ContactFieldErrors,
) {
  const first = CONTACT_FIELD_ORDER.find((key) => errors[key]);
  if (!first) return;
  revealInvalidControl(form?.querySelector<HTMLElement>(`[name="${first}"]`) ?? null);
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
  const classes = cn(
    fieldClassName,
    as === "textarea" ? "min-h-40 resize-y" : "",
    error ? "border-alert focus-visible:border-alert" : "border-white/12",
  );

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
          className={classes}
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
          className={classes}
        />
      )}
      {error ? (
        <p id={errorId} role="alert" className="text-copy text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
