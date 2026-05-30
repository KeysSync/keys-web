import type { ReactNode } from "react";

type EntityFormFieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function EntityFormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  className = "",
  children,
}: EntityFormFieldProps) {
  return (
    <div className={`contract-create-field${className ? ` ${className}` : ""}`}>
      <label className="contract-create-field__label" htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="entity-form-field__required" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <span className="entity-form-field__error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="contract-create-field__hint">{hint}</span>
      ) : null}
    </div>
  );
}
