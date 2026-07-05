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
  DELETED: "Deleted",
} as const;

export const PRODUCT_STATUS_VALUES = Object.values(PRODUCT_STATUSES) as [
  string,
  ...string[],
];

export type ProductStatus =
  typeof PRODUCT_STATUSES[keyof typeof PRODUCT_STATUSES];
