import { Spinner } from "../components/custom/common/Spinner";
import { useTeamStore } from "../stores/teamStore";
import { useTeamMembers } from "../hooks/useTeamMembers";
import { MemberCard } from "../components/custom/team/MemberCard";

const MembersPage = () => {
  const team = useTeamStore((s) => s.team);
  const { data: members, isLoading } = useTeamMembers(team?.id);

  if (isLoading) return <Spinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Team Members</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members?.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default MembersPage;
