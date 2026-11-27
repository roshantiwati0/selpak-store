"use client";

import { MAX_QTY } from "@/store/cart";

interface Props {
  value: number;
  onChange: (next: number) => void;
  small?: boolean;
  label?: string;
}

export function QtyStepper({ value, onChange, small, label = "Quantity" }: Props) {
  return (
    <div className={`stepper${small ? " stepper-sm" : ""}`} role="group" aria-label={label}>
      <button type="button" aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(value - 1)}>
        &minus;
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" aria-label="Increase quantity" disabled={value >= MAX_QTY} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}
