"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import "./style.css";

export type ToggleProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: ReactNode;
  showStateLabel?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
};

export function Toggle({
  label,
  showStateLabel = false,
  activeLabel = "Ativo",
  inactiveLabel = "Inativo",
  className,
  id,
  checked,
  ...props
}: ToggleProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const stateLabel = checked ? activeLabel : inactiveLabel;

  const control = (
    <>
      <input
        type="checkbox"
        role="switch"
        id={inputId}
        className="keys-toggle__input"
        checked={checked}
        {...props}
      />
      <span className="keys-toggle__track" aria-hidden />
    </>
  );

  if (label !== undefined) {
    return (
      <label
        className={["keys-toggle", className].filter(Boolean).join(" ")}
        htmlFor={inputId}
      >
        {control}
        <span className="keys-toggle__label">{label}</span>
      </label>
    );
  }

  if (showStateLabel) {
    return (
      <label
        className={["keys-toggle", "keys-toggle--with-state", className]
          .filter(Boolean)
          .join(" ")}
        htmlFor={inputId}
      >
        {control}
        <span className="keys-toggle__state">{stateLabel}</span>
      </label>
    );
  }

  return (
    <label
      className={["keys-toggle", "keys-toggle--solo", className]
        .filter(Boolean)
        .join(" ")}
      htmlFor={inputId}
    >
      {control}
    </label>
  );
}
