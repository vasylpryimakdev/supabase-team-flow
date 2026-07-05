import { MoreHorizontal } from "lucide-react";
import type { Product } from "../../../types/product.types";
import { TableCell, TableRow } from "../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { cn } from "../../../lib/utils";

interface ProductDisplayRowProps {
  product: Product;
  onEdit: () => void;
  onRemove: () => void;
}

export const ProductDisplayRow = ({
  product,
  onEdit,
  onRemove,
}: ProductDisplayRowProps) => {
  const isDeleted = product.status === "Deleted";

  return (
    <TableRow className={cn(isDeleted && "opacity-50")}>
      <TableCell className="w-16">
        <div
          className={cn(
            "w-10 h-10 rounded-md overflow-hidden bg-zinc-800 flex items-center justify-center border border-zinc-700",
            isDeleted && "grayscale",
          )}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-zinc-500 uppercase">No img</span>
          )}
        </div>
      </TableCell>

      <TableCell className="font-medium flex items-center gap-3 whitespace-normal">
        <div className="flex flex-col gap-1 min-w-0 w-full">
          <div className="font-medium truncate">{product.title}</div>
          <div className="text-xs text-muted-foreground line-clamp-3">
            {product.description}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Badge
          variant={
            isDeleted
              ? "secondary"
              : product.status === "Active"
                ? "default"
                : "secondary"
          }
        >
          {product.status}
        </Badge>
      </TableCell>

      <TableCell className="text-zinc-400">{product.created_by_name}</TableCell>

      <TableCell className="text-zinc-500 text-sm">
        {new Date(product.created_at).toLocaleDateString()}
      </TableCell>

      <TableCell className="text-right">
        {!isDeleted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={onRemove}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span className="self-center">-</span>
        )}
      </TableCell>
    </TableRow>
  );
};
