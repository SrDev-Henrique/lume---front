"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SocialButtons from "@/components/social-buttons";
import Toast from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth";

const signUpFormSchema = z
  .object({
    name: z.string(),
    email: z.email("Digite um email válido"),
    image: z.url("Digite uma URL válida").optional(),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      image: undefined as string | undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof signUpFormSchema>) {
    await authClient.signUp.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          toast.custom((t) => (
            <Toast
              error={true}
              message="Erro ao criar conta"
              errorMessage={error.error.message ?? "Erro desconhecido"}
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
        onSuccess: () => {
          toast.custom((t) => (
            <Toast
              message="Conta criada com sucesso"
              onClick={() => toast.dismiss(t)}
            />
          ));
          router.push("/");
        },
      },
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-0">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center font-bold text-2xl">
            Criar conta
          </CardTitle>
          <CardDescription className="text-center">
            Entre com seu provedor de preferência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <SocialButtons />

            <div className="relative w-full">
              <Separator className="absolute inset-0 top-1/2" />
              <span className="relative mx-auto block w-fit bg-card px-2 text-muted-foreground">
                ou
              </span>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da foto de perfil</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          type="url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                        />
                      </FormControl>
                      <FormMessage />
                      <Button
                        type="button"
                        className="absolute right-0 bottom-0"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                      >
                        {showPassword ? (
                          <EyeIcon className="size-4" />
                        ) : (
                          <EyeClosedIcon className="size-4" />
                        )}
                      </Button>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          className="relative"
                        />
                      </FormControl>
                      <FormMessage />
                      <Button
                        type="button"
                        className="absolute right-0 bottom-0"
                        size="icon"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        variant="ghost"
                      >
                        {showConfirmPassword ? (
                          <EyeIcon className="size-4" />
                        ) : (
                          <EyeClosedIcon className="size-4" />
                        )}
                      </Button>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Spinner /> : "Criar conta"}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center justify-center">
            <p>Já tem uma conta?</p>
            <Button variant="link" asChild>
              <Link href="/sign-in" className="underline">
                Entrar
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
