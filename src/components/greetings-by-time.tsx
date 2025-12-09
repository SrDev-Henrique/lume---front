"use client";

import { useEffect, useMemo, useState } from "react";

import { authClient } from "@/lib/auth";

import { Skeleton } from "./ui/skeleton";

const DEFAULT_GREETING = "Olá";

export function GreetingsByTime() {
  const { data: session } = authClient.useSession();
  const [greeting, setGreeting] = useState(DEFAULT_GREETING);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) {
      setGreeting("Bom dia");
    } else if (hour < 18) {
      setGreeting("Boa tarde");
    } else {
      setGreeting("Boa noite");
    }
  }, []);

  const displayName = useMemo(() => {
    if (!hasMounted) return "";
    return session?.user?.name?.trim() ?? "";
  }, [hasMounted, session?.user?.name]);

  const shouldShowName = displayName.length > 0;

  return (
    <div className="flex items-center gap-2 font-bold text-2xl">
      {greeting},{" "}
      <div className="text-primary-foreground">
        {shouldShowName ? (
          <span>{displayName}</span>
        ) : (
          <Skeleton
            aria-label="Carregando nome do usuário"
            className="h-4 w-24"
          />
        )}
      </div>
    </div>
  );
}
