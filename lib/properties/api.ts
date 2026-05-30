import { apiFetch } from "@/lib/api/client";
import type { PropertyFormData } from "@/lib/properties/types";

export type PropertyStatus = "available" | "rented" | "repairing";

export interface PropertyAddress {
  postal_code: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Property {
  id: string;
  address: PropertyAddress;
  code: string;
  status: PropertyStatus;
  rent_price: string;
  category_id: number;
  subcategory_id: number;
}

export interface PropertyListResponse {
  items: Property[];
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

export interface PropertyFilters {
  status?: PropertyStatus;
  category_id?: number;
  subcategory_id?: number;
  city?: string;
  state?: string;
  code?: string;
  rent_price_min?: number;
  rent_price_max?: number;
}

function buildFilterQuery(filters?: PropertyFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "" && value !== 0) {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function apiGetProperties(
  accessToken: string,
  filters?: PropertyFilters,
): Promise<PropertyListResponse> {
  return apiFetch<PropertyListResponse>(`/properties/v1/${buildFilterQuery(filters)}`, {
    method: "GET",
    bearer: accessToken,
  });
}

export function apiCreateProperty(
  accessToken: string,
  data: PropertyFormData,
): Promise<Property> {
  return apiFetch<Property>("/properties/v1/", {
    method: "POST",
    bearer: accessToken,
    json: data,
  });
}

export function apiGetProperty(accessToken: string, propertyId: string): Promise<Property> {
  return apiFetch<Property>(`/properties/v1/${propertyId}`, {
    method: "GET",
    bearer: accessToken,
  });
}

export function apiUpdateProperty(
  accessToken: string,
  propertyId: string,
  data: PropertyFormData,
): Promise<Property> {
  return apiFetch<Property>(`/properties/v1/${propertyId}`, {
    method: "PUT",
    bearer: accessToken,
    json: data,
  });
}

export function apiDeleteProperty(accessToken: string, propertyId: string): Promise<void> {
  return apiFetch<void>(`/properties/v1/${propertyId}`, {
    method: "DELETE",
    bearer: accessToken,
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
