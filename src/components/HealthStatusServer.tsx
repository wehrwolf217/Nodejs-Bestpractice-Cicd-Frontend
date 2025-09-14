// src/components/HealthStatusServer.tsx
import "server-only";

export default async function HealthStatusServer() {
  const res = await fetch(process.env.BACKEND_HEALTH_URL!, {
    cache: "no-store",
  });

  const isHealthy = res.ok;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-3 w-3 rounded-full ${isHealthy ? "bg-green-500" : "bg-red-500"}`}
      />
      <span className="text-sm">
        {isHealthy ? "Backend healthy" : "Backend down"}
      </span>
    </div>
  );
}
