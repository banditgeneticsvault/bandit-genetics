"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { cartCopy } from "@/content/cart";

export function CartToast() {
  const { notice, dismissNotice, openCart } = useCart();
  const [attentionKey, setAttentionKey] = useState(0);
  const seenNotice = useRef(notice);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(dismissNotice, 3200);
    return () => window.clearTimeout(timer);
  }, [dismissNotice, notice]);

  useEffect(() => {
    if (!notice) {
      seenNotice.current = null;
      return;
    }
    if (seenNotice.current && seenNotice.current !== notice) {
      setAttentionKey((key) => key + 1);
    }
    seenNotice.current = notice;
  }, [notice]);

  if (!notice) return null;

  return (
    <div
      key={attentionKey}
      role="status"
      className="cart-notice-attention fixed bottom-5 left-1/2 z-50 w-[min(28rem,calc(100%-2rem))] -translate-x-1/2 border border-gold/50 bg-black/95 px-4 py-3"
    >
      <p className="font-label text-ui tracking-[0.14em] text-gold uppercase">
        {notice.message}
      </p>
      <p className="mt-1 text-copy text-ice">{cartCopy.added}</p>
      <button
        type="button"
        onClick={() => {
          dismissNotice();
          openCart();
        }}
        className="mt-3 min-h-11 w-full border border-frost px-3 font-label text-ui tracking-[0.18em] text-frost uppercase hover:bg-frost hover:text-black"
      >
        {cartCopy.toastView}
      </button>
    </div>
  );
}
