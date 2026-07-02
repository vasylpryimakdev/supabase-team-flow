import { supabase } from "../lib/supabase";

export const storageService = {
  async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const newFileName = `${Date.now()}.${fileExt}`;
    const newFilePath = `${userId}/${newFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(newFilePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: files, error: listError } = await supabase.storage
      .from("avatars")
      .list(userId);

    if (!listError && files) {
      const oldFiles = files.filter((f) => f.name !== newFileName);

      if (oldFiles.length > 0) {
        const pathsToRemove = oldFiles.map((f) => `${userId}/${f.name}`);
        await supabase.storage.from("avatars").remove(pathsToRemove);
      }
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(newFilePath);

    return publicUrl;
  },

  async uploadTeamAvatar(teamId: string, file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const newFileName = `${Date.now()}.${fileExt}`;
    const newFilePath = `${teamId}/${newFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("team-avatars")
      .upload(newFilePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: files, error: listError } = await supabase.storage
      .from("team-avatars")
      .list(teamId);

    if (!listError && files) {
      const oldFiles = files.filter((f) => f.name !== newFileName);

      if (oldFiles.length > 0) {
        const pathsToRemove = oldFiles.map((f) => `${teamId}/${f.name}`);
        await supabase.storage.from("team-avatars").remove(pathsToRemove);
      }
    }

    const { data: { publicUrl } } = supabase.storage
      .from("team-avatars")
      .getPublicUrl(newFilePath);

    return publicUrl;
  },
};
