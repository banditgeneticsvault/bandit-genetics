import { redirect } from "next/navigation";

export default function CryptoCheckoutRedirect() {
  redirect("/checkout");
}
