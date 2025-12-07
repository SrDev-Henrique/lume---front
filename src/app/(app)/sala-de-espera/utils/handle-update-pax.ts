import type { Dispatch, SetStateAction } from "react";
import type { Passenger } from "../page";

export function handlePassengerUpdate(
  updatedPassenger: Passenger,
  paxList: Passenger[],
  setPaxList: Dispatch<SetStateAction<Passenger[]>>,
) {
  setPaxList(
    paxList.map((passenger) =>
      passenger.id === updatedPassenger.id ? updatedPassenger : passenger,
    ),
  );
}
