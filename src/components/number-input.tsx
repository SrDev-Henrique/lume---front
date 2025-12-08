"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { type ChangeEvent, useId } from "react";

const MIN_VALUE = 0;

export default function NumberInput({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (value: number) => void;
}) {
  const inputId = useId();
  const currentValue = typeof value === "number" ? value : MIN_VALUE;

  const clamp = (nextValue: number) => Math.max(MIN_VALUE, nextValue);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsed = Number(event.target.value);
    onChange(Number.isNaN(parsed) ? MIN_VALUE : clamp(parsed));
  };

  const handleStep = (direction: -1 | 1) => {
    onChange(clamp(currentValue + direction));
  };

  return (
    <div className="*:not-first:mt-2">
      <div className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-md border border-input text-sm shadow-xs outline-none transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
        <button
          type="button"
          aria-label="Diminuir valor"
          aria-controls={inputId}
          onClick={() => handleStep(-1)}
          className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-md border border-input text-muted-foreground/80 text-sm transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentValue <= MIN_VALUE}
        >
          <MinusIcon aria-hidden="true" size={16} />
        </button>
        <input
          id={inputId}
          min={MIN_VALUE}
          value={currentValue}
          onChange={handleInputChange}
          className="w-full grow px-3 py-2 text-center text-primary-foreground tabular-nums focus:outline-none"
        />
        <button
          type="button"
          aria-label="Aumentar valor"
          aria-controls={inputId}
          onClick={() => handleStep(1)}
          className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-md border border-input text-muted-foreground/80 text-sm transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PlusIcon aria-hidden="true" size={16} />
        </button>
      </div>
    </div>
  );
}
