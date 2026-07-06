import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/custom/common/Spinner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { ProductDisplayRow } from "../components/custom/products/ProductDisplayRow";
import { ProductEditRow } from "../components/custom/products/ProductEditRow";

import {
  DEFAULT_PRODUCT_FILTERS,
  type Product,
  type ProductFilters,
  type ProductSortField,
} from "../types/product.types";
import type { ProductFormData } from "../shared/schemas/product.schema";
import { useAuthStore } from "../stores/auth.store";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import ProductCreateDialog from "../components/custom/products/ProductCreateDialog";
import ProductsFilters from "../components/custom/products/ProductsFilters";

const ProductsPage = () => {
  const [filters, setFilters] = useState<ProductFilters>(
    DEFAULT_PRODUCT_FILTERS,
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { products, count, isLoading, createAsync, update, remove } =
    useProducts(filters);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const profile = useAuthStore((s) => s.profile);

  const handleCreate = async (data: ProductFormData): Promise<Product> => {
    const product = await createAsync({
      title: data.title,
      description: data.description,
      status: data.status ?? "Draft",
    });

    setIsFormOpen(false);

    return product;
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

  const getSortIcon = (field: ProductSortField) => {
    if (filters.sortBy !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }

    return filters.sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
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
          onCloseModal={() => setIsFormOpen(false)}
          onCreate={handleCreate}
        />
      </div>
      <ProductsFilters
        profile={profile}
        filters={filters}
        onUpdateFilters={updateFilters}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0"
                  onClick={() => handleSort("created_at")}
                >
                  Created
                  {getSortIcon("created_at")}
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0"
                  onClick={() => handleSort("updated_at")}
                >
                  Updated
                  {getSortIcon("updated_at")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) =>
                editingId === product.id ? (
                  <ProductEditRow
                    key={product.id}
                    product={product}
                    onUpdate={handleUpdate}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <ProductDisplayRow
                    key={product.id}
                    product={product}
                    profile={profile}
                    onEdit={() => setEditingId(product.id)}
                    onRemove={() => remove(product.id)}
                  />
                ),
              )
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t px-4 py-4">
          <p className="text-sm text-muted-foreground">
            Page {filters.page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === 1}
              onClick={() =>
                updateFilters({
                  page: filters.page - 1,
                })
              }
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === totalPages}
              onClick={() =>
                updateFilters({
                  page: filters.page + 1,
                })
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
