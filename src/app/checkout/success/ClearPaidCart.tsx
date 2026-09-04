"use client";

import { useCart } from "@/components/cart/CartProvider";
import { useEffect, useRef } from "react";

const PREFIX = "bandit-cleared-order:";

export function ClearPaidCart({ orderId }: { orderId: string }) {
  const { clear, ready } = useCart();
  const ran = useRef(false);

  useEffect(() => {
    if (!ready || ran.current) return;
    const key = `${PREFIX}${orderId}`;
    if (window.sessionStorage.getItem(key) === "1") return;
    ran.current = true;
    clear();
    window.sessionStorage.setItem(key, "1");
  }, [clear, orderId, ready]);

  return null;
}
