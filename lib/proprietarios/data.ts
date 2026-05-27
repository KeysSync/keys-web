import "server-only";

import { cache } from "react";
import { getAccessToken } from "@/lib/auth/cookies";
import {
  apiGetPerson,
  apiListPersons,
  mapPersonDtoToListRow,
  personDtoToFormData,
} from "@/lib/proprietarios/api";
import type { ProprietarioFormData, ProprietarioListRow } from "@/lib/proprietarios/types";

export const getProprietariosList = cache(async (): Promise<ProprietarioListRow[]> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const items = await apiListPersons(accessToken);
    return items.map(mapPersonDtoToListRow);
  } catch {
    return [];
  }
});

export const getProprietarioFormById = cache(
  async (id: string): Promise<ProprietarioFormData | null> => {
    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    try {
      const dto = await apiGetPerson(accessToken, id);
      return personDtoToFormData(dto);
    } catch {
      return null;
    }
  },
);
