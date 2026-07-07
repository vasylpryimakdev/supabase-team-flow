import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { useTeamStore } from "../stores/teamStore";
import { teamService } from "../services/team.service";
import { handleError } from "../shared/errors/handleError";
import { useToastStore } from "../stores/toast.store";

import { Trash2, LogOut, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { storageService } from "../services/storage.service";
import { AvatarUploader } from "../components/custom/common/AvatarUploader";
import { InviteSection } from "../components/custom/common/InviteSection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

const SettingsPage = () => {
  const { profile } = useAuthStore();
  const { team, setTeam } = useTeamStore();
  const [newName, setNewName] = useState(team?.name || "");
  const [loading, setLoading] = useState(false);
  const showToast = useToastStore((s) => s.showToast);
  const user = useAuthStore((s) => s.user);

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

  const handleDeleteTeam = async () => {
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

      <InviteSection team={team} />

      {isOwner ? (
        <Card className="border-destructive p-6">
          <CardHeader className="mb-6">
            <CardTitle className="text-destructive">Owner Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AvatarUploader
              url={team?.avatar_url || ""}
              onUpload={handleAvatarChange}
              loading={loading}
              title="Team Avatar"
              description={
                "Upload a high-quality image to represent your team."
              }
            />
            <div className="grid gap-1.5">
              <Label>Update Team Name</Label>
              <div className="flex gap-2 items-stretch">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="w-36 h-auto"
                  onClick={handleUpdateName}
                >
                  <Save className="mr-2 size-4" /> Save
                </Button>
              </div>
            </div>
            <Separator />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full transition-all duration-200 "
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete Team
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your team and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline" size="default">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteTeam}
                    variant="destructive"
                    size="default"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete Team
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full transition-all duration-200 hover:bg-red-700"
                >
                  Leave Team
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. You will be removed from the
                    team and lose access to team resources.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline" size={""}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLeaveTeam}
                    variant="destructive"
                    size={""}
                  >
                    <LogOut className="mr-2 size-4" />
                    Leave Team
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;
