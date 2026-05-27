"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { CheckCircle, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import "./toast.css";

export type ToastVariant = "success" | "error";

export type ToastData = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

const variantIcon: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="keys-toast-icon" />,
  error: <XCircle className="keys-toast-icon" />,
};

export function Toast({
  toast,
  onOpenChange,
}: {
  toast: ToastData;
  onOpenChange: (open: boolean) => void;
}) {
  const variant = toast.variant ?? "success";

  return (
    <ToastPrimitive.Root
      className={cn("keys-toast", `keys-toast--${variant}`)}
      onOpenChange={onOpenChange}
      duration={variant === "error" ? 6000 : 4000}
    >
      {variantIcon[variant]}

      <div className="keys-toast-body">
        <ToastPrimitive.Title className="keys-toast-title">
          {toast.title}
        </ToastPrimitive.Title>
        {toast.description ? (
          <ToastPrimitive.Description className="keys-toast-description">
            {toast.description}
          </ToastPrimitive.Description>
        ) : null}
      </div>

      <ToastPrimitive.Close className="keys-toast-close" aria-label="Fechar">
        <X size={14} />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

export function ToastViewport() {
  return <ToastPrimitive.Viewport className="keys-toast-viewport" />;
}

export { ToastPrimitive };
