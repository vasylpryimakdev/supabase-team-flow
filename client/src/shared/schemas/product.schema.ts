import { z } from "zod";
import { PRODUCT_STATUS_VALUES } from "../../types/product.types";

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional(),
  image_path: z.string().optional().nullable(),
  status: z.enum([
    PRODUCT_STATUS_VALUES[0],
    ...PRODUCT_STATUS_VALUES.slice(1),
  ]),
});

export type ProductFormData = z.infer<typeof productSchema>;
