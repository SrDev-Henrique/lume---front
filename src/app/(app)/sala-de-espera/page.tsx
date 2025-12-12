"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import PaxTable from "@/components/pax-table";
import Toast from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsTablet } from "@/hooks/use-mobile";
import { enterAnimation } from "./anime";
import { CalledPax } from "./components/called-pax";
import { MobilePaxTabs } from "./components/mobile-pax-tabs";
import { NotArrivedPax } from "./components/not-arrived-pax";

export type Passenger = z.infer<typeof addPassengerSchema>;
export type PassengerFormValues = z.input<typeof addPassengerSchema>;

const passengerStatusSchema = z.union([
  z.literal("Aguardando"),
  z.literal("Chamado"),
  z.literal("Não compareceu"),
  z.literal("Entrou"),
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
    calledAt: z.date().optional(),
    enteredAt: z.date().optional(),
    notArrivedAt: z.date().optional(),
    eventsHistory: z
      .array(
        z.object({
          event: z.enum(["chamado", "entrou", "não compareceu"]),
          timestamp: z.date(),
        }),
      )
      .default([]),
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
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 21),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 22),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 23),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 24),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 25),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 26),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 27),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 28),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 29),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john.doe@example.com",
    guests: 2,
    status: "Aguardando",
    createdAt: new Date(Date.now() - 1000 * 60 * 31),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "Jane Doe",
    email: "jane.doe@example.com",
    guests: 2,
    status: "Chamado",
    createdAt: new Date(Date.now() - 1000 * 60 * 32),
    eventsHistory: [],
  },
  {
    id: crypto.randomUUID(),
    name: "Jill Johnson",
    email: "jill.johnson@example.com",
    phone: 19994012785,
    guests: 2,
    status: "Não compareceu",
    createdAt: new Date(Date.now() - 1000 * 60 * 33),
    eventsHistory: [],
  },
];

function createPassengerDefaults(): PassengerFormValues {
  return {
    id: crypto.randomUUID(),
    name: "",
    email: undefined,
    phone: undefined,
    guests: undefined,
    status: "Aguardando",
    createdAt: new Date(),
    eventsHistory: [],
  };
}

export default function WaitingRoom() {
  const [paxList, setPaxList] = useState<Passenger[]>(initialPaxList);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isTablet = useIsTablet();

  const form = useForm<PassengerFormValues>({
    resolver: zodResolver(addPassengerSchema),
    defaultValues: createPassengerDefaults(),
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

  function handleSubmit(data: PassengerFormValues) {
    const passenger: Passenger = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      eventsHistory: data.eventsHistory ?? [],
    };

    setPaxList((prev) => [...prev, passenger]);
    try {
      toast.custom((t) => (
        <Toast
          message="Passageiro adicionado com sucesso"
          onClick={() => toast.dismiss(t)}
        />
      ));
      form.reset(createPassengerDefaults());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-4 left-4 z-50 w-fit">
        <Button variant="secondary" asChild>
          <Link href="/">
            <ArrowLeftIcon className="size-4" />
            Voltar
          </Link>
        </Button>
      </div>
      <div className="scrollbar-hide absolute inset-0 flex items-start justify-center gap-4 overflow-y-auto border px-4 pt-24 pb-42 xl:pb-4">
        {isTablet && isMounted ? (
          <MobilePaxTabs
            calledPaxList={calledPaxList}
            notArrivedPaxList={notArrivedPaxList}
            paxList={paxList}
            setPaxList={setPaxList}
          />
        ) : (
          <div className="hidden h-[500px] w-fit min-w-[275px] space-y-4 pb-4 text-primary-foreground xl:block">
            <motion.div
              variants={enterAnimation}
              initial="initial"
              animate="animate"
              className="w-full min-w-sm max-w-md"
            >
              <Card className="w-full gap-2">
                <CardHeader>
                  <CardTitle>Passageiros chamados</CardTitle>
                </CardHeader>
                <CardContent className="scrollbar-hide max-h-[275px] overflow-y-auto">
                  <CalledPax
                    calledPaxList={calledPaxList}
                    paxList={paxList}
                    setPaxList={setPaxList}
                  />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              variants={enterAnimation}
              initial="initial"
              animate={enterAnimation.animate(0.2)}
              className="w-full min-w-sm max-w-md"
            >
              <Card className="w-full gap-2">
                <CardHeader>
                  <CardTitle>Passageiros que não compareceram</CardTitle>
                </CardHeader>
                <CardContent className="scrollbar-hide max-h-[275px] overflow-y-auto">
                  <NotArrivedPax
                    notArrivedPaxList={notArrivedPaxList}
                    paxList={paxList}
                    setPaxList={setPaxList}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
        <motion.div
          variants={enterAnimation}
          initial="initial"
          animate={enterAnimation.animate(0.4)}
          className="h-fit min-w-[375px] flex-1 space-y-4 rounded-3xl border border-border/50 bg-card p-4 text-primary-foreground"
        >
          <PaxTable
            data={filteredData}
            form={form}
            handleSubmit={handleSubmit}
            paxList={paxList}
            setPaxList={setPaxList}
          />
        </motion.div>
      </div>
    </div>
  );
}
