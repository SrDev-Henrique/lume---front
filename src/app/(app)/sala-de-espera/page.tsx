"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import PaxTable from "@/components/pax-table";
import Toast from "@/components/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalledPax } from "./components/called-pax";
import { NotArrivedPax } from "./components/not-arrived-pax";

export type Passenger = z.infer<typeof addPassengerSchema>;

const passengerStatusSchema = z.union([
  z.literal("Aguardando"),
  z.literal("Chamado"),
  z.literal("Não compareceu"),
  z.literal("Aberto"),
]);

// type PassengerStatus = z.infer<typeof passengerStatusSchema>;

export const addPassengerSchema = z
  .object({
    id: z.uuid(),
    status: passengerStatusSchema,
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.email("Email inválido").optional(),
    phone: z.number().optional(),
    guests: z.number().optional(),
    createdAt: z.date(),
  })
  .superRefine((data, ctx) => {
    const hasEmail = typeof data.email === "string" && data.email.length > 0;
    const hasPhone = typeof data.phone === "number";

    if (!hasEmail && !hasPhone) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Informe um email ou telefone para contato.",
      });
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Informe um email ou telefone para contato.",
      });
    }
  });

const initialPaxList: Passenger[] = [
  {
    id: crypto.randomUUID(),
    name: "Jim Beam",
    email: "jim.beam@example.com",
    guests: 2,
    status: "Não compareceu",
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    guests: 2,
    status: "Chamado",
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: crypto.randomUUID(),
    name: "Jane Doe",
    email: "jane.doe@example.com",
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: crypto.randomUUID(),
    name: "Jill Johnson",
    email: "jill.johnson@example.com",
    phone: 19994012785,
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
];

export default function WaitingRoom() {
  const [paxList, setPaxList] = useState<Passenger[]>(initialPaxList);

  const form = useForm<Passenger>({
    resolver: zodResolver(addPassengerSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      name: "",
      email: undefined,
      phone: undefined,
      guests: undefined,
      status: "Aguardando",
      createdAt: new Date(Date.now()),
    },
  });

  const filteredData = paxList.filter((passenger) => {
    const passengers = passenger.status === "Aguardando";
    return passengers;
  });

  const calledPaxList = paxList.filter((passenger) => {
    const passengers = passenger.status === "Chamado";
    return passengers;
  });

  const notArrivedPaxList = paxList.filter((passenger) => {
    const passengers = passenger.status === "Não compareceu";
    return passengers;
  });

  function handleSubmit(data: Passenger) {
    setPaxList((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
    try {
      toast.custom((t) => (
        <Toast
          message="Passageiro adicionado com sucesso"
          onClick={() => toast.dismiss(t)}
        />
      ));
      form.reset();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="absolute inset-0 px-4 flex items-start justify-center gap-4 overflow-y-auto scrollbar-hide pt-24 border">
      <div className="sticky -top-[4.5rem] w-fit min-w-[275px] h-[500px] text-primary-foreground space-y-4">
        <Card className="w-full max-w-md min-w-sm gap-2">
          <CardHeader>
            <CardTitle>Passageiros chamados</CardTitle>
          </CardHeader>
          <CardContent>
            <CalledPax calledPaxList={calledPaxList} setPaxList={setPaxList} />
          </CardContent>
        </Card>
        <Card className="w-full max-w-md min-w-sm gap-2">
          <CardHeader>
            <CardTitle>Passageiros que não compareceram</CardTitle>
          </CardHeader>
          <CardContent>
            <NotArrivedPax
              notArrivedPaxList={notArrivedPaxList}
              paxList={paxList}
              setPaxList={setPaxList}
            />
          </CardContent>
        </Card>
      </div>
      <div className="flex-1 min-w-[375px] bg-card text-primary-foreground rounded-3xl p-4 border border-border/50 h-screen space-y-4">
        {/* <div className="w-full text-center">
          <h1 className="text-2xl font-semibold text-primary-foreground">
            Lista de espera
          </h1>
        </div> */}
        <PaxTable
          data={filteredData}
          form={form}
          handleSubmit={handleSubmit}
          paxList={paxList}
          setPaxList={setPaxList}
        />
      </div>
    </div>
  );
}
