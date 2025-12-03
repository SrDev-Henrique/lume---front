"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from "@/lib/oauth-providers";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

export default function SocialButtons() {
  const [isSubmitting, startTransition] = useTransition();
  const [signingInWith, setSigningInWith] = useState<string | null>(null);
  return (
    <div className="flex justify-center items-center gap-2 w-full">
      {SUPPORTED_OAUTH_PROVIDERS.map((provider, index) => {
        const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;
        return (
          <Button
            key={provider}
            className={cn(
              index % 2 === 0
                ? "bg-[#333333] text-white hover:bg-[#333333]/90"
                : "bg-[#DB4437] text-white hover:bg-[#DB4437]/90",
            )}
            onClick={() =>
              startTransition(async () => {
                setSigningInWith(provider);
                authClient.signIn.social({
                  provider,
                  callbackURL: "http://localhost:3000/",
                });
              })
            }
            disabled={isSubmitting}
          >
            {signingInWith === provider ? (
              <Spinner className="size-4" />
            ) : (
              <Icon />
            )}
            {provider === "google" ? "Google" : "GitHub"}
          </Button>
        );
      })}
    </div>
  );
}
