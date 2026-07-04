export interface Product {
  id: string;
  title: string;
  description: string;
  status: "Draft" | "Active" | "Deleted";
  image_url?: string;
  image_path?: string;
  created_at: string;
  updated_at: string;
}
