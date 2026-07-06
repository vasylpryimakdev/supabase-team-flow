import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  type ProductFormData,
} from "../../../shared/schemas/product.schema";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useState } from "react";
import { Textarea } from "../../ui/textarea";
import { productService } from "../../../services/product.service";
import { storageService } from "../../../services/storage.service";
import { handleError } from "../../../shared/errors/handleError";
import { Spinner } from "../common/Spinner";
import type { ProductStatus } from "../../../types/product.types";

type Props = {
  closeModal: () => void;
};

export const ProductForm = ({ closeModal }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { handleSubmit, register, formState } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { title: "", description: "", status: "Draft" },
  });

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const newProduct = await productService.create({
        title: data.title,
        description: data.description,
        status: data.status as ProductStatus,
      });

      if (selectedFile) {
        await storageService.uploadProductImage(newProduct.id, selectedFile);
      }

      closeModal();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("title")} placeholder="Product Title" />
      {formState.errors.title && (
        <p className="text-red-500 text-xs">{formState.errors.title.message}</p>
      )}

      <Textarea
        {...register("description")}
        placeholder="Product Description"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Product Image</label>
        {preview ? (
          <div className="relative w-full h-32 border rounded overflow-hidden">
            <img
              src={preview}
              className="w-full h-full object-cover"
              alt="Preview"
            />
            <Button
              type="button"
              variant="destructive"
              className="absolute top-0 right-0 h-6 w-6 p-0 rounded-full"
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
              }}
            >
              X
            </Button>
          </div>
        ) : (
          <div className="w-full h-32 border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-zinc-800 relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <span className="text-sm text-gray-400">Select Image</span>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        {loading ? <Spinner /> : "Save"}
      </Button>
    </form>
  );
};
