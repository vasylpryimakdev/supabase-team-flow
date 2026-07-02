import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { useTeamStore } from "../stores/teamStore";
import { teamService } from "../services/team.service";
import { handleError } from "../shared/errors/handleError";
import { useToastStore } from "../stores/toast.store";

import {
  Loader2,
  Mail,
  Trash2,
  LogOut,
  Save,
  Check,
  Clipboard,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";

const SettingsPage = () => {
  const { profile } = useAuthStore();
  const { team, setTeam } = useTeamStore();
  const [newName, setNewName] = useState(team?.name || "");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToastStore((s) => s.showToast);

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!team?.invite_code) return;
    navigator.clipboard.writeText(team.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  console.log(team);

  const isOwner = profile?.role === "owner";

  const handleUpdateName = async () => {
    setLoading(true);
    try {
      await teamService.updateTeamName(newName);
      showToast("Team name updated successfully!");
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
      showToast("Invitation sent!");
      setInviteEmail("");
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
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Team Settings</h1>

      <Card className="p-6">
        <CardHeader className="mb-6">
          <CardTitle>Invite Member</CardTitle>
          <CardDescription>
            Send an invitation to join your team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button className="w-36" onClick={handleInvite} disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Send Invite
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid w-full gap-1.5">
            <Label>Or share this code</Label>
            <div className="flex gap-2">
              <div className="px-3 py-2 border rounded bg-muted font-mono text-center flex items-center justify-center font-bold">
                {team?.invite_code || "..."}
              </div>
              <Button
                variant="outline"
                className="w-10"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isOwner ? (
        <Card className="border-destructive p-6">
          <CardHeader className="mb-6">
            <CardTitle className="text-destructive">Owner Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1.5">
              <Label>Update Team Name</Label>
              <div className="flex flex-col gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Button variant="outline" onClick={handleUpdateName}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            </div>
            <Separator />
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => handleLeaveOrDelete("delete")}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button
              variant="ghost"
              className="text-destructive w-full"
              onClick={() => handleLeaveOrDelete("leave")}
            >
              <LogOut className="mr-2 h-4 w-4" /> Leave Team
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;
