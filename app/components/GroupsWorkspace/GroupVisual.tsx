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
import type { GroupVisualType } from "@/lib/dashboards/groups/types";
import { isGroupImage, isGroupNone } from "@/lib/dashboards/groups/types";

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

export function GroupIcon({
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

type GroupVisualProps = {
  visualType: GroupVisualType;
  visualValue: string;
  backgroundColor?: string;
  iconColor?: string;
  size?: number;
  className?: string;
};

export function GroupVisual({
  visualType,
  visualValue,
  backgroundColor,
  iconColor,
  size = 18,
  className = "",
}: GroupVisualProps) {
  if (isGroupNone({ visualType })) return null;

  if (isGroupImage({ visualType, visualValue })) {
    return (
      <span
        className={`groups-group-visual groups-group-visual--image ${className}`}
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={visualValue} alt="" width={size} height={size} />
      </span>
    );
  }

  return (
    <span
      className={`groups-group-visual ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <GroupIcon visualValue={visualValue} size={size} color={iconColor} />
    </span>
  );
}

export function ListingImage({
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
      <div className={`groups-listing__image groups-listing__image--empty ${className}`}>
        <Building2 size={40} aria-hidden />
      </div>
    );
  }

  return (
    <div className={`groups-listing__image ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
    </div>
  );
}
