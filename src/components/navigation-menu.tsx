/** biome-ignore-all lint/suspicious/noArrayIndexKey: <because> */
"use client";

import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Notifications } from "./profile/notifications";
import { ProfileOptionsIcon } from "./profile/profile-options-icon";

const menuItems = [
  {
    label: ""
  }
]

export function NavigationMenu() {
  const { data: session } = authClient.useSession();
  return (
    <div className="fixed top-3.5 right-4 z-50 w-fit rounded-3xl border border-border/50 bg-card px-4 py-2 backdrop-blur-sm">
      <div className="flex w-full items-center justify-end gap-20">
        <div className="flex w-fit items-center justify-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-fit cursor-pointer rounded-3xl border border-input bg-input/30 px-4 py-3 font-medium text-secondary transition-all duration-300 hover:bg-input/50 hover:text-secondary",
                index === 0 &&
                  "border-primary/70 bg-primary/50 hover:bg-primary/50",
              )}
            >
              <p>Menu</p>
            </div>
          ))}
        </div>
        <div className="flex w-fit items-center gap-2">
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
