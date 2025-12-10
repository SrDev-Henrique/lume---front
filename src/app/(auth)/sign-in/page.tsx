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

const signInFormSchema = z.object({
  email: z.email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export default function SignInPage({
  openForgotPasswordTab,
}: {
  openForgotPasswordTab: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof signInFormSchema>) {
    await authClient.signIn.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          toast.custom((t) => (
            <Toast
              error={true}
              message="Erro ao entrar"
              errorMessage={error.error.message ?? "Erro desconhecido"}
              onClick={() => toast.dismiss(t)}
            />
          ));
        },
        onSuccess: () => {
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
            Entrar
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="email webauthn"
                          {...field}
                          type="email"
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
                      <div className="flex items-baseline justify-between">
                        <FormLabel>Senha</FormLabel>
                        <Button
                          type="button"
                          variant="link"
                          onClick={openForgotPasswordTab}
                          className="text-xs"
                        >
                          Esqueceu sua senha?
                        </Button>
                      </div>
                      <FormControl>
                        <Input
                          autoComplete="current-password webauthn"
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Spinner /> : "Entrar"}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center justify-center">
            <p>Não tem uma conta?</p>
            <Button variant="link" asChild>
              <Link href="/sign-up" className="underline">
                Criar conta
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
