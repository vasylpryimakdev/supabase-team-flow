import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { ProductFilters } from "../../../types/product.types";
import { useTeamMembers } from "../../../hooks/useTeamMembers";
import type { Profile } from "../../../types/profile.type";

type Props = {
  profile: Profile | null;
  filters: ProductFilters;
  onUpdateFilters: (updates: Partial<ProductFilters>) => void;
};

const ProductsFilters = ({ profile, filters, onUpdateFilters }: Props) => {
  const { data: members = [] } = useTeamMembers(profile?.team_id ?? undefined);

  return (
    <div className="flex items-center justify-between gap-4">
      <Input
        placeholder="Search products..."
        value={filters.search}
        onChange={(e) =>
          onUpdateFilters({
            search: e.target.value,
            page: 1,
          })
        }
        className="max-w-sm"
      />
      <div className="flex items-center gap-4">
        <Select
          value={filters.status}
          onValueChange={(value) =>
            onUpdateFilters({
              status: value as ProductFilters["status"],
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            className="w-[var(--radix-select-trigger-width)]"
          >
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.createdBy}
          onValueChange={(value) =>
            onUpdateFilters({
              createdBy: value,
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Created by" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            className="w-[var(--radix-select-trigger-width)]"
          >
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
  );
};

export default ProductsFilters;
