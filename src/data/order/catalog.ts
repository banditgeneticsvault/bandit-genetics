import { getStrainById, getStrainBySlug, getStrains } from "@/data/genetics";
import { SEED_TIERS } from "./packs";
import type { OrderListing, OrderState } from "./types";

export function inferOrderState(availability: string): OrderState {
  const value = availability.trim().toUpperCase();
  if (value === "SOLD OUT" || value === "SOLDOUT") return "SOLD_OUT";
  if (value === "LOW STOCK" || value === "LOW_STOCK") return "LOW_STOCK";
  if (value === "AVAILABLE") return "AVAILABLE";
  if (value === "INQUIRY ONLY" || value === "INQUIRY_ONLY") return "INQUIRY_ONLY";
  if (value.includes("COMING SOON") || value === "INFORMATION COMING SOON") {
    return "COMING_SOON";
  }
  return "INQUIRY_ONLY";
}

export function canAddToCart(state: OrderState): boolean {
  return state === "AVAILABLE" || state === "LOW_STOCK" || state === "COMING_SOON";
}

export function toOrderListing(slugOrId: string): OrderListing | undefined {
  const strain = getStrainBySlug(slugOrId) ?? getStrainById(slugOrId);
  if (!strain) return undefined;

  return {
    productId: strain.id,
    slug: strain.slug,
    name: strain.name,
    type: strain.type,
    lineage: strain.lineage,
    orderState: inferOrderState(strain.availability),
    seedTiers: SEED_TIERS,
    packOptions: SEED_TIERS,
  };
}

export function getOrderListings(): OrderListing[] {
  return getStrains()
    .map((strain) => toOrderListing(strain.slug))
    .filter((listing): listing is OrderListing => listing !== undefined);
}

export const ORDER_STATE_LABELS: Record<OrderState, string> = {
  AVAILABLE: "AVAILABLE",
  LOW_STOCK: "LOW STOCK",
  SOLD_OUT: "SOLD OUT",
  COMING_SOON: "COMING SOON",
  INQUIRY_ONLY: "INQUIRY ONLY",
};
