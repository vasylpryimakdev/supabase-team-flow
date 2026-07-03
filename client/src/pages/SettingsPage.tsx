import { useRef, useState } from "react";
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
import { storageService } from "../services/storage.service";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const SettingsPage = () => {
  const { profile } = useAuthStore();
  const { team, setTeam } = useTeamStore();
  const [newName, setNewName] = useState(team?.name || "");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToastStore((s) => s.showToast);
  const user = useAuthStore((s) => s.user);

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!team?.invite_code) return;
    navigator.clipboard.writeText(team.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOwner = profile?.role === "owner";

  const handleUpdateName = async () => {
    if (!team?.id) {
      return;
    }

    setLoading(true);
    try {
      await teamService.updateTeam(team?.id, { name: newName });
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

  const handleDeleteTeam = async () => {
    if (!confirm(`Are you sure you want to delete the team?`)) return;
    setLoading(true);

    try {
      await teamService.deleteTeam();
      setTeam(null);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm(`Are you sure you want to leave the team?`)) return;
    setLoading(true);

    if (!user) {
      showToast("You must be logged in to leave a team.");

      return;
    }

    try {
      await teamService.leaveTeam(user.id);
      setTeam(null);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !team) return;

    setLoading(true);
    try {
      const newUrl = await storageService.uploadTeamAvatar(team.id, file);

      setTeam({ ...team, avatar_url: newUrl });
      showToast("Team avatar updated!");
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
              <Button
                className="w-36"
                onClick={handleInvite}
                disabled={loading}
              >
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
            <Card className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={team?.avatar_url || ""} />
                  <AvatarFallback>
                    {team?.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Team Avatar</h2>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    Change Avatar
                  </Button>
                </div>
              </div>
            </Card>
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
              onClick={handleDeleteTeam}
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
              onClick={handleLeaveTeam}
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
