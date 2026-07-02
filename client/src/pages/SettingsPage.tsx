import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { useTeamStore } from "../stores/teamStore";
import { teamService } from "../services/team.service";
import { handleError } from "../shared/errors/handleError";
import { useToastStore } from "../stores/toast.store";

const SettingsPage = () => {
  const { profile } = useAuthStore();
  const { team, setTeam } = useTeamStore();
  const [newName, setNewName] = useState(team?.name || "");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToastStore.getState().showToast;

  const isOwner = profile?.role === "owner";

  const handleUpdateName = async () => {
    setLoading(true);
    try {
      await teamService.updateTeamName(newName);
      
      showToast("Team name updated!");
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!team) return;
    setLoading(true);
    try {
      await teamService.inviteMember({
        email: inviteEmail,
        teamCode: team.invite_code,
      });

      showToast("Team name updated!");
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveOrDelete = async (action: "leave" | "delete") => {
    if (!confirm(`Are you sure you want to ${action} the team?`)) return;
    setLoading(true);
    try {
      if (action === "delete") await teamService.deleteTeam();
      else await teamService.leaveTeam();

      setTeam(null);
      window.location.href = "/";
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Team Settings</h1>

      <section className="p-4 border rounded">
        <h2 className="text-lg font-semibold">Invite Member</h2>
        <div className="flex gap-2 mt-2">
          <input
            type="email"
            placeholder="Friend's email"
            className="border p-2 flex-1"
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button
            onClick={handleInvite}
            disabled={loading}
            className="bg-blue-500 text-white p-2"
          >
            Send Invite
          </button>
        </div>
      </section>

      {isOwner ? (
        <section className="p-4 border border-red-200 rounded">
          <h2 className="text-lg font-semibold text-red-600">Owner Actions</h2>
          <div className="mt-2 space-y-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border p-2 w-full"
            />
            <button
              onClick={handleUpdateName}
              className="bg-green-500 text-white p-2 w-full"
            >
              Update Name
            </button>
            <button
              onClick={() => handleLeaveOrDelete("delete")}
              className="bg-red-600 text-white p-2 w-full"
            >
              Delete Team
            </button>
          </div>
        </section>
      ) : (
        <section className="p-4 border rounded">
          <h2 className="text-lg font-semibold">Leave Team</h2>
          <button
            onClick={() => handleLeaveOrDelete("leave")}
            className="bg-gray-500 text-white p-2 w-full mt-2"
          >
            Leave Team
          </button>
        </section>
      )}
    </div>
  );
};

export default SettingsPage;
