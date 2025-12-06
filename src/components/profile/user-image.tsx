"use client";

import Image from "next/image";
import { authClient } from "@/lib/auth";

export function UserImage() {
  const { data: session } = authClient.useSession();
  return (
    session?.user?.image && (
      <div className="size-full relative">
        <Image
          src={session?.user?.image}
          alt="Imagem de perfil do usuário"
          fill
          className="object-cover object-center"
        />
      </div>
    )
  );
}
