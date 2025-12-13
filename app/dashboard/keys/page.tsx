import ApiKeysPanel from "./ApiKeysPanel";

export default function KeysPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-white px-6 md:px-12 py-10">
      <h1 className="text-3xl font-bold mb-2">API Keys</h1>
      <p className="text-gray-300 mb-8">
        Genera, copia y revoca keys (admin).
      </p>

      <ApiKeysPanel />
    </div>
  );
}
