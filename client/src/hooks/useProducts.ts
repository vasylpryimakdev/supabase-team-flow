import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Product, productService } from "../services/product.service";

export const useProducts = (
  params: { page: number; status: string; search: string },
) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.list(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Product>) => productService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  return {
    products: listQuery.data?.data,
    count: listQuery.data?.count,
    isLoading: listQuery.isLoading,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
};
