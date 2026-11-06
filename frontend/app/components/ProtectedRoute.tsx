"use client";

import { useMe } from "@/lib/hooks/useMe";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  const { isPending, isFetching, isError, isSuccess } = useMe();

  useEffect(() => {
    if (isError && !isFetching) {
      router.replace("/login");
    }
  }, [isError, isFetching, router]);

  if (isPending || isFetching) {
    return <p>Checking session...</p>;
  }

  if (isError || !isSuccess) {
    return null;
  }

  return <>{children}</>;
}