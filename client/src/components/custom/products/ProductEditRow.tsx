import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  productSchema,
  type ProductFormData,
} from "../../../shared/schemas/product.schema";

import type { Product, ProductStatus } from "../../../types/product.types";

import { storageService } from "../../../services/storage.service";

import { TableCell, TableRow } from "../../ui/table";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

interface ProductEditRowProps {
  product: Product;
  onUpdate: (id: string, data: Partial<Product>) => void;
  onCancel: () => void;
}

export const ProductEditRow = ({
  product,
  onUpdate,
  onCancel,
}: ProductEditRowProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    product.image_url ?? null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product.title,
      description: product.description ?? "",
      status: product.status,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true);

    try {
      let imagePath = product.image_path;

      if (selectedFile) {
        imagePath = await storageService.uploadProductImage(
          product.id,
          selectedFile,
          product.image_path,
        );
      }

      await onUpdate(product.id, {
        title: data.title,
        description: data.description,
        status: data.status as ProductStatus,
        image_path: imagePath,
      });

      onCancel();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TableRow className="bg-zinc-900/50">
      <TableCell className="w-16">
        <div className="relative w-10 h-10 overflow-hidden rounded-md border border-zinc-700 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-[10px] text-zinc-500">
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
        <Badge variant={product.status === "Active" ? "default" : "secondary"}>
          {product.status}
        </Badge>
      </TableCell>

      <TableCell className="text-sm italic text-zinc-500">
        (unchanged)
      </TableCell>

      <TableCell className="text-sm text-zinc-500"> (unchanged)</TableCell>
      <TableCell className="text-sm text-zinc-500"> (unchanged)</TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            disabled={isSaving}
            onClick={handleSubmit(onSubmit)}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>

          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
