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
  onCloseModal: () => void;
  onCreate: (data: ProductFormData) => Promise<Product>;
};

const ProductCreateDialog = ({ isFormOpen, onCloseModal, onCreate }: Props) => {
  return (
    <Dialog open={isFormOpen} onOpenChange={onCloseModal}>
      <DialogTrigger asChild>
        <Button>+ New product</Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-800 backdrop-blur-3xl p-6 border shadow-xl">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>

        <ProductForm closeModal={onCloseModal} onCreate={onCreate} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreateDialog;
