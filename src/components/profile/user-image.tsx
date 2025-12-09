"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth";
import { Skeleton } from "../ui/skeleton";

export function UserImage() {
  const { data: session } = authClient.useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="size-full" />;
  }

  const showImageSession = isMounted && Boolean(session?.user?.image);

  return (
    session?.user?.image && (
      <div className="relative size-full">
        {showImageSession ? (
          <Image
            src={session?.user?.image}
            alt="Imagem de perfil do usuário"
            fill
            className="object-cover object-center"
          />
        ) : null}
      </div>
    )
  );
}
