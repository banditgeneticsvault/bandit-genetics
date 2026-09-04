import {
  canAddToCart,
  clampCartQuantity,
  isVariantId,
  toOrderListing,
  type CartLine,
  type VariantId,
} from "@/data/order";
import { resolveCartLine } from "@/lib/cart";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "bandit-cart-v4";
const LEGACY_STORAGE_KEY = "bandit-cart-v3";
const EMPTY: CartLine[] = [];

type Notice = { message: string } | null;
type PendingAdd = { productId: string; name: string } | null;

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  open: boolean;
  notice: Notice;
  pendingAdd: PendingAdd;
  add: (productId: string, variantId: VariantId) => boolean;
  setSeedTier: (
    productId: string,
    currentVariantId: VariantId,
    nextVariantId: VariantId,
  ) => void;
  setLineQuantity: (
    productId: string,
    variantId: VariantId,
    quantity: number,
  ) => void;
  remove: (productId: string, variantId: VariantId) => void;
  clear: () => void;
  beginAdd: (productId: string, name: string) => void;
  cancelAdd: () => void;
  openCart: () => void;
  closeCart: () => void;
  dismissNotice: () => void;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function sanitize(lines: CartLine[]): CartLine[] {
  const merged = new Map<string, CartLine>();
  for (const line of lines) {
    if (!isVariantId(line.variantId)) continue;
    const listing = toOrderListing(line.productId);
    if (!listing || !canAddToCart(listing.orderState)) continue;
    const resolved = resolveCartLine({
      productId: listing.productId,
      variantId: line.variantId,
      quantity: clampCartQuantity(line.quantity),
    });
    if ("error" in resolved) continue;
    const key = `${listing.productId}:${line.variantId}`;
    const existing = merged.get(key);
    const quantity = existing
      ? clampCartQuantity(existing.quantity + resolved.quantity)
      : resolved.quantity;
    merged.set(key, {
      productId: listing.productId,
      variantId: line.variantId,
      quantity,
    });
  }
  return [...merged.values()];
}

function readStorage(): CartLine[] {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return EMPTY;
    const sanitized = sanitize(parsed as CartLine[]);
    return sanitized.length === 0 ? EMPTY : sanitized;
  } catch {
    return EMPTY;
  }
}

function writeStorage(lines: CartLine[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
}

const memory: {
  lines: CartLine[];
  hydrated: boolean;
  open: boolean;
  notice: Notice;
  pendingAdd: PendingAdd;
  listeners: Set<() => void>;
} = {
  lines: EMPTY,
  hydrated: false,
  open: false,
  notice: null,
  pendingAdd: null,
  listeners: new Set(),
};

function emit() {
  for (const listener of memory.listeners) listener();
}

function subscribe(listener: () => void) {
  memory.listeners.add(listener);
  return () => {
    memory.listeners.delete(listener);
  };
}

function getLinesSnapshot() {
  return memory.hydrated ? memory.lines : EMPTY;
}

function getReadySnapshot() {
  return memory.hydrated;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getLinesSnapshot, () => EMPTY);
  const ready = useSyncExternalStore(subscribe, getReadySnapshot, () => false);
  const open = useSyncExternalStore(
    subscribe,
    () => memory.open,
    () => false,
  );
  const notice = useSyncExternalStore(
    subscribe,
    () => memory.notice,
    () => null,
  );
  const pendingAdd = useSyncExternalStore(
    subscribe,
    () => memory.pendingAdd,
    () => null,
  );

  useEffect(() => {
    memory.lines = readStorage();
    memory.hydrated = true;
    emit();
  }, []);

  const persist = useCallback((next: CartLine[]) => {
    const sanitized = sanitize(next);
    memory.lines = sanitized.length === 0 ? EMPTY : sanitized;
    writeStorage(sanitized);
    emit();
  }, []);

  const add = useCallback(
    (productId: string, variantId: VariantId) => {
      const listing = toOrderListing(productId);
      if (!listing || !canAddToCart(listing.orderState)) return false;
      if (!isVariantId(variantId)) return false;
      const current = memory.hydrated ? memory.lines : readStorage();
      const match = current.find(
        (line) =>
          line.productId === listing.productId && line.variantId === variantId,
      );
      if (match) {
        persist(
          current.map((line) =>
            line.productId === listing.productId && line.variantId === variantId
              ? {
                  ...line,
                  quantity: clampCartQuantity(line.quantity + 1),
                }
              : line,
          ),
        );
      } else {
        persist(
          sanitize([
            ...current,
            {
              productId: listing.productId,
              variantId,
              quantity: 1,
            },
          ]),
        );
      }
      memory.notice = { message: listing.name };
      memory.pendingAdd = null;
      emit();
      return true;
    },
    [persist],
  );

  const setSeedTier = useCallback(
    (
      productId: string,
      currentVariantId: VariantId,
      nextVariantId: VariantId,
    ) => {
      if (!isVariantId(nextVariantId)) return;
      if (currentVariantId === nextVariantId) return;
      const current = memory.hydrated ? memory.lines : readStorage();
      const moving = current.find(
        (line) =>
          line.productId === productId && line.variantId === currentVariantId,
      );
      const movingQty = clampCartQuantity(moving?.quantity);
      const withoutCurrent = current.filter(
        (line) =>
          !(line.productId === productId && line.variantId === currentVariantId),
      );
      const existingNext = withoutCurrent.find(
        (line) =>
          line.productId === productId && line.variantId === nextVariantId,
      );
      persist(
        existingNext
          ? withoutCurrent.map((line) =>
              line.productId === productId && line.variantId === nextVariantId
                ? {
                    ...line,
                    quantity: clampCartQuantity(line.quantity + movingQty),
                  }
                : line,
            )
          : [
              ...withoutCurrent,
              { productId, variantId: nextVariantId, quantity: movingQty },
            ],
      );
    },
    [persist],
  );

  const setLineQuantity = useCallback(
    (productId: string, variantId: VariantId, quantity: number) => {
      const current = memory.hydrated ? memory.lines : readStorage();
      if (quantity < 1) {
        persist(
          current.filter(
            (line) =>
              !(line.productId === productId && line.variantId === variantId),
          ),
        );
        return;
      }
      persist(
        current.map((line) =>
          line.productId === productId && line.variantId === variantId
            ? { ...line, quantity: clampCartQuantity(quantity) }
            : line,
        ),
      );
    },
    [persist],
  );

  const remove = useCallback(
    (productId: string, variantId: VariantId) => {
      const current = memory.hydrated ? memory.lines : readStorage();
      persist(
        current.filter(
          (line) =>
            !(line.productId === productId && line.variantId === variantId),
        ),
      );
    },
    [persist],
  );

  const clear = useCallback(() => persist([]), [persist]);
  const beginAdd = useCallback((productId: string, name: string) => {
    memory.pendingAdd = { productId, name };
    emit();
  }, []);
  const cancelAdd = useCallback(() => {
    memory.pendingAdd = null;
    emit();
  }, []);
  const openCart = useCallback(() => {
    memory.open = true;
    emit();
  }, []);
  const closeCart = useCallback(() => {
    memory.open = false;
    emit();
  }, []);
  const dismissNotice = useCallback(() => {
    memory.notice = null;
    emit();
  }, []);

  const value = useMemo(
    () => ({
      lines,
      ready,
      open,
      notice,
      pendingAdd,
      add,
      setSeedTier,
      setLineQuantity,
      remove,
      clear,
      beginAdd,
      cancelAdd,
      openCart,
      closeCart,
      dismissNotice,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    }),
    [
      add,
      beginAdd,
      cancelAdd,
      clear,
      closeCart,
      dismissNotice,
      lines,
      notice,
      open,
      openCart,
      pendingAdd,
      ready,
      remove,
      setLineQuantity,
      setSeedTier,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used within CartProvider.");
  }
  return value;
}
