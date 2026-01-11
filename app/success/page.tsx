// app/success/page.tsx
import SuccessClient from "./SuccessClient";

export const dynamic = "force-dynamic"; // importante para que no lo intente pre-render estático

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams?.session_id || null;

  return <SuccessClient sessionId={sessionId} />;
}
