import * as React from "react";

import { cn } from "@/lib/utils";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Ícone à esquerda (ex.: Lucide), renderizado em preto sólido */
  icon?: React.ReactNode;
  /** URL da imagem circular à esquerda (avatar) */
  avatarSrc?: string;
  avatarAlt?: string;
  /** Cor de fundo do chip (padrão: #EBE4FF) */
  backgroundColor?: string;
  /** Cor do ícone quando icon é passado (padrão: #08080C) */
  iconColor?: string;
  /** Cor do texto do chip (padrão: #08080C) */
  textColor?: string;
  /** Cor da borda do chip ("transparent" = sem borda) */
  borderColor?: string;
}

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    { className, icon, avatarSrc, avatarAlt = "", backgroundColor, iconColor, textColor, borderColor, style, children, ...props },
    ref,
  ) => {
    const hasAvatar = Boolean(avatarSrc?.trim());
    const hasIcon = Boolean(icon) && !hasAvatar;
    const hasBorder = Boolean(borderColor && borderColor !== "transparent");

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-8 py-1.5",
          "text-sm font-normal leading-snug text-[#08080C]",
          !backgroundColor && "bg-[#EBE4FF]",
          hasBorder && "border border-solid",
          className,
        )}
        style={{
          "padding": "6px 10px",
          ...(backgroundColor ? { backgroundColor } : undefined),
          ...(textColor ? { color: textColor } : undefined),
          ...(hasBorder ? { borderColor } : undefined),
          ...style,
        }}
        {...props}
      >
        {hasAvatar ? (
          <span className="inline-flex h-6 w-6 shrink-0 overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt={avatarAlt}
              className="h-full w-full object-cover"
            />
          </span>
        ) : null}

        {hasIcon ? (
          <span
            className="inline-flex shrink-0 items-center [&>svg]:size-4 [&>svg]:shrink-0"
            style={{ color: iconColor ?? "#08080C" }}
            aria-hidden
          >
            {icon}
          </span>
        ) : null}

        {children ? (
          <span className="truncate leading-snug">{children}</span>
        ) : null}
      </span>
    );
  },
);
Chip.displayName = "Chip";

export { Chip };

