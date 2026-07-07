import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { ProductForm } from "./ProductForm";
import type { Product } from "../../../types/product.types";
import type { ProductFormData } from "../../../shared/schemas/product.schema";

type Props = {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  onCreate: (
    data: ProductFormData,
    file: File | null,
  ) => Promise<Product | undefined>;
};

const ProductCreateDialog = ({
  isFormOpen,
  setIsFormOpen,
  onCreate,
}: Props) => {
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button>+ New product</Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-800 backdrop-blur-3xl p-6 border shadow-xl">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>

        <ProductForm
          closeModal={() => setIsFormOpen(false)}
          onCreate={onCreate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreateDialog;
