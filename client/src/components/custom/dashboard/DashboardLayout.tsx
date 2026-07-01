import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../ui/button";
import {
  LogOut,
  Menu,
  Settings,
  Users,
  X,
  Package,
  User,
} from "lucide-react";
import { Separator } from "../../ui/separator";
import { authService } from "../../../services/auth.service";
import { handleError } from "../../../shared/errors/handleError";
import { Spinner } from "../Spinner";

const TEAM_MEMBERS = [
  { id: 1, name: "Олександр В.", avatar: "👨‍💻", color: "bg-blue-500/20" },
  { id: 2, name: "Марія К.", avatar: "👩‍💼", color: "bg-green-500/20" },
  { id: 3, name: "Дмитро П.", avatar: "🎨", color: "bg-purple-500/20" },
];

export function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

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
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                onClick={() => navigate("/dashboard/members")}
                className={`flex items-center rounded-md hover:bg-accent transition-all cursor-pointer h-10 w-full
                  ${isOpen ? "justify-start gap-3 px-3" : "justify-center"} ${isActive("/dashboard/members") ? "bg-accent/60" : ""}`}
                title={!isOpen ? member.name : undefined}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 transition-transform ${member.color}`}
                >
                  {member.avatar}
                </div>
                {isOpen && (
                  <span
                    className={`text-sm font-medium text-card-foreground truncate animate-in fade-in duration-200 ${isActive("/dashboard/members") ? "text-indigo-600 font-semibold" : ""}`}
                  >
                    {member.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto w-full flex flex-col gap-1.5 p-2">
          <Separator className="my-1" />

          <Button
            variant={isActive("/dashboard/profile") ? "secondary" : "ghost"}
            disabled={isLoggingOut}
            onClick={() => navigate("/dashboard/profile")}
            className={`h-11 w-full text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 active:scale-[0.98] transition-all duration-200 group ${
              isOpen ? "justify-start px-3" : "justify-center px-0"
            } ${isActive("/dashboard/profile") ? "text-indigo-600 bg-indigo-500/10" : ""}`}
            title={!isOpen ? "My Profile" : undefined}
          >
            <User
              className={`size-5 shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive("/dashboard/profile") ? "text-indigo-600" : "group-hover:text-indigo-500"}`}
            />
            {isOpen && (
              <span className="ml-3 text-sm font-medium animate-in fade-in duration-300">
                My Profile
              </span>
            )}
          </Button>

          <Button
            variant={isActive("/dashboard/settings") ? "secondary" : "ghost"}
            disabled={isLoggingOut}
            onClick={() => navigate("/dashboard/settings")}
            className={`h-11 w-full text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 active:scale-[0.98] transition-all duration-200 group ${
              isOpen ? "justify-start px-3" : "justify-center px-0"
            } ${isActive("/dashboard/settings") ? "text-indigo-600 bg-indigo-500/10" : ""}`}
            title={!isOpen ? "Team Settings" : undefined}
          >
            <Settings
              className={`size-5 shrink-0 transition-transform duration-500 ease-out group-hover:rotate-45 ${isActive("/dashboard/settings") ? "text-indigo-600" : "group-hover:text-indigo-500"}`}
            />
            {isOpen && (
              <span className="ml-3 text-sm font-medium animate-in fade-in duration-300">
                Team Settings
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            disabled={isLoggingOut}
            className={`h-11 w-full text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 active:scale-[0.98] transition-all duration-200 group ${
              isOpen ? "justify-start px-3" : "justify-center px-0"
            }`}
            title={!isOpen ? "Logout" : undefined}
            onClick={handleLogout}
          >
            {isLoggingOut ? (
              <Spinner />
            ) : (
              <LogOut className="size-5 shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:text-rose-500" />
            )}
            {isOpen && !isLoggingOut && (
              <span className="ml-3 text-sm font-medium animate-in fade-in duration-300">
                Logout
              </span>
            )}
          </Button>
        </div>
      </aside>

      <main
        className={`flex-1 p-6 pt-20 transition-all duration-300
          ${isOpen ? "pl-[272px]" : "pl-[88px]"}
        `}
      >
        <div className="bg-card border rounded-xl p-6 h-full shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
