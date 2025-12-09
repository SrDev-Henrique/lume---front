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
              className="flex items-start gap-2 rounded-lg border border-border/50 p-2 backdrop-brightness-50"
            >
              <div className="mt-1.5 size-2 rounded-full bg-green-500/70" />
              <div className="grid w-full grid-cols-2 gap-2">
                <div className="flex w-full flex-col justify-between gap-2.5 pb-2">
                  <span className="font-medium text-sm">{passenger.name}</span>
                  <p className="text-muted-foreground text-xs">
                    Aguardando:{" "}
                    {secondsToMinutes(
                      timers[passenger.id] ?? CALL_TIMEOUT_SECONDS,
                    )}
                  </p>
                </div>
                <div className="flex flex-col justify-between gap-2.5">
                  <Badge
                    variant="outline"
                    className="h-fit self-end text-primary-foreground"
                  >
                    {passenger.guests && passenger.guests > 0 ? (
                      <p>
                        <span className="text-primary">{passenger.guests}</span>{" "}
                        acompanhante{passenger.guests > 1 ? "s" : ""}
                      </p>
                    ) : (
                      "Nenhum acompanhante"
                    )}
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
        <Empty className="w-full max-w-[335.100px] backdrop-brightness-50 md:px-8 md:py-10">
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
