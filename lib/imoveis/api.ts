import { apiFetch } from "@/lib/api/client";
import type { ImovelFormData } from "@/lib/imoveis/types";

export type ImovelStatus = "available" | "rented" | "repairing";

export interface ImovelAddress {
  postal_code: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Imovel {
  id: string;
  address: ImovelAddress;
  code: string;
  status: ImovelStatus;
  rent_price: string;
  category_id: number;
  subcategory_id: number;
}

export interface ImovelListResponse {
  items: Imovel[];
  next_cursor: string | null;
}

export interface Category {
  id: number;
  name: string;
}

export interface Subcategory {
  id: number;
  category_id: number;
  name: string;
}

export function apiGetImoveis(accessToken: string): Promise<ImovelListResponse> {
  return apiFetch<ImovelListResponse>("/properties/v1/", {
    method: "GET",
    bearer: accessToken,
  });
}

export function apiCreateImovel(
  accessToken: string,
  data: ImovelFormData,
): Promise<Imovel> {
  return apiFetch<Imovel>("/properties/v1/", {
    method: "POST",
    bearer: accessToken,
    json: data,
  });
}

export function apiGetImovel(accessToken: string, propertyId: string): Promise<Imovel> {
  return apiFetch<Imovel>(`/properties/v1/${propertyId}`, {
    method: "GET",
    bearer: accessToken,
  });
}

export function apiUpdateImovel(
  accessToken: string,
  propertyId: string,
  data: ImovelFormData,
): Promise<Imovel> {
  return apiFetch<Imovel>(`/properties/v1/${propertyId}`, {
    method: "PUT",
    bearer: accessToken,
    json: data,
  });
}

export function apiGetCategories(accessToken: string): Promise<Category[]> {
  return apiFetch<Category[]>("/categories/v1/", {
    method: "GET",
    bearer: accessToken,
  });
}

export function apiGetSubcategories(accessToken: string): Promise<Subcategory[]> {
  return apiFetch<Subcategory[]>("/subcategories/v1/", {
    method: "GET",
    bearer: accessToken,
  });
}
