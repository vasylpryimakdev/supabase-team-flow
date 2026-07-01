export type AppErrorType =
  | "auth"
  | "network"
  | "validation"
  | "unknown"
  | "server";
export type SupabaseError = {
  message: string;
  code?: string;
  status?: number;
};
