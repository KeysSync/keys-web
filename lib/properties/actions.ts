"use server";

import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/cookies";
import {
  apiCreateProperty,
  apiDeleteProperty,
  apiGetProperties,
  apiUpdateProperty,
  type Property,
  type PropertyFilters,
} from "@/lib/properties/api";
import type { PropertyFormData } from "@/lib/properties/types";

export type PropertyActionState = {
  success: boolean;
  error?: string;
};

export async function createPropertyAction(
  data: PropertyFormData,
): Promise<PropertyActionState> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  try {
    await apiCreateProperty(accessToken, data);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro inesperado ao cadastrar imóvel." };
  }
}

export async function fetchPropertiesAction(
  filters?: PropertyFilters,
): Promise<Property[]> {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const response = await apiGetProperties(accessToken, filters);
    return response.items;
  } catch {
    return [];
  }
}

export async function deletePropertyAction(
  propertyId: string,
): Promise<PropertyActionState> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  try {
    await apiDeleteProperty(accessToken, propertyId);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro inesperado ao excluir imóvel." };
  }
}

export async function updatePropertyAction(
  propertyId: string,
  data: PropertyFormData,
): Promise<PropertyActionState> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  try {
    await apiUpdateProperty(accessToken, propertyId, data);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro inesperado ao atualizar imóvel." };
  }
}
