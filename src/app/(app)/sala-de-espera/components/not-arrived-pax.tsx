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
              className="flex items-start gap-2 border border-border/50 backdrop-brightness-50 rounded-lg p-2"
            >
              <div className="size-2 bg-red-500/70 rounded-full mt-1.5" />
              <div className="w-full flex flex-col">
                <div className="w-full grid grid-cols-2 gap-2">
                  <div className="w-full grid grid-rows-2 gap-2">
                    <span className="text-sm font-medium">
                      {passenger.name}
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <Badge variant="outline" className="h-fit">
                      {passenger.guests && passenger.guests > 0
                        ? `${passenger.guests} acompanhante${passenger.guests > 1 ? "s" : ""}`
                        : "Nenhum acompanhante"}
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
        <Empty className="backdrop-brightness-50 w-full max-w-xs md:px-6 md:py-10">
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
