"use client";

import { useEffect, useState } from "react";
import { maskCepInput } from "@/lib/utils/masks/cep";
import { cn } from "@/lib/utils";

export interface CepInputBrProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type"
  > {
  value: string;
  onChange?: (value: string) => void;
}

export function CepInputBr({
  value,
  onChange,
  className,
  disabled,
  id,
  placeholder = "00000-000",
  ...rest
}: CepInputBrProps) {
  const [display, setDisplay] = useState(() => maskCepInput(value));

  useEffect(() => {
    setDisplay(maskCepInput(value));
  }, [value]);

  function handleChange(raw: string) {
    const masked = maskCepInput(raw);
    setDisplay(masked);
    onChange?.(masked);
  }

  return (
    <input
      {...rest}
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="postal-code"
      disabled={disabled}
      className={cn("contract-create-input", className)}
      placeholder={placeholder}
      value={display}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}
