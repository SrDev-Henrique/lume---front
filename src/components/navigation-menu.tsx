/** biome-ignore-all lint/suspicious/noArrayIndexKey: <because> */
"use client";

import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Notifications } from "./profile/notifications";
import { ProfileOptionsIcon } from "./profile/profile-options-icon";

export function NavigationMenu() {
  const { data: session } = authClient.useSession();
  return (
    <div className="fixed top-3.5 right-4 w-fit py-2 px-4 bg-card rounded-3xl backdrop-blur-sm border border-border/50 z-50">
      <div className="w-full flex items-center justify-end gap-20">
        <div className="w-fit flex items-center justify-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-fit py-3 px-4 rounded-3xl font-medium bg-input/30 border border-input text-secondary hover:bg-input/50 hover:text-secondary transition-all duration-300 cursor-pointer",
                index === 0 && "bg-primary/50 hover:bg-primary/50 border-primary/70",
              )}
            >
              <p>Menu</p>
            </div>
          ))}
        </div>
        <div className="w-fit flex items-center gap-2">
          <Notifications />
          <ProfileOptionsIcon
            name={session?.user?.name ?? ""}
            email={session?.user?.email ?? ""}
            imgSrc={session?.user?.image ?? undefined}
          />
        </div>
      </div>
    </div>
  );
}
