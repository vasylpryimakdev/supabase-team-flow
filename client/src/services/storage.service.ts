import { supabase } from "../lib/supabase";
import { handleError } from "../shared/errors/handleError";
import { teamService } from "./team.service";

export const storageService = {
  async uploadAvatar(userId: string, file: File): Promise<string> {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_path")
      .eq("id", userId)
      .single();

    const fileExt = file.name.split(".").pop();
    const newFilePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(newFilePath, file);

    if (uploadError) throw uploadError;

    await supabase
      .from("profiles")
      .update({ avatar_path: newFilePath })
      .eq("id", userId);

    if (profile?.avatar_path) {
      await supabase.storage.from("avatars").remove([profile.avatar_path]);
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(newFilePath);

    return publicUrl;
  },

  async uploadTeamAvatar(teamId: string, file: File): Promise<string> {
    const { data: team, error: fetchError } = await supabase
      .from("teams")
      .select("avatar_path")
      .eq("id", teamId)
      .single();

    if (fetchError) throw fetchError;

    const fileExt = file.name.split(".").pop();
    const newFilePath = `${teamId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("team-avatars")
      .upload(newFilePath, file);

    if (uploadError) throw uploadError;

    await teamService.updateTeam(teamId, { avatar_path: newFilePath });

    if (team?.avatar_path) {
      const { error: removeError } = await supabase.storage
        .from("team-avatars")
        .remove([team.avatar_path]);

      if (removeError) {
        handleError(removeError);
      }
    }

    const { data: { publicUrl } } = supabase.storage
      .from("team-avatars")
      .getPublicUrl(newFilePath);

    return publicUrl;
  },
};
