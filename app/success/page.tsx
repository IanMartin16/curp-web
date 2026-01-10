// app/success/page.tsx
import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Cargando...</div>}>
      <SuccessClient />
    </Suspense>
  );
}

