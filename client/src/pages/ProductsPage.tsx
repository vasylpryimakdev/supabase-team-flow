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

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { products, isLoading, remove } = useProducts({ page, status, search });

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
          <DialogContent className="bg-zinc-900 border-zinc-800 backdrop-blur-3xl opacity-100 p-6 border shadow-xl">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <ProductForm closeModal={() => setIsFormOpen(false)} />
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
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Draft">Draft</TabsTrigger>
            <TabsTrigger value="Active">Active</TabsTrigger>
            <TabsTrigger value="Deleted">Deleted</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
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
              products?.map((p) =>
                editingId === p.id ? (
                  <ProductEditRow
                    key={p.id}
                    product={p}
                    setIsEditing={setEditingId}
                  />
                ) : (
                  <ProductDisplayRow
                    key={p.id}
                    product={p}
                    onEdit={() => setEditingId(p.id)} 
                    onRemove={() => remove(p.id)}
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
