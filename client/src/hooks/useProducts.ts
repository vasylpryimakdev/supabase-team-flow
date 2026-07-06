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

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData(["products", params]);

      queryClient.setQueriesData({ queryKey: ["products"] }, (old: any) => {
        if (!old) return old;
        const newProduct = {
          ...newData,
          id: "temp-id-" + Date.now(),
        } as Product;
        return {
          ...old,
          data: [...(old.data || []), newProduct],
          count: (old.count || 0) + 1,
        };
      });
      return { previousProducts };
    },

    onError: (_err, _newData, context) => {
      queryClient.setQueryData(["products", params], context?.previousProducts);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.update(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData(["products", params]);

      queryClient.setQueriesData({ queryKey: ["products"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((p: Product) =>
            p.id === id ? { ...p, ...data } : p
          ),
        };
      });
      return { previousProducts };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["products", params], context?.previousProducts);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData(["products", params]);

      queryClient.setQueriesData({ queryKey: ["products"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((p: Product) => p.id !== id),
          count: Math.max((old.count || 0) - 1, 0),
        };
      });
      return { previousProducts };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(["products", params], context?.previousProducts);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
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
