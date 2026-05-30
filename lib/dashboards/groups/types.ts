export type GroupVisualType = "none" | "icon" | "image";

export const DEFAULT_GROUP_BACKGROUND = "#F5F5F5";
export const DEFAULT_GROUP_ICON_COLOR = "#616161";
export const DEFAULT_GROUP_TEXT_COLOR = "#424242";
export const DEFAULT_GROUP_BORDER_COLOR = "transparent";
export const DEFAULT_GROUP_ICON = "Tag";
export const DEFAULT_GROUP_BORDER_WHEN_ENABLED = "#BDBDBD";

export type Group = {
  id: string;
  name: string;
  visualType: GroupVisualType;
  /** Nome do ícone Lucide ou URL da imagem */
  visualValue: string;
  backgroundColor: string;
  iconColor: string;
  textColor: string;
  borderColor: string;
};

export type ListingExample = {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  address: string;
  neighborhood: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  areaSqm: number;
};

export const GROUP_ICON_OPTIONS = [
  { value: "Building2", label: "Prédio" },
  { value: "Home", label: "Casa" },
  { value: "MapPin", label: "Localização" },
  { value: "Star", label: "Destaque" },
  { value: "Tag", label: "Tag" },
  { value: "Key", label: "Chave" },
  { value: "Layers", label: "Camadas" },
  { value: "Sparkles", label: "Premium" },
] as const;

export const DEFAULT_LISTING_EXAMPLE: ListingExample = {
  title: "Apartamento 3 quartos — Jardins",
  description:
    "Amplo apartamento com varanda gourmet, suíte master e vaga coberta. Condomínio com lazer completo.",
  price: "R$ 4.850/mês",
  imageUrl:
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  address: "Rua Oscar Freire, 512",
  neighborhood: "Jardins, São Paulo — SP",
  propertyType: "Apartamento",
  bedrooms: 3,
  bathrooms: 2,
  parkingSpots: 1,
  areaSqm: 98,
};

export function createGroupId() {
  return `group-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createEmptyGroupDraft(): Omit<Group, "id"> {
  return {
    name: "",
    visualType: "image",
    visualValue: "",
    backgroundColor: DEFAULT_GROUP_BACKGROUND,
    iconColor: DEFAULT_GROUP_ICON_COLOR,
    textColor: DEFAULT_GROUP_TEXT_COLOR,
    borderColor: DEFAULT_GROUP_BORDER_COLOR,
  };
}

export function normalizeGroupColor(value: string, fallback: string): string {
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed.toUpperCase();
  if (/^#[0-9A-Fa-f]{3}$/.test(trimmed)) {
    const hex = trimmed.slice(1);
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toUpperCase();
  }
  return fallback;
}

export function normalizeGroupBackgroundColor(value: string): string {
  return normalizeGroupColor(value, DEFAULT_GROUP_BACKGROUND);
}

export function normalizeGroupIconColor(value: string): string {
  return normalizeGroupColor(value, DEFAULT_GROUP_ICON_COLOR);
}

export function normalizeGroupTextColor(value: string): string {
  return normalizeGroupColor(value, DEFAULT_GROUP_TEXT_COLOR);
}

export function normalizeGroupBorderColor(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "transparent") {
    return DEFAULT_GROUP_BORDER_COLOR;
  }
  return normalizeGroupColor(trimmed, DEFAULT_GROUP_BORDER_COLOR);
}

export function isGroupBorderVisible(borderColor: string) {
  return normalizeGroupBorderColor(borderColor) !== DEFAULT_GROUP_BORDER_COLOR;
}

export function isGroupIcon(group: Pick<Group, "visualType">) {
  return group.visualType === "icon";
}

export function isGroupImage(group: Pick<Group, "visualType" | "visualValue">) {
  return group.visualType === "image" && group.visualValue.trim().length > 0;
}

export function isGroupNone(group: Pick<Group, "visualType">) {
  return group.visualType === "none";
}

export function resolveGroupVisualValue(
  visualType: GroupVisualType,
  visualValue: string,
): string {
  if (visualType === "none") return "";
  if (visualType === "icon") {
    return visualValue.trim() || DEFAULT_GROUP_ICON;
  }
  return visualValue.trim();
}

export function buildGroupFieldsFromDraft(
  draft: Omit<Group, "id">,
): Omit<Group, "id"> {
  return {
    name: draft.name.trim(),
    visualType: draft.visualType,
    visualValue: resolveGroupVisualValue(draft.visualType, draft.visualValue),
    backgroundColor: normalizeGroupBackgroundColor(draft.backgroundColor),
    iconColor: normalizeGroupIconColor(draft.iconColor),
    textColor: normalizeGroupTextColor(draft.textColor),
    borderColor: normalizeGroupBorderColor(draft.borderColor),
  };
}
