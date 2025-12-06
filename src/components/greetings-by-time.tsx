"use client";

import { useMemo } from "react";
import { authClient } from "@/lib/auth";

export function GreetingsByTime() {
  const { data: session } = authClient.useSession();

  const isMorning = useMemo(() => {
    const now = new Date(Date.now());
    const hour = now.getHours();
    return hour < 12;
  }, []);
  const isAfternoon = useMemo(() => {
    const now = new Date(Date.now());
    const hour = now.getHours();
    return hour >= 12 && hour < 18;
  }, []);
  const isEvening = useMemo(() => {
    const now = new Date(Date.now());
    const hour = now.getHours();
    return hour >= 18;
  }, []);

  const greeting = useMemo(() => {
    if (isMorning) return "Bom dia";
    if (isAfternoon) return "Boa tarde";
    if (isEvening) return "Boa noite";
    return "Olá";
  }, [isMorning, isAfternoon, isEvening]);
  
  return (
    <h2 className="text-2xl font-bold">
      {greeting},{" "}
      <span className="text-primary-foreground">{session?.user?.name}</span>
    </h2>
  );
}
