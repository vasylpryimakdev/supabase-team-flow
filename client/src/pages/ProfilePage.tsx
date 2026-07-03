import React, { useEffect, useState } from "react";

import { Shield, Users } from "lucide-react";
import { useAuthStore } from "../stores/auth.store";
import { handleError } from "../shared/errors/handleError";
import { storageService } from "../services/storage.service";
import { Spinner } from "../components/custom/common/Spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { useTeamStore } from "../stores/teamStore";
import { AvatarUploader } from "../components/custom/common/AvatarUploader";

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const team = useTeamStore((s) => s.team);
  const isTeamLoading = useTeamStore((s) => s.isLoading);
  const loadTeamContext = useAuthStore((s) => s.loadUserContext);
  const updateProfileName = useAuthStore((s) => s.updateProfileName);
  const updateAvatar = useAuthStore((s) => s.updateAvatar);

  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user?.id && !profile) {
      loadTeamContext(user.id).catch(handleError);
    }
  }, [user?.id, profile, loadTeamContext]);

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    try {
      setIsUpdating(true);
      const publicUrl = await storageService.uploadAvatar(profile.id, file);
      await updateAvatar(publicUrl);
    } catch (err) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsUpdating(true);
      await updateProfileName(name);
    } catch (err) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isTeamLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-xl p-4 space-y-6">
      <Card className="w-full p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
          <CardDescription>Manage your personal data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AvatarUploader
            url={profile?.avatar_url || ""}
            onUpload={handleAvatarUpload}
            loading={isUpdating}
            title="Profile Photo"
            description="PNG, JPG or WEBP up to 2MB."
          />

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Display Name</Label>
              <Input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={isUpdating}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isUpdating || !name.trim()}
              className="w-full"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </form>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xl font-semibold">
              <Users className="h-5 w-5 text-primary" />
              <h3>My Team</h3>
            </div>

            {team ? (
              <Card className="border border-dashed bg-muted/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Team Name</p>
                      <p className="text-lg font-bold text-foreground">
                        {team.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      <Shield className="h-3 w-3 mr-1" />
                      {profile?.role === "owner" ? "Owner" : "Member"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 p-4 dark:bg-amber-950/20 dark:border-amber-900/40">
                <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">
                  ⚠️ You are not part of any team yet. Please create a team or
                  enter an invite code on the onboarding page.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
