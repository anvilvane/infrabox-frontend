"use client";

import * as React from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const CONTACT_EMAIL = "hello@infrabox.io";

type FieldErrors = Partial<
  Record<"name" | "email" | "mailboxes" | "sendingTool" | "message", string>
>;

const FIELD_BASE =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/70 transition-colors hover:border-ring/40";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const headingRef = React.useRef<HTMLParagraphElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrors({});
    setFormError(null);

    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      mailboxes: data.get("mailboxes"),
      sendingTool: data.get("sendingTool"),
      message: data.get("message"),
    };

    // This build is the marketing front end only — there is no server to post
    // to. The message is handed to the visitor's own mail client instead, so
    // the form does something real rather than pretending to have sent it.
    const body = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Mailboxes: ${payload.mailboxes}`,
      `Sending tool: ${payload.sendingTool}`,
      "",
      String(payload.message ?? ""),
    ].join(String.fromCharCode(10));

    window.location.href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent("Infrabox enquiry")}` +
      `&body=${encodeURIComponent(body)}`;

    setStatus("done");
  }

  React.useEffect(() => {
    if (status === "done") headingRef.current?.focus();
  }, [status]);

  if (status === "done") {
    return (
      <div
        className="rounded-xl border border-border p-8"
        role="status"
        aria-live="polite"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-success text-success-foreground">
          <Check aria-hidden className="size-4" />
        </span>
        <p
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 text-lg font-semibold tracking-[-0.01em]"
        >
          Your mail client should be open.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Send the drafted message and we will come back to you with a real
          number for the volume you described. If nothing opened, write to{" "}
          <a className="font-medium text-brand hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {formError ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {formError}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(FIELD_BASE, errors.name && "border-destructive")}
          />
        </Field>

        <Field id="email" label="Work email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(FIELD_BASE, errors.email && "border-destructive")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="mailboxes"
          label="Mailboxes you need"
          hint="A rough number is fine."
          error={errors.mailboxes}
        >
          <input
            id="mailboxes"
            name="mailboxes"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 250"
            required
            aria-invalid={Boolean(errors.mailboxes)}
            aria-describedby={cn(
              "mailboxes-hint",
              errors.mailboxes && "mailboxes-error",
            )}
            className={cn(FIELD_BASE, errors.mailboxes && "border-destructive")}
          />
        </Field>

        <Field
          id="sendingTool"
          label="Sending tool"
          hint="Optional — what you send with today."
          error={errors.sendingTool}
        >
          <input
            id="sendingTool"
            name="sendingTool"
            type="text"
            placeholder="e.g. Smartlead, Instantly, in-house"
            aria-describedby="sendingTool-hint"
            className={FIELD_BASE}
          />
        </Field>
      </div>

      <Field
        id="message"
        label="Anything else"
        hint="Optional. Domains you already own, timelines, constraints."
        error={errors.message}
      >
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-describedby="message-hint"
          className={cn(FIELD_BASE, "resize-y")}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 aria-hidden className="animate-spin" />
              Sending
            </>
          ) : (
            <>
              Send enquiry
              <ArrowRight aria-hidden />
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          We use this to reply to you. Nothing else.
        </p>
      </div>
    </form>
  );
}
