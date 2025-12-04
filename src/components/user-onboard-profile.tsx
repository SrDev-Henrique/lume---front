"use client";

import { LogOut, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function UserOnboardProfile() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [isSigningOut, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut();
      router.push("/sign-in");
    });
  }

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [isPending, router, session]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-screen">
        <h1>Carregando sessão</h1>
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={session?.user?.image ?? ""} />
              <AvatarFallback>
                {session?.user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-sm text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <Button variant="secondary" asChild>
              <Link href="/sala-de-espera">
                <MessageSquare className="size-4" />
                waiting room
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? <Spinner /> : <LogOut className="size-4" />}
              Sair
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
