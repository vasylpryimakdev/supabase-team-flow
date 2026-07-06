import { api } from "./api";
import type { Product, ProductFilters } from "../types/product.types";

export type ProductListParams = ProductFilters;

export const productService = {
  create: (data: Partial<Product>) =>
    api.post<Product>("manage-product", { action: "create", payload: data }),

  update: (id: string, data: Partial<Product>) =>
    api.post<Product>("manage-product", {
      action: "update",
      id,
      payload: data,
    }),

  delete: (id: string) =>
    api.post<{ success: boolean }>("manage-product", { action: "delete", id }),

  list: (params: ProductListParams) => {
    const query = new URLSearchParams();

    if (params.page) {
      query.append("page", params.page.toString());
    }

    if (params.status && params.status !== "all") {
      query.append("status", params.status);
    }

    if (params.search?.trim()) {
      query.append("search", params.search.trim());
    }

    if (params.createdBy && params.createdBy !== "all") {
      query.append("created_by", params.createdBy);
    }

    query.append("sort_by", params.sortBy);
    query.append("sort_order", params.sortOrder);

    return api.get<{ data: Product[]; count: number }>(
      `list-products?${query.toString()}`,
    );
  },
};
