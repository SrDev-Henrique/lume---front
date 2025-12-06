import type { Passenger } from "../page";

export function handlePassengerUpdate(
  updatedPassenger: Passenger,
  paxList: Passenger[],
  setPaxList: (data: Passenger[]) => void,
) {
  setPaxList(
    paxList.map((passenger) =>
      passenger.id === updatedPassenger.id ? updatedPassenger : passenger,
    ),
  );
}
