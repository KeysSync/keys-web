import "server-only";

import { getAccessToken } from "@/lib/auth/cookies";
import {
  apiGetCategories,
  apiGetProperty,
  apiGetProperties,
  apiGetSubcategories,
  type Category,
  type Property,
  type Subcategory,
} from "@/lib/properties/api";
import { cache } from "react";

export const getProperties = cache(async (): Promise<Property[]> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const response = await apiGetProperties(accessToken);
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

export const getPropertyById = cache(async (propertyId: string): Promise<Property | null> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    return await apiGetProperty(accessToken, propertyId);
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
