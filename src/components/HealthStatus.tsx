// src/components/HealthStatus.tsx
"use client";

import { useEffect, useState } from "react";

const backendHealthUrl = process.env.NEXT_PUBLIC_BACKEND_HEALTH_URL || "";

export function HealthStatus() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    if (!backendHealthUrl) return;

    const checkHealth = async () => {
      try {
        const res = await fetch(backendHealthUrl);
        setIsHealthy(res.ok);
      } catch (err) {
        console.error(err);
        setIsHealthy(false);
      }
    };

    checkHealth();

    const interval = setInterval(checkHealth, 10000); // every 10s
    return () => clearInterval(interval);
  }, []);

  if (isHealthy === null)
    return <span className="text-gray-500">Checking...</span>;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-3 w-3 rounded-full ${
          isHealthy ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-sm">
        {isHealthy ? "Backend healthy" : "Backend down"}
      </span>
    </div>
  );
}
