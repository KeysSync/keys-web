"use client";

import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import "./select.css";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "defaultValue" | "onChange" | "children"
> & {
  options?: readonly SelectOption[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  children?: React.ReactNode;
  name?: string;
  required?: boolean;
};

function createChangeEvent(value: string): React.ChangeEvent<HTMLSelectElement> {
  return {
    target: { value } as HTMLSelectElement,
    currentTarget: { value } as HTMLSelectElement,
  } as React.ChangeEvent<HTMLSelectElement>;
}

function getOptionLabel(
  options: readonly SelectOption[] | undefined,
  value: string,
): string | undefined {
  return options?.find((option) => option.value === value)?.label;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      className,
      options,
      placeholder,
      value: valueProp,
      defaultValue,
      onChange,
      disabled,
      required,
      name,
      id,
      children,
      ...props
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? "",
    );
    const value = isControlled ? valueProp : uncontrolledValue;

    const [open, setOpen] = React.useState(false);

    const triggerRef = React.useRef<HTMLButtonElement>(null);
    React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

    const listOptions = options ?? [];
    const selectedLabel = getOptionLabel(options, value);
    const showPlaceholder = Boolean(placeholder) && !value;

    const commitValue = (nextValue: string) => {
      if (!isControlled) setUncontrolledValue(nextValue);
      onChange?.(createChangeEvent(nextValue));
      setOpen(false);
    };

    const handleOpenChange = (nextOpen: boolean) => {
      if (disabled) return;
      setOpen(nextOpen);
    };

    return (
      <Popover.Root open={open} onOpenChange={handleOpenChange} modal={false}>
        <div className="keys-ui-select-root">
          <Popover.Trigger asChild>
            <button
              ref={triggerRef}
              id={id}
              type="button"
              disabled={disabled}
              className={cn(
                "keys-ui-select-trigger",
                showPlaceholder && "keys-ui-select-trigger--placeholder",
                className,
              )}
              aria-haspopup="listbox"
              {...props}
            >
              <span className="keys-ui-select-value">
                {showPlaceholder ? placeholder : (selectedLabel ?? value)}
              </span>
              <ChevronDown
                size={16}
                className="keys-ui-select-caret"
                aria-hidden
              />
            </button>
          </Popover.Trigger>

          {name ? (
            <select
              name={name}
              required={required}
              value={value}
              tabIndex={-1}
              aria-hidden
              className="keys-ui-select-native"
              onChange={() => {}}
            >
              {placeholder ? <option value="">{placeholder}</option> : null}
              {options?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
          ) : null}

          {children}

          <Popover.Portal>
            <Popover.Content
              data-keys-ui-select-menu=""
              className="keys-ui-select-menu"
              align="start"
              side="bottom"
              sideOffset={6}
              collisionPadding={16}
              style={{ width: "var(--radix-popover-trigger-width)", zIndex: 100 }}
              onOpenAutoFocus={(event) => event.preventDefault()}
              onCloseAutoFocus={(event) => event.preventDefault()}
            >
              <ul
                className="keys-ui-select-list"
                role="listbox"
                aria-label={props["aria-label"] ?? "Opções"}
              >
                {listOptions.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <li key={option.value} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        disabled={option.disabled}
                        className={cn(
                          "keys-ui-select-option",
                          isSelected && "keys-ui-select-option--selected",
                          option.disabled && "keys-ui-select-option--disabled",
                        )}
                        onClick={() => {
                          if (!option.disabled) commitValue(option.value);
                        }}
                      >
                        {option.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Popover.Content>
          </Popover.Portal>
        </div>
      </Popover.Root>
    );
  },
);
Select.displayName = "Select";

export type SelectFieldProps = SelectProps & {
  label: string;
  fieldClassName?: string;
  labelClassName?: string;
};

export function SelectField({
  label,
  fieldClassName,
  labelClassName,
  id,
  ...selectProps
}: SelectFieldProps) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;

  return (
    <div className={cn("keys-ui-field", fieldClassName)}>
      <label className={cn("keys-ui-label", labelClassName)} htmlFor={selectId}>
        {label}
      </label>
      <Select id={selectId} {...selectProps} />
    </div>
  );
}
