import { Pencil, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

type Props = {
  url: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  loading: boolean;
  title?: string;
  description?: string;
};

export const AvatarUploader = ({
  url,
  onUpload,
  loading,
  title = "Profile Picture",
  description = "Click the pencil to change your photo",
}: Props) => {
  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-muted">
          <AvatarImage src={url || ""} className="object-cover" />
          <AvatarFallback>
            <User className="h-10 w-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        <label
          htmlFor="avatar-file"
          className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-all"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </label>
      </div>

      <input
        id="avatar-file"
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="hidden"
        disabled={loading}
      />

      <div className="space-y-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
