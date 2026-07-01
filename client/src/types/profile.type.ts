export type Profile = {
  id: string;
  name: string;
  avatar_url: string | null;
  role: "owner" | "member";
  team_id: string | null;
};
