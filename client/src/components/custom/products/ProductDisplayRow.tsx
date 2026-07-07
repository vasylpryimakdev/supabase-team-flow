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
import type { Profile } from "../../../types/profile.type";

interface ProductDisplayRowProps {
  product: Product;
  profile: Profile | null;
  onEdit: () => void;
  onRemove: () => void;
  onActivate: (id: string) => Promise<void>;
}

export const ProductDisplayRow = ({
  profile,
  product,
  onEdit,
  onRemove,
  onActivate,
}: ProductDisplayRowProps) => {
  return (
    <TableRow>
      <TableCell className="w-16">
        {product.image_url && (
          <div className="w-10 h-10 rounded-md overflow-hidden bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
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
        <Badge variant={product.status === "Active" ? "default" : "secondary"}>
          {product.status}
        </Badge>
      </TableCell>

      <TableCell className="text-zinc-400">
        {product.created_by_name === profile?.name
          ? "You"
          : product.created_by_name}
      </TableCell>

      <TableCell className="text-zinc-500 text-sm">
        {new Date(product.created_at).toLocaleDateString()}
      </TableCell>

      <TableCell className="text-zinc-500 text-sm">
        {new Date(product.updated_at).toLocaleDateString()}
      </TableCell>

      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {product.status !== "Active" && (
              <>
                <DropdownMenuItem className="cursor-pointer" onClick={onEdit}>
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => onActivate(product.id)}
                >
                  Activate
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={onRemove}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
