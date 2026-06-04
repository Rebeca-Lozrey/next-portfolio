"use client";

import { useEffect } from "react";

import { registerWebVitals } from "@/lib/webVitals/registerWebVitals";

export function ObservabilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerWebVitals();
  }, []);

  return <>{children}</>;
}
