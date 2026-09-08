"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { AGE_COOKIE_NAME, AGE_COOKIE_VALUE } from "@/lib/age-gate";

export async function confirmAdultAge() {
  const store = await cookies();
  store.set(AGE_COOKIE_NAME, AGE_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // Session cookie: omitted maxAge so confirmation lasts for this browsing session only.
  });
  revalidatePath("/", "layout");
}
