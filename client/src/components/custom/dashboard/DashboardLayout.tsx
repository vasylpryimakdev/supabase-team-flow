import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../ui/button";
import { Menu, X } from "lucide-react";
import { authService } from "../../../services/auth.service";
import { handleError } from "../../../shared/errors/handleError";
import { useTeamStore } from "../../../stores/teamStore";
import { TeamHeader } from "./TeamHeader";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarNav } from "./SidebarNav";

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

        <SidebarNav
          isOpen={isOpen}
          isActive={isActive}
          navigate={navigate}
          team={team}
          isLoggingOut={isLoggingOut}
        />

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
