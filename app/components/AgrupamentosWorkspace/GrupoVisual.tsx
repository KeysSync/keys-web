"use client";

import {
  Building2,
  Home,
  Key,
  Layers,
  MapPin,
  Sparkles,
  Star,
  Tag,
  type LucideIcon,
} from "lucide-react";
import type { GrupoVisualType } from "@/lib/dashboards/agrupamentos/types";
import { isGrupoImage, isGrupoNone } from "@/lib/dashboards/agrupamentos/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  Home,
  MapPin,
  Star,
  Tag,
  Key,
  Layers,
  Sparkles,
};

export function GrupoIcon({
  visualValue,
  size = 18,
  color = "#08080C",
}: {
  visualValue: string;
  size?: number;
  color?: string;
}) {
  const Icon = ICON_MAP[visualValue] ?? Building2;
  return <Icon size={size} strokeWidth={2} color={color} aria-hidden />;
}

type GrupoVisualProps = {
  visualType: GrupoVisualType;
  visualValue: string;
  corFundo?: string;
  corIcone?: string;
  size?: number;
  className?: string;
};

export function GrupoVisual({
  visualType,
  visualValue,
  corFundo,
  corIcone,
  size = 18,
  className = "",
}: GrupoVisualProps) {
  if (isGrupoNone({ visualType })) return null;

  if (isGrupoImage({ visualType, visualValue })) {
    return (
      <span
        className={`agrupamentos-grupo-visual agrupamentos-grupo-visual--image ${className}`}
        style={corFundo ? { backgroundColor: corFundo } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={visualValue} alt="" width={size} height={size} />
      </span>
    );
  }

  return (
    <span
      className={`agrupamentos-grupo-visual ${className}`}
      style={corFundo ? { backgroundColor: corFundo } : undefined}
    >
      <GrupoIcon visualValue={visualValue} size={size} color={corIcone} />
    </span>
  );
}

export function AnuncioImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (!src.trim()) {
    return (
      <div className={`agrupamentos-anuncio__image agrupamentos-anuncio__image--empty ${className}`}>
        <Building2 size={40} aria-hidden />
      </div>
    );
  }

  return (
    <div className={`agrupamentos-anuncio__image ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
    </div>
  );
}
