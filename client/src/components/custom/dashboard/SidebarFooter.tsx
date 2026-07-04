import { User, Settings, LogOut } from "lucide-react";

import { Spinner } from "../common/Spinner";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { NavButton } from "./NavButton";

interface SidebarFooterProps {
  isOpen: boolean;
  isActive: (path: string) => boolean;
  navigate: (path: string) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export const SidebarFooter = ({
  isOpen,
  isActive,
  navigate,
  onLogout,
  isLoggingOut,
}: SidebarFooterProps) => {
  return (
    <div className="mt-auto w-full flex flex-col gap-1.5 p-2">
      <Separator className="my-1" />

      <NavButton
        path="/dashboard/profile"
        icon={User}
        label="My Profile"
        isActive={isActive}
        navigate={navigate}
        isOpen={isOpen}
        isLoggingOut={isLoggingOut}
      />
      <NavButton
        path="/dashboard/settings"
        icon={Settings}
        label="Team Settings"
        isActive={isActive}
        navigate={navigate}
        isOpen={isOpen}
        isLoggingOut={isLoggingOut}
      />

      <Button
        variant="ghost"
        disabled={isLoggingOut}
        onClick={onLogout}
        className={`h-11 w-full text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 active:scale-[0.98] transition-all duration-200 group ${
          isOpen ? "justify-start px-3" : "justify-center px-0"
        }`}
        title={!isOpen ? "Logout" : undefined}
      >
        {isLoggingOut ? (
          <Spinner />
        ) : (
          <LogOut className="size-5 shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:text-rose-500" />
        )}
        {isOpen && !isLoggingOut && (
          <span className="ml-3 text-sm font-medium">Logout</span>
        )}
      </Button>
    </div>
  );
};
