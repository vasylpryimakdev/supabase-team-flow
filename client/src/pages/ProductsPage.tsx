import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import {
  DEFAULT_PRODUCT_FILTERS,
  type Product,
  type ProductFilters,
  type ProductSortField,
} from "../types/product.types";
import type { ProductFormData } from "../shared/schemas/product.schema";
import { useAuthStore } from "../stores/auth.store";
import ProductCreateDialog from "../components/custom/products/ProductCreateDialog";
import ProductsFilters from "../components/custom/products/ProductsFilters";
import ProductsTable from "../components/custom/products/ProductsTable";
import { handleError } from "../shared/errors/handleError";
import { storageService } from "../services/storage.service";

const ProductsPage = () => {
  const [filters, setFilters] = useState<ProductFilters>(
    DEFAULT_PRODUCT_FILTERS,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { products, count, isLoading, createAsync, update, remove } =
    useProducts(filters);

  const profile = useAuthStore((s) => s.profile);

  const handleCreate = async (
    data: ProductFormData,
    file: File | null,
  ): Promise<Product | undefined> => {
    try {
      const product = await createAsync({
        title: data.title,
        description: data.description,
        status: data.status ?? "Draft",
      });

      if (file) {
        const imagePath = await storageService.uploadProductImage(
          product.id,
          file,
        );

        await update({
          id: product.id,
          data: {
            image_path: imagePath,
          },
        });
      }

      setIsFormOpen(false);

      return product;
    } catch (error) {
      handleError(error);
    }
  };

  const handleUpdate = (id: string, data: Partial<Product>) => {
    update({
      id,
      data,
    });

    setEditingId(null);
  };

  const updateFilters = (updates: Partial<ProductFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSort = (field: ProductSortField) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field
          ? prev.sortOrder === "asc"
            ? "desc"
            : "asc"
          : "desc",
      page: 1,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Create, edit and manage your team's products.
          </p>
        </div>

        <ProductCreateDialog
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          onCreate={handleCreate}
        />
      </div>
      <ProductsFilters
        profile={profile}
        filters={filters}
        onUpdateFilters={updateFilters}
      />

      <ProductsTable
        products={products}
        filters={filters}
        count={count}
        isLoading={isLoading}
        profile={profile}
        onSort={handleSort}
        editingId={editingId}
        onUpdateProduct={handleUpdate}
        onUpdateFilters={updateFilters}
        onRemove={remove}
        setEditingId={setEditingId}
      />
    </div>
  );
};

export default ProductsPage;
