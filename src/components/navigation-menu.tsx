/** biome-ignore-all lint/suspicious/noArrayIndexKey: <because> */
"use client";

import { cn } from "@/lib/utils";

export function NavigationMenu() {
  return (
    <div className="fixed top-3.5 right-4 w-fit py-2 px-4 bg-card rounded-3xl backdrop-blur-sm border border-border/50 z-50">
      <div className="w-full flex items-center justify-end gap-20">
        <div className="w-fit flex items-center justify-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-fit py-3 px-4 rounded-3xl font-medium bg-secondary-foreground text-secondary hover:bg-ring hover:text-secondary transition-all duration-300 cursor-pointer",
                index === 0 && "bg-primary text-muted",
              )}
            >
              <p>Menu</p>
            </div>
          ))}
        </div>
        <div className="w-fit py-3 px-4 bg-accent-foreground rounded-3xl font-medium text-accent hover:bg-primary hover:text-accent transition-all duration-300 cursor-pointer">
          <p className="text-nowrap">Side Menu</p>
        </div>
      </div>
    </div>
  );
}
