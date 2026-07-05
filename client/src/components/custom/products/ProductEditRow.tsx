import type { Product, ProductStatus } from "../../../types/product.types";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { TableCell, TableRow } from "../../ui/table";
import { Textarea } from "../../ui/textarea";

interface ProductEditRowProps {
  editForm: Partial<Product>;
  onEditChange: (form: Partial<Product>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProductEditRow = ({
  editForm,
  onEditChange,
  onSave,
  onCancel,
}: ProductEditRowProps) => {
  console.log(editForm);

  return (
    <TableRow className="bg-zinc-900/50">
      <TableCell className="w-16">
        <Input
          className="h-10 w-10 p-0 text-[10px] text-center"
          value={editForm.image_url || ""}
          onChange={(e) =>
            onEditChange({ ...editForm, image_url: e.target.value })
          }
          placeholder="URL"
        />
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-2">
          <Input
            value={editForm.title || ""}
            onChange={(e) =>
              onEditChange({ ...editForm, title: e.target.value })
            }
            placeholder="Product title"
          />
          <Textarea
            value={editForm.description || ""}
            onChange={(e) =>
              onEditChange({ ...editForm, description: e.target.value })
            }
            placeholder="Product description"
            className="resize-none"
          />
        </div>
      </TableCell>

      <TableCell>
        <Select
          value={editForm.status}
          onValueChange={(v) =>
            onEditChange({ ...editForm, status: v as ProductStatus })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell className="text-zinc-500 text-sm italic">
        (unchanged)
      </TableCell>

      <TableCell className="text-zinc-500 text-sm"> (unchanged)</TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button size="sm" onClick={onSave}>
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
