"use server";

import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/cookies";
import {
  apiCreateImovel,
  apiDeleteImovel,
  apiGetImoveis,
  apiUpdateImovel,
  type Imovel,
  type ImovelFilters,
} from "@/lib/imoveis/api";
import type { ImovelFormData } from "@/lib/imoveis/types";

export type ImovelActionState = {
  success: boolean;
  error?: string;
};

export async function createImovelAction(
  data: ImovelFormData,
): Promise<ImovelActionState> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  try {
    await apiCreateImovel(accessToken, data);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro inesperado ao cadastrar imóvel." };
  }
}

export async function fetchImoveisAction(
  filters?: ImovelFilters,
): Promise<Imovel[]> {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const response = await apiGetImoveis(accessToken, filters);
    return response.items;
  } catch {
    return [];
  }
}

export async function deleteImovelAction(
  propertyId: string,
): Promise<ImovelActionState> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  try {
    await apiDeleteImovel(accessToken, propertyId);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro inesperado ao excluir imóvel." };
  }
}

export async function updateImovelAction(
  propertyId: string,
  data: ImovelFormData,
): Promise<ImovelActionState> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  try {
    await apiUpdateImovel(accessToken, propertyId, data);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro inesperado ao atualizar imóvel." };
  }
}
