"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AGE_COOKIE_NAME,
  AGE_COOKIE_VALUE,
  safeAgeGateReturnPath,
} from "@/lib/age-gate";

export async function confirmAdultAge(formData: FormData) {
  const store = await cookies();
  store.set(AGE_COOKIE_NAME, AGE_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  redirect(safeAgeGateReturnPath(formData.get("from")));
}
