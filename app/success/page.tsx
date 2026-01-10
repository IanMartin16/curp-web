// app/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [msg, setMsg] = useState("Confirmando pago...");

  useEffect(() => {
    const sessionId = sp.get("session_id");
    if (!sessionId) {
      setMsg("Falta session_id");
      return;
    }

    // aquí luego haremos: llamar a /api/reveal-key (en curp-web)
    // por ahora solo redirige:
    setTimeout(() => router.push("/dashboard"), 1200);
  }, [sp, router]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Pago exitoso ✅</h1>
      <p>{msg}</p>
    </div>
  );
}
