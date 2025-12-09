import { zodResolver } from "@hookform/resolvers/zod";
import { UserPenIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addPassengerSchema, type Passenger } from "../page";
import { AddPassengerForm } from "./add-passenger-form";

export function EditPaxDialog({
  editingPax,
  isEditing,
  setIsEditing,
  paxList,
  setPaxList,
}: {
  editingPax: Passenger;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  paxList: Passenger[];
  setPaxList: (paxList: Passenger[]) => void;
}) {
  const defaultValues: Passenger = {
    id: editingPax.id,
    name: editingPax.name,
    email: editingPax.email,
    phone: editingPax.phone,
    guests: editingPax.guests,
    status: editingPax.status,
    createdAt: editingPax.createdAt,
  };

  const form = useForm<Passenger>({
    resolver: zodResolver(addPassengerSchema),
    defaultValues,
  });
  function handleSubmit(data: Passenger) {
    const updatedPassenger: Passenger = {
      ...data,
    };
    setPaxList(
      paxList.map((passenger) =>
        passenger.id === updatedPassenger.id ? updatedPassenger : passenger,
      ),
    );
  }
  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="w-sm bg-card/60 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 font-medium text-lg text-primary-foreground">
            <UserPenIcon className="size-5" />
            Editar passageiro ({editingPax.name})
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Edite as informações do passageiro para atualizar a lista de espera.
          </DialogDescription>
        </DialogHeader>
        <AddPassengerForm form={form} handleSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
