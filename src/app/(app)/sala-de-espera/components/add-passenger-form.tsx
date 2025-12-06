import { RiAddCircleFill } from "@remixicon/react";
import type { UseFormReturn } from "react-hook-form";
import type z from "zod";
import NumberInput from "@/components/number-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPhone, getPhoneDigits } from "@/lib/phone";
import type { addPassengerSchema } from "../page";

export function AddPassengerForm({
  form,
  handleSubmit,
}: {
  form: UseFormReturn<z.infer<typeof addPassengerSchema>>;
  handleSubmit: (data: z.infer<typeof addPassengerSchema>) => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-36">
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convidados</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value ?? 0}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="self-center">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Telefone</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      type="email"
                      value={field.value ?? ""}
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? undefined
                            : event.target.value,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="phone">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="tel"
                      type="tel"
                      value={
                        field.value === undefined
                          ? ""
                          : formatPhone(field.value)
                      }
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      onChange={(event) => {
                        const digits = getPhoneDigits(event.target.value).slice(
                          0,
                          11,
                        );
                        field.onChange(
                          digits === "" ? undefined : Number(digits),
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        <Button type="submit" className="w-full mt-2">
          {" "}
          <RiAddCircleFill className="size-4" aria-hidden="true" /> Adicionar
        </Button>
      </form>
    </Form>
  );
}
