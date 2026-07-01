import { useState } from "react";
import { Button } from "../components/ui/button";
import { LogOut, Menu, Settings, UserMinus, Users, X } from "lucide-react";
import { Separator } from "../components/ui/separator";

const TEAM_MEMBERS = [
  { id: 1, name: "Олександр В.", avatar: "👨‍💻", color: "bg-blue-500/20" },
  { id: 2, name: "Марія К.", avatar: "👩‍💼", color: "bg-green-500/20" },
  { id: 3, name: "Дмитро П.", avatar: "🎨", color: "bg-purple-500/20" },
];

export function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);

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
          className={`absolute  top-3 transition-all duration-300 ${isOpen ? "right-4" : "left-1/2 -translate-x-1/2"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="size-7" /> : <Menu className="size-7" />}
        </Button>
        <div
          className={`h-8 flex items-center overflow-hidden whitespace-nowrap ${isOpen ? "px-2" : "justify-center"}`}
        >
          {isOpen ? (
            <span className="text-lg font-semibold animate-in fade-in duration-200">
              My Team
            </span>
          ) : (
            <Users className="size-5 text-muted-foreground" />
          )}
        </div>
        <Separator />
        <div className="flex flex-col gap-2 overflow-hidden">
          {isOpen && (
            <div className="text-xs font-semibold text-muted-foreground px-2 uppercase tracking-wider animate-in fade-in duration-200">
              Members
            </div>
          )}

          <div className="flex flex-col gap-1 w-full">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className={`flex items-center rounded-md hover:bg-accent transition-all cursor-pointer h-10 w-full
                  ${isOpen ? "justify-start gap-3 px-3" : "justify-center"}`}
                title={!isOpen ? member.name : undefined}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 transition-transform ${member.color}`}
                >
                  {member.avatar}
                </div>

                {isOpen && (
                  <span className="text-sm font-medium text-card-foreground truncate animate-in fade-in duration-200">
                    {member.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto w-full flex flex-col gap-1.5">
          <Separator className="my-2" />

          <Button
            variant="ghost"
            className={`h-11 w-full text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 active:scale-[0.98] transition-all duration-200 group ${
              isOpen ? "justify-start px-3" : "justify-center px-0"
            }`}
            title={!isOpen ? "Settings" : undefined}
          >
            <Settings className="size-5 shrink-0 transition-transform duration-500 ease-out group-hover:rotate-45 group-hover:text-indigo-500" />

            {isOpen && (
              <span className="ml-3 text-sm font-medium animate-in fade-in duration-300">
                Settings
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            className={`h-11 w-full text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 active:scale-[0.98] transition-all duration-200 group ${
              isOpen ? "justify-start px-3" : "justify-center px-0"
            }`}
            title={!isOpen ? "Leave Team" : undefined}
          >
            <UserMinus className="size-5 shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:text-amber-500" />

            {isOpen && (
              <span className="ml-3 text-sm font-medium animate-in fade-in duration-300">
                Leave Team
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            className={`h-11 w-full text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 active:scale-[0.98] transition-all duration-200 group ${
              isOpen ? "justify-start px-3" : "justify-center px-0"
            }`}
            title={!isOpen ? "Logout" : undefined}
          >
            <LogOut className="size-5 shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:text-rose-500" />

            {isOpen && (
              <span className="ml-3 text-sm font-medium animate-in fade-in duration-300">
                Logout
              </span>
            )}
          </Button>
        </div>
      </aside>

      <main
        className={`flex-1 p-6 pt-16 transition-all duration-300
          ${isOpen ? "pl-[272px]" : "pl-[88px]"}
        `}
      >
        <div className="text-xl font-semibold">Dashboard</div>
      </main>
    </div>
  );
}
