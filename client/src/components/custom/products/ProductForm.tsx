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

export const ProductForm = () => {
  const [, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { title: "", description: "", status: "Draft" },
  });

  const handleSubmit = () => {};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <Input {...form.register("title")} placeholder="Product Title" />
      {form.formState.errors.title && (
        <p className="text-red-500 text-xs">
          {form.formState.errors.title.message}
        </p>
      )}

      <Textarea
        {...form.register("description")}
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
        Save
      </Button>
    </form>
  );
};
