import { useNavigate, useLocation } from "react-router-dom";
import type { Team } from "../../../types/team.types";
import { useTeamMembers } from "../../../hooks/useTeamMembers";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

interface OnlineMembersSidebarProps {
  team: Team | null;
  isOpen: boolean;
}

export const OnlineMembersSidebar = ({
  team,
  isOpen,
}: OnlineMembersSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: members } = useTeamMembers(team?.id);

  const onlineMembers = members?.filter((m) => m.isOnline) || [];

  const isActive = (path: string) => location.pathname === path;

  if (onlineMembers.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 w-full">
      <TooltipProvider>
        {onlineMembers.map((member) => (
          <Tooltip key={member.id}>
            <TooltipTrigger asChild>
              <div
                onClick={() => navigate("/dashboard/members")}
                className={`flex items-center rounded-md hover:bg-accent transition-all cursor-pointer h-10 w-full
                  ${isOpen ? "justify-start gap-3 px-3" : "justify-center"} 
                  ${isActive("/dashboard/members") ? "bg-accent/60" : ""}`}
              >
                <Avatar className="w-8 h-8 shrink-0 relative">
                  <AvatarImage src={member.avatar_url || ""} />
                  <AvatarFallback className="text-xs">
                    {member.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-background" />
                </Avatar>

                {isOpen && (
                  <span className="text-sm font-medium text-card-foreground truncate animate-in fade-in duration-200">
                    {member.name}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right">{member.name}</TooltipContent>
            )}
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};
