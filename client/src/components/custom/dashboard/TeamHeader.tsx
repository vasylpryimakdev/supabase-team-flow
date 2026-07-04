import { Users } from "lucide-react";
import type { Team } from "../../../types/team.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";

interface TeamHeaderProps {
  team: Team | null;
}

export const TeamHeader = ({ team }: TeamHeaderProps) => {
  return (
    <header className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 shadow-sm">
      <div className="flex items-center w-[120px]">
        <Avatar className="size-9 border">
          <AvatarImage src={team?.avatar_url || ""} />
          <AvatarFallback className="bg-primary/10">
            <Users className="size-4 text-primary" />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col items-center flex-1 min-w-0 px-2">
        <h1 className="text-lg font-bold truncate max-w-full">
          {team?.name || "My Team"}
        </h1>
        <Badge
          variant="secondary"
          className="mt-1 text-[10px] h-4 px-1.5 uppercase tracking-wider"
        >
          Workspace
        </Badge>
      </div>

      <div className="w-[120px]"></div>
    </header>
  );
};
