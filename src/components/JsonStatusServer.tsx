// src/components/JsonStatusServer.tsx
import "server-only";

export default async function JsonStatusServer() {
  // Use env var if defined, otherwise fallback to localhost URL
  const url =
    process.env.BACKEND_JSON_URL ?? "http://api-service:3000/api/content/data";

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    return (
      <div className="text-sm text-red-500">
        Failed to fetch JSON: {res.status} {res.statusText}
      </div>
    );
  }

  const data = await res.json();

  return (
    <div className="text-sm space-y-1">
      <h3 className="font-semibold">Backend JSON Response</h3>
      <pre className=" p-2 rounded text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
