"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const [msg, setMsg] = useState("Confirmando pago...");

  useEffect(() => {
    const sessionId = sp.get("session_id");
    if (!sessionId) {
      setMsg("Falta session_id");
      return;
    }

    // aquí después llamaremos a tu endpoint para revelar key
    setMsg("Pago confirmado. Redirigiendo al dashboard...");
    setTimeout(() => router.push("/dashboard"), 1200);
  }, [sp, router]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Pago exitoso ✅</h1>
      <p>{msg}</p>
    </div>
  );
}
