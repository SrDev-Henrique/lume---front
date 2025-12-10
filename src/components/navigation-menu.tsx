/** biome-ignore-all lint/suspicious/noArrayIndexKey: <because> */
"use client";

import { FileClock, FileSpreadsheet, ListIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Notifications } from "./profile/notifications";
import { ProfileOptionsIcon } from "./profile/profile-options-icon";

const menuItems = [
  {
    label: "Sala de espera",
    href: "/sala-de-espera",
    icon: <ListIcon className="size-4" />,
  },
  {
    label: "Escalas",
    href: "/escalas",
    icon: <FileClock className="size-4" />,
  },
  {
    label: "Planilhas",
    href: "/planilhas",
    icon: <FileSpreadsheet className="size-4" />,
  },
];

export function NavigationMenu() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  return (
    <div className="fixed top-3.5 right-4 z-50 w-fit rounded-3xl border border-border/50 bg-card px-4 py-2 backdrop-blur-sm">
      <div className="flex w-full items-center justify-end gap-20">
        <div className="flex w-fit items-center justify-center gap-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex w-fit cursor-pointer items-center gap-2 rounded-3xl border border-input bg-input/30 px-3 py-2 font-medium text-secondary transition-all duration-300 hover:bg-input/50 hover:text-secondary",
                  isActive(item.href) &&
                    "border-primary/70 bg-primary/50 hover:bg-primary/50",
                )}
              >
                {item.icon}
                <p>{item.label}</p>
              </div>
            </Link>
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
