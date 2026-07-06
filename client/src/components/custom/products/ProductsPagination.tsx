import type { ProductFilters } from "../../../types/product.types";
import { Button } from "../../ui/button";

type Props = {
  filters: ProductFilters;
  count: number;
  onUpdateFilters: (updates: Partial<ProductFilters>) => void;
};

const ProductsPagination = ({ filters, count, onUpdateFilters }: Props) => {
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
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
            onUpdateFilters({
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
            onUpdateFilters({
              page: filters.page + 1,
            })
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductsPagination;
