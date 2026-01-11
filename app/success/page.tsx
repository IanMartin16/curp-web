// app/success/page.tsx
import SuccessClient from "./success-client";

export default function SuccessPage({ searchParams }: any) {
  const sessionId = searchParams?.session_id as string | undefined;
  return <SuccessClient sessionId={sessionId} />;
}

