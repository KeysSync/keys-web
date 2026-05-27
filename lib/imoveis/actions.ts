"use server";

import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/cookies";
import { apiCreateImovel, apiUpdateImovel } from "@/lib/imoveis/api";
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
