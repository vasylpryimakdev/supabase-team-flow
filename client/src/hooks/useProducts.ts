import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  type ProductListParams,
  productService,
} from "../services/product.service";
import type { Product } from "../types/product.types";

export const useProducts = (params: ProductListParams) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.list(params),
    placeholderData: keepPreviousData,
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
    products: listQuery.data?.data || [],
    count: listQuery.data?.count || 0,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    error: listQuery.error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    isMutating: createMutation.isPending || updateMutation.isPending ||
      deleteMutation.isPending,
  };
};
