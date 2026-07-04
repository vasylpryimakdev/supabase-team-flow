import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/custom/common/Spinner";

import { Badge } from "../components/ui/badge";
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

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

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
                <TableCell colSpan={5} className="h-24 text-center">
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : (
              products?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium flex items-center gap-3">
                    {p.image_url && (
                      <img
                        src={p.image_url}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <div>{p.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === "Draft"
                          ? "secondary"
                          : p.status === "Active"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>You</TableCell>{" "}
                  <TableCell>
                    {new Date(p.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(p.id)}
                    >
                      ...
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsPage;
