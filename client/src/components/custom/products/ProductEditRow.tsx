import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  type ProductFormData,
} from "../../../shared/schemas/product.schema";
import type { Product, ProductStatus } from "../../../types/product.types";
import { productService } from "../../../services/product.service";
import { storageService } from "../../../services/storage.service";
import { TableCell, TableRow } from "../../ui/table";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";

interface ProductEditRowProps {
  product: Product;
  setIsEditing: (id: string | null) => void;
}

export const ProductEditRow = ({
  product,
  setIsEditing,
}: ProductEditRowProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    product.image_url || null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product.title,
      description: product.description || "",
      status: product.status,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true);
    try {
      await productService.update(product.id, data);

      if (selectedFile) {
        await storageService.uploadProductImage(product.id, selectedFile);
      }

      setIsEditing(null);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TableRow className="bg-zinc-900/50">
      <TableCell className="w-16">
        <div className="relative w-10 h-10 rounded-md overflow-hidden border border-zinc-700 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          {preview ? (
            <img
              src={preview}
              className="w-full h-full object-cover"
              alt="Preview"
            />
          ) : (
            <span className="text-[10px] text-zinc-500 flex items-center justify-center h-full">
              Edit
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          <Input {...register("title")} />
          <Textarea {...register("description")} className="resize-none" />
        </div>
      </TableCell>
      <TableCell>
        <Select
          value={watch("status")}
          onValueChange={(v) => setValue("status", v as ProductStatus)}
        >
          <SelectTrigger>
            <SelectValue />
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
      <TableCell className="text-zinc-500 text-sm">-</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(null)}>
            Cancel
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
