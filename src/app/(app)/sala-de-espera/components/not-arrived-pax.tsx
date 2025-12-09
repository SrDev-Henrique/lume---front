import { RiUserUnfollowFill } from "@remixicon/react";
import type { Dispatch, SetStateAction } from "react";
import { ContactDialog } from "@/components/pax-table";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Passenger } from "../page";

export function NotArrivedPax({
  notArrivedPaxList,
  paxList,
  setPaxList,
}: {
  notArrivedPaxList: Passenger[];
  paxList?: Passenger[];
  setPaxList?: Dispatch<SetStateAction<Passenger[]>>;
}) {
  return (
    <>
      {notArrivedPaxList.length > 0 ? (
        <div className="space-y-2">
          {notArrivedPaxList.map((passenger) => (
            <div
              key={passenger.id}
              className="flex items-start gap-2 rounded-lg border border-border/50 p-2 backdrop-brightness-50"
            >
              <div className="mt-1.5 size-2 rounded-full bg-red-500/70" />
              <div className="flex w-full flex-col gap-2.5">
                <div className="grid w-full grid-cols-2 gap-2">
                  <div className="flex w-full items-start">
                    <span className="font-medium text-sm">
                      {passenger.name}
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <Badge
                      variant="outline"
                      className="h-fit text-primary-foreground"
                    >
                      {passenger.guests && passenger.guests > 0 ? (
                        <p>
                          <span className="text-primary">
                            {passenger.guests}
                          </span>{" "}
                          acompanhante{passenger.guests > 1 ? "s" : ""}
                        </p>
                      ) : (
                        "Nenhum acompanhante"
                      )}
                    </Badge>
                  </div>
                </div>
                <ContactDialog
                  passenger={passenger}
                  message="Chamar novamente"
                  paxList={paxList}
                  setPaxList={setPaxList}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty className="my-auto w-full max-w-[335.100px] backdrop-brightness-50 md:px-8 md:py-10">
          <EmptyHeader>
            <EmptyMedia>
              <RiUserUnfollowFill className="size-6" />
            </EmptyMedia>
            <EmptyTitle className="text-base">
              Por enquanto não há passageiros que não compareceram
            </EmptyTitle>
            <EmptyDescription className="text-sm">
              Quando um passageiro não comparecer, ele será adicionado a esta
              lista.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </>
  );
}
