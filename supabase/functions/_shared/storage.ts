import { supabaseAdmin } from "./supabase.ts";

export async function deleteTeamFiles(
  teamId: string,
) {
  const { data: team, error: teamError } = await supabaseAdmin
    .from("teams")
    .select("avatar_path")
    .eq("id", teamId)
    .single();

  if (teamError) {
    throw new Error(`Failed to fetch team: ${teamError.message}`);
  }

  const { data: products, error: productsError } = await supabaseAdmin
    .from("products")
    .select("image_path")
    .eq("team_id", teamId);

  if (productsError) {
    throw new Error(`Failed to fetch products: ${productsError.message}`);
  }

  if (team?.avatar_path) {
    const { error } = await supabaseAdmin.storage
      .from("team-avatars")
      .remove([team.avatar_path]);

    if (error) {
      throw new Error(`Failed to delete team avatar: ${error.message}`);
    }
  }

  const imagePaths = products
    ?.map((product) => product.image_path)
    .filter((path): path is string => Boolean(path)) ?? [];

  if (imagePaths.length > 0) {
    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .remove(imagePaths);

    if (error) {
      throw new Error(`Failed to delete product images: ${error.message}`);
    }
  }
}
