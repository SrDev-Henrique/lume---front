"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth";
import { Spinner } from "./ui/spinner";

export function LoadingSession() {
  const { data: session, isPending } = authClient.useSession();
  const [hasMounted, setHasMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [isPending, router, session]);

  if (!hasMounted || isPending) {
    return (
      <div className="absolute inset-0 z-100 flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <h1>Carregando sessão</h1>
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return null;
  }
}
