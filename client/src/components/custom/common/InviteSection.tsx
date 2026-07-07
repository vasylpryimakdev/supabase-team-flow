import { useState } from "react";
import { Mail, Loader2, Check, Clipboard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { teamService } from "../../../services/team.service";
import { useToastStore } from "../../../stores/toast.store";
import { handleError } from "../../../shared/errors/handleError";
import type { Team } from "../../../types/team.types";

type Props = {
  team: Team | null;
};

export const InviteSection = ({ team }: Props) => {
  const showToast = useToastStore((s) => s.showToast);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInvite = async () => {
    if (!team) return;
    setLoading(true);
    try {
      await teamService.inviteMember({
        email: email,
        teamCode: team.invite_code,
      });
      showToast("Invitation sent!");
      setEmail("");
    } catch (error: any) {
      const errorMessage = error?.message || "";

      if (
        errorMessage.includes("403") ||
        errorMessage.includes("validation_error")
      ) {
        showToast(
          "Invite failed: In sandbox mode, you can only send emails to your own verified address.",
          "error",
        );
      } else {
        handleError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!team?.invite_code) return;
    navigator.clipboard.writeText(team.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <CardHeader className="mb-6">
        <CardTitle>Invite Member</CardTitle>
        <CardDescription>Send an invitation to join your team.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="flex gap-2 items-stretch">
            <Input
              id="email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className="w-36 h-auto"
              onClick={handleInvite}
              disabled={loading || !email}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Send Invite
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid w-full gap-1.5">
          <Label>Or share this code</Label>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 border rounded bg-muted font-mono text-center flex items-center justify-center font-bold">
              {team?.invite_code || "..."}
            </div>
            <Button variant="outline" className="w-10" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Clipboard className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
