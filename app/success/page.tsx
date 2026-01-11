// app/success/page.tsx
import SuccessClient from "./SuccessClient";

export const dynamic = "force-dynamic"; // importante para que no lo intente pre-render estático

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string | string[]};
}) {
  const raw = searchParams?.session_id;  
  const sessionId = Array.isArray(raw) ? raw[0] : raw ?? null;

  return <SuccessClient sessionId={sessionId} />;
}
