import "server-only";

import { getAccessToken } from "@/lib/auth/cookies";
import {
  apiGetCategories,
  apiGetImovel,
  apiGetImoveis,
  apiGetSubcategories,
  type Category,
  type Imovel,
  type Subcategory,
} from "@/lib/imoveis/api";
import { cache } from "react";

export const getImoveis = cache(async (): Promise<Imovel[]> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const response = await apiGetImoveis(accessToken);
    return response.items;
  } catch {
    return [];
  }
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    return await apiGetCategories(accessToken);
  } catch {
    return [];
  }
});

export const getImovelById = cache(async (propertyId: string): Promise<Imovel | null> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    return await apiGetImovel(accessToken, propertyId);
  } catch {
    return null;
  }
});

export const getSubcategories = cache(async (): Promise<Subcategory[]> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    return await apiGetSubcategories(accessToken);
  } catch {
    return [];
  }
});
