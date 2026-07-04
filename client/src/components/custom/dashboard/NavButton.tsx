import type { LucideIcon } from "lucide-react";
import { Button } from "../../ui/button";

interface Props {
  path: string;
  icon: LucideIcon;
  label: string;
  color?: "indigo" | "rose" | "slate";
  isOpen: boolean;
  isActive: (path: string) => boolean;
  navigate: (path: string) => void;
  isLoggingOut: boolean;
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

  const activeClasses = `text-${color}-600 bg-${color}-500/10`;
  const inactiveClasses = `text-muted-foreground hover:text-${color}-600 hover:bg-${color}-500/10`;

  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      disabled={isLoggingOut}
      onClick={() => navigate(path)}
      className={`h-11 w-full transition-all duration-200 group active:scale-[0.98] ${
        isOpen ? "justify-start px-3" : "justify-center px-0"
      } ${active ? activeClasses : inactiveClasses}`}
      title={!isOpen ? label : undefined}
    >
      <Icon
        className={`size-5 shrink-0 transition-all duration-200 group-hover:scale-110 ${active ? `text-${color}-600` : `group-hover:text-${color}-500`}`}
      />
      {isOpen && <span className="ml-3 text-sm font-medium">{label}</span>}
    </Button>
  );
};
