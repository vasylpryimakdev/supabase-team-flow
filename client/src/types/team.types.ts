export type Team = {
  id: string;
  name: string;
  invite_code: string;
  avatar_path: string;
  avatar_url: string;
};

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  isOnline?: boolean;
}
