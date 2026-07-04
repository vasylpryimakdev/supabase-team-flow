import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional().or(z.literal("")),
  image_path: z.string().optional().nullable(),
  status: z.enum(["Draft", "Active", "Deleted"]),
});

export type ProductFormData = z.infer<typeof productSchema>;
