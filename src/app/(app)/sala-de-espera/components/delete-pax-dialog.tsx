import { UserXIcon } from "lucide-react";
import { toast } from "sonner";
import Toast from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Passenger } from "../page";

export function DeletePaxDialog({
  deletingPax,
  isDeleting,
  setIsDeleting,
  paxList,
  setPaxList,
}: {
  deletingPax: Passenger;
  isDeleting: boolean;
  setIsDeleting: (isDeleting: boolean) => void;
  paxList: Passenger[];
  setPaxList: (paxList: Passenger[]) => void;
}) {
  return (
    <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
      <DialogContent className="w-full max-w-sm bg-card/60 backdrop-blur-sm sm:w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 font-medium text-lg text-primary-foreground">
            <UserXIcon className="size-5" />
            Deletar passageiro ({deletingPax.name})
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Tem certeza que deseja deletar o passageiro {deletingPax.name}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row">
          <Button
            variant="destructive"
            className="w-full sm:flex-1"
            onClick={() => {
              setPaxList(paxList.filter((pax) => pax.id !== deletingPax.id));
              setIsDeleting?.(false);
              toast.custom((t) => (
                <Toast
                  onClick={() => toast.dismiss(t)}
                  message={`Pax ${deletingPax.name} deletado com sucesso`}
                />
              ));
            }}
          >
            Deletar
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-fit">
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
