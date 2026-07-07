import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  productSchema,
  type ProductFormData,
} from "../../../shared/schemas/product.schema";

import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";

import { handleError } from "../../../shared/errors/handleError";

import { Spinner } from "../common/Spinner";
import type { Product } from "../../../types/product.types";

type Props = {
  closeModal: () => void;
  onCreate: (
    data: ProductFormData,
    file: File | null,
  ) => Promise<Product | undefined>;
};

export const ProductForm = ({ closeModal, onCreate }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { handleSubmit, register, formState } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "Draft",
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);

    try {
      await onCreate(data, selectedFile);

      closeModal();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
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
          <div className="relative w-full h-32 overflow-hidden rounded border">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />

            <Button
              type="button"
              variant="destructive"
              className="absolute top-0 right-0 h-6 w-6 rounded-full p-0"
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
              }}
            >
              X
            </Button>
          </div>
        ) : (
          <div className="relative flex h-32 w-full cursor-pointer items-center justify-center border-2 border-dashed hover:bg-zinc-800">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
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
