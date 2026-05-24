"use client";

import {
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import "./style.css";

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: ReactNode;
  indeterminate?: boolean;
};

export function Checkbox({
  label,
  indeterminate = false,
  className,
  id,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const input = (
    <input
      ref={inputRef}
      type="checkbox"
      id={inputId}
      className="keys-checkbox__input"
      {...props}
    />
  );

  if (!label) {
    return (
      <span
        className={["keys-checkbox", "keys-checkbox--solo", className]
          .filter(Boolean)
          .join(" ")}
      >
        {input}
      </span>
    );
  }

  return (
    <label
      className={["keys-checkbox", className].filter(Boolean).join(" ")}
      htmlFor={inputId}
    >
      {input}
      <span className="keys-checkbox__label">{label}</span>
    </label>
  );
}
