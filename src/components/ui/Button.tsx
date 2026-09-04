"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type LinkButtonProps = SharedProps & {
  href: string;
  type?: never;
  onClick?: () => void;
  disabled?: never;
};

type NativeButtonProps = SharedProps & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  form?: string;
  name?: string;
  value?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
};

type ButtonProps = LinkButtonProps | NativeButtonProps;

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-frost bg-frost text-black hover:bg-ice hover:border-ice",
  secondary:
    "border-gunmetal bg-transparent text-ice hover:border-gold hover:text-gold",
};

const baseClassName =
  "inline-flex min-h-12 w-full items-center justify-center border px-6 text-center font-label text-ui font-semibold tracking-[0.22em] uppercase transition-colors sm:w-auto sm:min-w-[12.5rem]";

export function Button(props: ButtonProps) {
  const { children, variant = "primary", className } = props;
  const classes = cn(
    baseClassName,
    variants[variant],
    "href" in props && props.href ? undefined : props.disabled && "cursor-not-allowed opacity-50",
    className,
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} onClick={props.onClick} className={classes}>
        {children}
      </Link>
    );
  }

  const native = props as NativeButtonProps;
  return (
    <button
      type={native.type ?? "button"}
      disabled={native.disabled}
      onClick={native.onClick}
      form={native.form}
      name={native.name}
      value={native.value}
      aria-label={native["aria-label"]}
      aria-describedby={native["aria-describedby"]}
      className={classes}
    >
      {children}
    </button>
  );
}
