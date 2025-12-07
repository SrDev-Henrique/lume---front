"use client";

import {
  BoltIcon,
  BookOpenIcon,
  ChevronDownIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProfileOptionsIcon({
  name,
  email,
  imgSrc,
}: {
  name: string;
  email: string;
  imgSrc?: string;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fallbackInitial = useMemo(() => {
    const source = (name || email || "").trim();
    return source ? source.charAt(0).toUpperCase() : "";
  }, [name, email]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-auto p-0 hover:bg-transparent dark:hover:bg-transparent rounded-full focus-visible:border-transparent focus-visible:ring-transparent"
          variant="ghost"
        >
          <Avatar className="size-11">
            <AvatarImage
              alt={`image de perfil de${name}`}
              src={imgSrc !== "" ? imgSrc : ""}
            />
            <AvatarFallback suppressHydrationWarning>
              {isMounted ? fallbackInitial : null}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            aria-hidden="true"
            className="opacity-90"
            size={16}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 bg-card backdrop-blur-md border border-border/50">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-primary-foreground text-sm">
            {name}
          </span>
          <span className="truncate font-normal text-muted-foreground text-xs">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="text-primary-foreground">
          <DropdownMenuItem>
            <BoltIcon aria-hidden="true" className="opacity-90" size={16} />
            <span>Option 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon aria-hidden="true" className="opacity-90" size={16} />
            <span>Option 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpenIcon aria-hidden="true" className="opacity-90" size={16} />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon aria-hidden="true" className="opacity-90" size={16} />
            <span>Option 4</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPenIcon aria-hidden="true" className="opacity-90" size={16} />
            <span>Option 5</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive hover:text-destructive/90 dark:hover:text-destructive/90">
          <LogOutIcon
            aria-hidden="true"
            className="opacity-90 text-destructive"
            size={16}
          />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
