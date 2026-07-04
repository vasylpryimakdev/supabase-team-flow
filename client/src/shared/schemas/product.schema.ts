import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional(),
  image_path: z.string().optional().nullable(),
});

export type ProductFormData = z.infer<typeof productSchema>;
