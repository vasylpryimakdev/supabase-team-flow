import { api } from "./api";

export interface Product {
  id: string;
  title: string;
  description: string;
  status: "Draft" | "Active" | "Deleted";
  image_url?: string;
  created_at: string;
}

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

  list: (params: { page?: number; status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.status && params.status !== "all") {
      query.append("status", params.status);
    }
    if (params.search) query.append("search", params.search);

    return api.get<{ data: Product[]; count: number }>(
      `list-products?${query.toString()}`,
    );
  },
};
