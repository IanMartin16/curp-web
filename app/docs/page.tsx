import { redirect } from "next/navigation"; // public/openapi.yaml

export default function DocsPage() {
  redirect("/docs/swagger/index.html");
}