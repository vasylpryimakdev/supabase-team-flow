import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type {
  Product,
  ProductFilters,
  ProductSortField,
} from "../../../types/product.types";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Spinner } from "../common/Spinner";
import { ProductDisplayRow } from "./ProductDisplayRow";
import ProductsPagination from "./ProductsPagination";
import { ProductEditRow } from "./ProductEditRow";
import type { Profile } from "../../../types/profile.type";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  products: Product[];
  filters: ProductFilters;
  count: number;
  isLoading: boolean;
  profile: Profile | null;
  onSort: (field: ProductSortField) => void;
  editingId: string | null;
  onUpdateProduct: (id: string, data: Partial<Product>) => void;
  onUpdateFilters: (updates: Partial<ProductFilters>) => void;
  onRemove: UseMutateFunction<{ success: boolean }, Error, string, unknown>;
  setEditingId: Dispatch<SetStateAction<string | null>>;
};

const ProductsTable = ({
  products,
  filters,
  count,
  isLoading,
  profile,
  onSort,
  editingId,
  onUpdateProduct,
  onUpdateFilters,
  onRemove,
  setEditingId,
}: Props) => {
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
                onClick={() => onSort("created_at")}
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
                onClick={() => onSort("updated_at")}
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
                  onUpdate={onUpdateProduct}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <ProductDisplayRow
                  key={product.id}
                  product={product}
                  profile={profile}
                  onEdit={() => setEditingId(product.id)}
                  onRemove={() => onRemove(product.id)}
                />
              ),
            )
          )}
        </TableBody>
      </Table>
      <ProductsPagination
        filters={filters}
        count={count}
        onUpdateFilters={onUpdateFilters}
      />
    </div>
  );
};

export default ProductsTable;
