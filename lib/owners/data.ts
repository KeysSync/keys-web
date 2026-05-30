import "server-only";

import { cache } from "react";
import { getAccessToken } from "@/lib/auth/cookies";
import {
  apiGetPerson,
  apiListPersons,
  mapPersonDtoToListRow,
  personDtoToFormData,
} from "@/lib/owners/api";
import type { OwnerFormData, OwnerListRow } from "@/lib/owners/types";

export const getOwnersList = cache(async (): Promise<OwnerListRow[]> => {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const items = await apiListPersons(accessToken);
    return items.map(mapPersonDtoToListRow);
  } catch {
    return [];
  }
});

export const getOwnerFormById = cache(
  async (id: string): Promise<OwnerFormData | null> => {
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
