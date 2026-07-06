import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/custom/common/Spinner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAuthStore } from "../stores/auth.store";
import { useTeamMembers } from "../hooks/useTeamMembers";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createdBy, setCreatedBy] = useState("all");
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at">(
    "created_at",
  );

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { products, count, isLoading, createAsync, update, remove } =
    useProducts({
      page,
      status,
      search,
      createdBy,
      sortBy,
      sortOrder,
    });

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const profile = useAuthStore((s) => s.profile);
  const { data: members = [] } = useTeamMembers(profile?.team_id ?? undefined);

  console.log(profile, members);

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

  const handleSort = (field: "created_at" | "updated_at") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }

    setPage(1);
  };

  const getSortIcon = (field: "created_at" | "updated_at") => {
    if (sortBy !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }

    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
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

      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <div className="flex items-center gap-4">
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={createdBy}
            onValueChange={(value) => {
              setCreatedBy(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Created by" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All creators</SelectItem>

              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name === profile?.name ? "You" : member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0"
                  onClick={() => handleSort("created_at")}
                >
                  Created
                  {getSortIcon("created_at")}
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0"
                  onClick={() => handleSort("updated_at")}
                >
                  Updated
                  {getSortIcon("updated_at")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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
                    profile={profile}
                    onEdit={() => setEditingId(product.id)}
                    onRemove={() => remove(product.id)}
                  />
                ),
              )
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t px-4 py-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
