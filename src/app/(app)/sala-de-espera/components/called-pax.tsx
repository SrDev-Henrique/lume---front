"use client";

import { RiUserReceivedFill } from "@remixicon/react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Passenger } from "../page";

const CALL_TIMEOUT_SECONDS = 15 * 60;

export function CalledPax({
  calledPaxList,
  setPaxList,
}: {
  calledPaxList: Passenger[];
  setPaxList: Dispatch<SetStateAction<Passenger[]>>;
}) {
  const [timers, setTimers] = useState<Record<string, number>>({});
  const timersRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!calledPaxList.length) {
      setTimers({});
      timersRef.current = {};
      return;
    }

    setTimers((prev) => {
      const nextTimers: Record<string, number> = {};

      calledPaxList.forEach((passenger) => {
        nextTimers[passenger.id] = prev[passenger.id] ?? CALL_TIMEOUT_SECONDS;
      });

      timersRef.current = nextTimers;
      return nextTimers;
    });
  }, [calledPaxList]);

  useEffect(() => {
    if (!calledPaxList.length) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const currentTimers = timersRef.current;
      if (!Object.keys(currentTimers).length) {
        return;
      }

      const nextTimers: Record<string, number> = {};
      const expiredIds: string[] = [];

      Object.entries(currentTimers).forEach(([paxId, secondsLeft]) => {
        if (secondsLeft <= 1) {
          expiredIds.push(paxId);
          return;
        }

        nextTimers[paxId] = secondsLeft - 1;
      });

      timersRef.current = nextTimers;
      setTimers(nextTimers);

      if (expiredIds.length) {
        setPaxList((current) =>
          current.map((passenger) =>
            expiredIds.includes(passenger.id)
              ? { ...passenger, status: "Não compareceu" }
              : passenger,
          ),
        );
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [calledPaxList.length, setPaxList]);

  function secondsToMinutes(seconds: number) {
    const safeSeconds = Math.max(0, seconds);
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    return `${minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    } s`;
  }
  return (
    <>
      {calledPaxList.length > 0 ? (
        <div className="space-y-2">
          {calledPaxList.map((passenger) => (
            <div
              key={passenger.id}
              className="flex items-start gap-2 border border-border/50 backdrop-brightness-50 rounded-lg p-2"
            >
              <div className="size-2 bg-green-500/70 rounded-full mt-1.5" />
              <div className="w-full grid grid-cols-2 gap-2">
                <div className="w-full flex flex-col justify-between gap-2 pb-2">
                  <span className="text-sm font-medium">{passenger.name}</span>
                  <p className="text-xs text-muted-foreground">
                    Aguardando:{" "}
                    {secondsToMinutes(
                      timers[passenger.id] ?? CALL_TIMEOUT_SECONDS,
                    )}
                  </p>
                </div>
                <div className="flex flex-col justify-between gap-2">
                  <Badge variant="outline" className="h-fit self-end">
                    {passenger.guests && passenger.guests > 0
                      ? `${passenger.guests} acompanhante${passenger.guests > 1 ? "s" : ""}`
                      : "Nenhum acompanhante"}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Pax entrou
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty className="backdrop-brightness-50 w-full max-w-xs md:px-6 md:py-10">
          <EmptyHeader>
            <EmptyMedia>
              <RiUserReceivedFill className="size-6" />
            </EmptyMedia>
            <EmptyTitle className="text-base">
              Por enquanto não há passageiros chamados
            </EmptyTitle>
            <EmptyDescription className="text-sm">
              Quando um passageiro for chamado, ele será adicionado a esta
              lista.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </>
  );
}
