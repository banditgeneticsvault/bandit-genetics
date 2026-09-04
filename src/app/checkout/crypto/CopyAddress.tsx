"use client";

import { cartCopy } from "@/content/cart";
import { useState } from "react";

export function CopyAddress({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="grid gap-3">
      <p className="break-all font-mono text-copy text-frost">{value}</p>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 w-full items-center justify-center border border-frost px-4 font-label text-ui tracking-[0.18em] text-frost uppercase hover:bg-frost hover:text-black sm:w-auto"
      >
        {copied ? cartCopy.cryptoCopied : cartCopy.cryptoCopy}
      </button>
    </div>
  );
}
