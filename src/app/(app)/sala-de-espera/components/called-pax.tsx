"use client";

import { RiUserReceivedFill } from "@remixicon/react";
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

export function CalledPax({ calledPaxList }: { calledPaxList: Passenger[] }) {
  const interval = useRef<NodeJS.Timeout>(undefined);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    function startTimer(time = 900) {
      setSeconds(time);

      clearInterval(interval.current);
      interval.current = setInterval(() => {
        setSeconds((t) => {
          if (t <= 1) {
            clearInterval(interval.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    startTimer();
  }, []);

  function secondsToMinutes(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60} s`;
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
                    Aguardando: {secondsToMinutes(seconds)}
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
        <Empty className="backdrop-brightness-50">
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
