import type { TeamMember } from "../../../types/team.types";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Card, CardContent } from "../../ui/card";

interface Props {
  member: TeamMember;
}

export const MemberCard = ({ member }: Props) => {
  return (
    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={member.avatar_url || ""}
              className="object-cover"
              alt={member.name}
            />
            <AvatarFallback className="bg-slate-700 text-white">
              {member.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
              member.isOnline ? "bg-green-500 animate-pulse" : "bg-slate-500"
            }`}
          />
        </div>

        <div>
          <p className="text-white font-medium">{member.name}</p>
          <p className="text-white/50 text-sm capitalize">{member.role}</p>
        </div>
      </CardContent>
    </Card>
  );
};
