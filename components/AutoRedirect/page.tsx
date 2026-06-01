"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export function AutoRedirect({ path }: { path: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(path);
    }, 6000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
