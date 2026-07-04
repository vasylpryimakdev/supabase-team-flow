import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../ui/button";
import { Menu, Users, X, Package } from "lucide-react";
import { Separator } from "../../ui/separator";
import { authService } from "../../../services/auth.service";
import { handleError } from "../../../shared/errors/handleError";
import { useTeamStore } from "../../../stores/teamStore";
import { OnlineMembersSidebar } from "./OnlineMembersSidebar";
import { TeamHeader } from "./TeamHeader";
import { SidebarFooter } from "./SidebarFooter";

export function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const team = useTeamStore((s) => s.team);
  const initPresence = useTeamStore((s) => s.initPresence);
  const cleanupPresence = useTeamStore((s) => s.cleanupPresence);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (team?.id) initPresence(team.id);
    return () => cleanupPresence();
  }, [team?.id, initPresence, cleanupPresence]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.signOut();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-background transition-all duration-300">
      <aside
        className={`overflow-hidden fixed top-0 left-0 z-40 h-full border-r bg-card pt-16 transition-all duration-300 ease-in-out flex flex-col gap-4
          ${isOpen ? "w-64" : "w-[72px]"} 
        `}
      >
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 transition-all duration-300 ${isOpen ? "right-4" : "left-1/2 -translate-x-1/2"}`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="size-7" /> : <Menu className="size-7" />}
        </Button>

        <div className="px-2">
          <Button
            variant={isActive("/dashboard") ? "secondary" : "ghost"}
            onClick={() => navigate("/dashboard")}
            className={`h-11 w-full text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 active:scale-[0.98] transition-all duration-200 group ${
              isOpen ? "justify-start px-3" : "justify-center px-0"
            } ${isActive("/dashboard") ? "text-indigo-600 bg-indigo-500/10" : ""}`}
            title={!isOpen ? "Products Dashboard" : undefined}
          >
            <Package
              className={`size-5 shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive("/dashboard") ? "text-indigo-600" : "group-hover:text-indigo-500"}`}
            />
            {isOpen && (
              <span className="ml-3 text-sm font-semibold animate-in fade-in duration-300">
                My Products
              </span>
            )}
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col gap-2 overflow-hidden px-2">
          <Button
            variant={isActive("/dashboard/members") ? "secondary" : "ghost"}
            onClick={() => navigate("/dashboard/members")}
            className={`h-11 w-full text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 active:scale-[0.98] transition-all duration-200 group ${
              isOpen ? "justify-start px-3" : "justify-center px-0"
            } ${isActive("/dashboard/members") ? "text-indigo-600 bg-indigo-500/10" : ""}`}
            title={!isOpen ? "View All Members" : undefined}
          >
            <Users
              className={`size-5 shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive("/dashboard/members") ? "text-indigo-600" : "group-hover:text-indigo-500"}`}
            />
            {isOpen && (
              <span className="ml-3 text-sm font-semibold uppercase tracking-wider animate-in fade-in duration-300">
                Members
              </span>
            )}
          </Button>

          <div className="flex flex-col gap-1 w-full">
            <OnlineMembersSidebar team={team} isOpen={isOpen} />
          </div>
        </div>

        <SidebarFooter
          isOpen={isOpen}
          isActive={isActive}
          navigate={navigate}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </aside>

      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          isOpen ? "pl-[272px]" : "pl-[88px]"
        }`}
      >
        <div className="flex flex-col h-full gap-6">
          <TeamHeader team={team} />

          <div className="bg-card border rounded-xl p-6 flex-1 shadow-sm">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
