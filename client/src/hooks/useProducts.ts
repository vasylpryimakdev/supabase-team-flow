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
  const queryKey = ["products", JSON.stringify(params)];

  const listQuery = useQuery({
    queryKey,
    queryFn: () => productService.list(params),
    placeholderData: keepPreviousData,
  });

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const createMutation = useMutation({
    mutationFn: (data: Partial<Product>) => productService.create(data),
    onSuccess: invalidateProducts,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.update(id, data),
    onSuccess: invalidateProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: invalidateProducts,
  });

  return {
    products: listQuery.data?.data || [],
    count: listQuery.data?.count || 0,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    error: listQuery.error,
    createAsync: createMutation.mutateAsync,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    isMutating: createMutation.isPending || updateMutation.isPending ||
      deleteMutation.isPending,
  };
};
