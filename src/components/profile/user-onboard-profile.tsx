"use client";

import { MessageSquare, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export function UserOnboardProfile() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [isDeletingUser, startTransition] = useTransition();
  const [hasMounted, setHasMounted] = useState(false);

  function handleDeleteUser() {
    startTransition(async () => {
      await authClient.deleteUser();
      router.push("/sign-in");
    });
  }

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const fallbackInitial = useMemo(() => {
    const source =
      session?.user?.name?.trim() || session?.user?.email?.trim() || "";
    return source ? source.charAt(0).toUpperCase() : "";
  }, [session?.user?.email, session?.user?.name]);

  const showSessionData = hasMounted && Boolean(session);

  return (
    <div className="flex h-fit w-full min-w-[285px] items-center justify-center">
      <Card className="size-full">
        <CardHeader>
          <CardTitle>Bem-vindo</CardTitle>
          <Separator />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={session?.user?.image ?? undefined} />
              <AvatarFallback suppressHydrationWarning>
                {hasMounted ? fallbackInitial : null}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="font-medium text-sm">
                {showSessionData ? (
                  <p>{session?.user?.name}</p>
                ) : (
                  <Skeleton className="h-4 w-28" />
                )}
              </div>
              <div className="text-muted-foreground text-sm">
                {showSessionData ? (
                  <p>{session?.user?.email}</p>
                ) : (
                  <Skeleton className="mt-1 h-3 w-40" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <Button variant="secondary" asChild>
              <Link href="/sala-de-espera">
                <MessageSquare className="size-4" />
                waiting room
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeletingUser}
            >
              {isDeletingUser ? <Spinner /> : <Trash2Icon className="size-4" />}
              Deletar
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
