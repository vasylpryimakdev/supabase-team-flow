import type { LucideIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";

const colorStyles = {
  indigo: {
    active: "text-indigo-600 bg-indigo-500/10",
    inactive:
      "text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10",
    iconActive: "text-indigo-600",
    iconHover: "group-hover:text-indigo-500",
  },
  rose: {
    active: "text-rose-600 bg-rose-500/10",
    inactive: "text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10",
    iconActive: "text-rose-600",
    iconHover: "group-hover:text-rose-500",
  },
  slate: {
    active: "text-slate-900 bg-slate-500/10",
    inactive:
      "text-muted-foreground hover:text-slate-900 hover:bg-slate-500/10",
    iconActive: "text-slate-900",
    iconHover: "group-hover:text-slate-500",
  },
};

interface Props {
  path: string;
  icon: LucideIcon;
  label: string;
  color?: "indigo" | "rose" | "slate";
  isOpen: boolean;
  isActive: (path: string) => boolean;
  navigate: (path: string) => void;
  isLoggingOut?: boolean;
}

export const NavButton = ({
  path,
  icon: Icon,
  label,
  color = "indigo",
  isOpen,
  isActive,
  navigate,
  isLoggingOut,
}: Props) => {
  const active = isActive(path);
  const styles = colorStyles[color];

  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      disabled={isLoggingOut}
      onClick={() => navigate(path)}
      className={`h-11 w-full transition-all duration-200 group active:scale-[0.98] ${
        isOpen ? "justify-start px-3" : "justify-center px-0"
      } ${active ? styles.active : styles.inactive}`}
      title={!isOpen ? label : undefined}
    >
      <Icon
        className={cn(
          "size-5 shrink-0 transition-all duration-300",
          label === "Team Settings" && "group-hover:rotate-90",
          active ? "text-current" : "group-hover:scale-110",
        )}
      />
    </Button>
  );
};
