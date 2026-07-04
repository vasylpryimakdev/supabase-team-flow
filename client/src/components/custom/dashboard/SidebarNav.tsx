import { Package, Users } from "lucide-react";
import { NavButton } from "./NavButton";
import { OnlineMembersSidebar } from "./OnlineMembersSidebar";
import type { Team } from "../../../types/team.types";

interface SidebarNavProps {
  isOpen: boolean;
  isActive: (path: string) => boolean;
  navigate: (path: string) => void;
  team: Team | null;
  isLoggingOut: boolean;
}

export const SidebarNav = ({
  isOpen,
  isActive,
  navigate,
  team,
  isLoggingOut,
}: SidebarNavProps) => {
  return (
    <div className="flex flex-col gap-2 overflow-hidden px-2">
      <NavButton
        path="/dashboard"
        icon={Package}
        label="My Products"
        isOpen={isOpen}
        isActive={isActive}
        navigate={navigate}
        isLoggingOut={isLoggingOut}
      />

      <NavButton
        path="/dashboard/members"
        icon={Users}
        label="Members"
        isOpen={isOpen}
        isActive={isActive}
        navigate={navigate}
        isLoggingOut={isLoggingOut}
        color="indigo"
      />

      <OnlineMembersSidebar team={team} isOpen={isOpen} />
    </div>
  );
};
