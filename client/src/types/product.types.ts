export interface Product {
  id: string;
  title: string;
  description: string;
  status: ProductStatus;
  image_url?: string;
  image_path?: string;
  created_at: string;
  updated_at: string;
  created_by_name: string;
}

export const PRODUCT_STATUSES = {
  DRAFT: "Draft",
  ACTIVE: "Active",
} as const;

export const PRODUCT_STATUS_VALUES = [
  PRODUCT_STATUSES.DRAFT,
  PRODUCT_STATUSES.ACTIVE,
] as const;

export type ProductStatus = (typeof PRODUCT_STATUS_VALUES)[number];

export type ProductStatusFilter = ProductStatus | "all";

export type ProductSortField = "created_at" | "updated_at";

export type SortOrder = "asc" | "desc";

export interface ProductFilters {
  page: number;
  search: string;
  status: ProductStatusFilter;
  createdBy: string;
  sortBy: ProductSortField;
  sortOrder: SortOrder;
}

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  page: 1,
  search: "",
  status: "all",
  createdBy: "all",
  sortBy: "created_at",
  sortOrder: "desc",
};
