import type { Dispatch, SetStateAction } from "react";
import { Badge } from "@/components/ui/badge";
import type { Passenger } from "../page";

export function MobilePaxTabs({
  calledPaxList,
  notArrivedPaxList,
  paxList,
  setPaxList,
}: {
  calledPaxList: Passenger[];
  notArrivedPaxList: Passenger[];
  paxList: Passenger[];
  setPaxList: Dispatch<SetStateAction<Passenger[]>>;
}) {
  return (
    <div className="group fixed right-1/2 bottom-4 translate-x-1/2 cursor-default rounded-xl border border-input/50 bg-card p-2 backdrop-blur-sm">
      <div className="flex flex-col justify-center gap-2">
        <div className="overflow-hidden rounded-full p-4 backdrop-brightness-70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500/70" />
              <span className="font-medium text-sm transition-colors duration-200 group-hover:text-primary-foreground">
                Chamados
              </span>
            </div>
            <Badge>{calledPaxList.length}</Badge>
          </div>
        </div>
        <div className="overflow-hidden rounded-full p-4 backdrop-brightness-70">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-red-500/70" />
            <span className="text-nowrap font-medium text-sm transition-colors duration-200 group-hover:text-primary-foreground">
              Não compareceram
            </span>
            <Badge>{notArrivedPaxList.length}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
