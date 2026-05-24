export type GrupoVisualType = "none" | "icon" | "image";

export const DEFAULT_GRUPO_COR_FUNDO = "#F5F5F5";
export const DEFAULT_GRUPO_COR_ICONE = "#616161";
export const DEFAULT_GRUPO_COR_TEXTO = "#424242";
export const DEFAULT_GRUPO_COR_BORDA = "transparent";
export const DEFAULT_GRUPO_ICON = "Tag";
export const DEFAULT_GRUPO_BORDER_WHEN_ENABLED = "#BDBDBD";

export type Grupo = {
  id: string;
  nome: string;
  visualType: GrupoVisualType;
  /** Nome do ícone Lucide ou URL da imagem */
  visualValue: string;
  /** Cor de fundo do chip / identificação visual do grupo */
  corFundo: string;
  /** Cor do ícone quando visualType === "icon" */
  corIcone: string;
  /** Cor do texto do chip */
  corTexto: string;
  /** Cor da borda do chip ("transparent" = sem borda) */
  corBorda: string;
};

export type AnuncioExemplo = {
  titulo: string;
  descricao: string;
  preco: string;
  imageUrl: string;
  endereco: string;
  bairro: string;
  tipo: string;
  quartos: number;
  banheiros: number;
  vagas: number;
  areaM2: number;
};

export const GRUPO_ICON_OPTIONS = [
  { value: "Building2", label: "Prédio" },
  { value: "Home", label: "Casa" },
  { value: "MapPin", label: "Localização" },
  { value: "Star", label: "Destaque" },
  { value: "Tag", label: "Tag" },
  { value: "Key", label: "Chave" },
  { value: "Layers", label: "Camadas" },
  { value: "Sparkles", label: "Premium" },
] as const;

export const DEFAULT_ANUNCIO_EXEMPLO: AnuncioExemplo = {
  titulo: "Apartamento 3 quartos — Jardins",
  descricao:
    "Amplo apartamento com varanda gourmet, suíte master e vaga coberta. Condomínio com lazer completo.",
  preco: "R$ 4.850/mês",
  imageUrl:
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  endereco: "Rua Oscar Freire, 512",
  bairro: "Jardins, São Paulo — SP",
  tipo: "Apartamento",
  quartos: 3,
  banheiros: 2,
  vagas: 1,
  areaM2: 98,
};

export function createGrupoId() {
  return `grupo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createEmptyGrupoDraft(): Omit<Grupo, "id"> {
  return {
    nome: "",
    visualType: "icon",
    visualValue: DEFAULT_GRUPO_ICON,
    corFundo: DEFAULT_GRUPO_COR_FUNDO,
    corIcone: DEFAULT_GRUPO_COR_ICONE,
    corTexto: DEFAULT_GRUPO_COR_TEXTO,
    corBorda: DEFAULT_GRUPO_COR_BORDA,
  };
}

export function normalizeGrupoCor(value: string, fallback: string): string {
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed.toUpperCase();
  if (/^#[0-9A-Fa-f]{3}$/.test(trimmed)) {
    const hex = trimmed.slice(1);
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toUpperCase();
  }
  return fallback;
}

export function normalizeGrupoCorFundo(value: string): string {
  return normalizeGrupoCor(value, DEFAULT_GRUPO_COR_FUNDO);
}

export function normalizeGrupoCorIcone(value: string): string {
  return normalizeGrupoCor(value, DEFAULT_GRUPO_COR_ICONE);
}

export function normalizeGrupoCorTexto(value: string): string {
  return normalizeGrupoCor(value, DEFAULT_GRUPO_COR_TEXTO);
}

export function normalizeGrupoCorBorda(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "transparent") {
    return DEFAULT_GRUPO_COR_BORDA;
  }
  return normalizeGrupoCor(trimmed, DEFAULT_GRUPO_COR_BORDA);
}

export function isGrupoBorderVisible(corBorda: string) {
  return normalizeGrupoCorBorda(corBorda) !== DEFAULT_GRUPO_COR_BORDA;
}

export function isGrupoIcon(grupo: Pick<Grupo, "visualType">) {
  return grupo.visualType === "icon";
}

export function isGrupoImage(grupo: Pick<Grupo, "visualType" | "visualValue">) {
  return grupo.visualType === "image" && grupo.visualValue.trim().length > 0;
}

export function isGrupoNone(grupo: Pick<Grupo, "visualType">) {
  return grupo.visualType === "none";
}

export function resolveGrupoVisualValue(
  visualType: GrupoVisualType,
  visualValue: string,
): string {
  if (visualType === "none") return "";
  if (visualType === "icon") {
    return visualValue.trim() || DEFAULT_GRUPO_ICON;
  }
  return visualValue.trim();
}

export function buildGrupoFieldsFromDraft(
  draft: Omit<Grupo, "id">,
): Omit<Grupo, "id"> {
  return {
    nome: draft.nome.trim(),
    visualType: draft.visualType,
    visualValue: resolveGrupoVisualValue(draft.visualType, draft.visualValue),
    corFundo: normalizeGrupoCorFundo(draft.corFundo),
    corIcone: normalizeGrupoCorIcone(draft.corIcone),
    corTexto: normalizeGrupoCorTexto(draft.corTexto),
    corBorda: normalizeGrupoCorBorda(draft.corBorda),
  };
}
