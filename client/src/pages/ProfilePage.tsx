import React, { useEffect, useState } from "react";

import { Copy, Check, UploadCloud, Shield, Users, User } from "lucide-react";
import { useAuthStore } from "../stores/auth.store";
import { handleError } from "../shared/errors/handleError";
import { storageService } from "../services/storage.service";
import { Spinner } from "../components/custom/Spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { useTeamStore } from "../stores/teamStore";

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
  const [isCopied, setIsCopied] = useState(false);

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

  const handleCopyInviteCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      handleError(err);
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Мій Профіль</CardTitle>
          <CardDescription>
            Керуйте своїми персональними даними та відображенням у команді
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 p-4 border rounded-lg bg-muted/30">
            <Avatar className="h-24 w-24 border-2 border-primary/10">
              <AvatarImage
                src={profile?.avatar_url || ""}
                alt={profile?.name || "User avatar"}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/5 text-primary">
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <h4 className="text-sm font-medium leading-none">Фото профілю</h4>
              <p className="text-sm text-muted-foreground pb-2">
                PNG, JPG або WEBP до 2MB.
              </p>
              <label htmlFor="avatar-file" className="inline-block">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  className="cursor-pointer"
                >
                  <span>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {isUpdating ? "Завантаження..." : "Змінити фото"}
                  </span>
                </Button>
                <input
                  id="avatar-file"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={isUpdating}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Ваше ім'я в системі</Label>
              <Input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введіть ваше ім'я"
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
              {isUpdating ? "Збереження..." : "Зберегти зміни"}
            </Button>
          </form>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xl font-semibold">
              <Users className="h-5 w-5 text-primary" />
              <h3>Моя Команда</h3>
            </div>

            {team ? (
              <Card className="border border-dashed bg-muted/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Назва команди
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {team.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      <Shield className="h-3 w-3 mr-1" />
                      {profile?.role === "owner" ? "Власник" : "Учасник"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Код для запрошення (Invite code)</Label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-background border rounded-lg px-3 py-2 text-sm font-mono tracking-wider font-semibold select-all">
                        {team.invite_code}
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={() => handleCopyInviteCode(team.invite_code)}
                        title="Скопіювати код"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 p-4 dark:bg-amber-950/20 dark:border-amber-900/40">
                <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">
                  ⚠️ Ви ще не приєдналися до жодної команди. Будь ласка,
                  створіть команду або введіть інвайт-код на сторінці
                  онбордінгу.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
