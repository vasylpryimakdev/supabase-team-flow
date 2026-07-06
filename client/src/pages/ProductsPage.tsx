import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/custom/common/Spinner";

import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

import { ProductForm } from "../components/custom/products/ProductForm";
import { ProductDisplayRow } from "../components/custom/products/ProductDisplayRow";
import { ProductEditRow } from "../components/custom/products/ProductEditRow";

import type { Product } from "../types/product.types";
import type { ProductFormData } from "../shared/schemas/product.schema";

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { products, isLoading, createAsync, update, remove } = useProducts({
    page,
    status,
    search,
  });

  const handleCreate = async (data: ProductFormData): Promise<Product> => {
    const product = await createAsync({
      title: data.title,
      description: data.description,
      status: data.status ?? "Draft",
    });

    setIsFormOpen(false);

    return product;
  };

  const handleUpdate = (id: string, data: Partial<Product>) => {
    update({
      id,
      data,
    });

    setEditingId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Create, edit and manage your team's products.
          </p>
        </div>

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
              onCreate={handleCreate}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        <Tabs
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Draft">Draft</TabsTrigger>
            <TabsTrigger value="Active">Active</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) =>
                editingId === product.id ? (
                  <ProductEditRow
                    key={product.id}
                    product={product}
                    onUpdate={handleUpdate}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <ProductDisplayRow
                    key={product.id}
                    product={product}
                    onEdit={() => setEditingId(product.id)}
                    onRemove={() => remove(product.id)}
                  />
                ),
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsPage;
