// lib/subscriptions.ts

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export interface SubscriptionRecord {
  customerId: string;
  customerEmail?: string | null;
  priceId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: number; // timestamp (segundos)
}

// ⚠️ Solo para pruebas: en producción real usar BD.
// En Vercel esto no es persistente entre ejecuciones.
const subscriptions = new Map<string, SubscriptionRecord>();

export function upsertSubscription(rec: SubscriptionRecord) {
  subscriptions.set(rec.customerId, rec);
  console.log("[SUBSCRIPTION UPSERT]", rec);
}

export function deleteSubscription(customerId: string) {
  subscriptions.delete(customerId);
  console.log("[SUBSCRIPTION DELETE]", { customerId });
}

export function getSubscription(customerId: string) {
  return subscriptions.get(customerId);
}

// Ejemplo: saber si un customer tiene plan activo
export function hasActiveSubscription(customerId: string) {
  const sub = subscriptions.get(customerId);
  return sub?.status === "active";
}
