"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { Button, Group, Input, NumberField } from "react-aria-components";

export default function NumberInput({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (value: number) => void;
}) {
  return (
    <NumberField defaultValue={0} minValue={0}>
      <div className="*:not-first:mt-2">
        <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-md border border-input text-sm shadow-xs outline-none transition-[color,box-shadow] data-focus-within:border-ring data-disabled:opacity-50 data-focus-within:ring-[3px] data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40">
          <Button
            className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-md border border-input text-muted-foreground/80 text-sm transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            slot="decrement"
            onClick={() => onChange(Math.max(0, (value ?? 0) - 1))}
          >
            <MinusIcon aria-hidden="true" size={16} />
          </Button>
          <Input
            min={0}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-full grow px-3 py-2 text-center text-primary-foreground tabular-nums"
          />
          <Button
            className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-md border border-input text-muted-foreground/80 text-sm transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            slot="increment"
            onClick={() => onChange((value ?? 0) + 1)}
          >
            <PlusIcon aria-hidden="true" size={16} />
          </Button>
        </Group>
      </div>
    </NumberField>
  );
}
