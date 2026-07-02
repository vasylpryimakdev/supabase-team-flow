import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

import { teamService } from "../../../services/team.service";
import { authService } from "../../../services/auth.service";
import { useAuthStore } from "../../../stores/auth.store";
import { handleError } from "../../../shared/errors/handleError";
import { Spinner } from "../Spinner";

const joinTeamSchema = z.object({
  code: z.string().trim().min(1, "Invite code is required"),
});

type JoinTeamForm = z.infer<typeof joinTeamSchema>;

export function JoinTeam() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<JoinTeamForm>({
    resolver: zodResolver(joinTeamSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: JoinTeamForm) => {
    try {
      const sessionData = await authService.getSession();
      const token = sessionData.session?.access_token;
      const userId = sessionData.session?.user.id;

      if (!token || !userId) {
        throw new Error("You must be logged in to join a team");
      }

      await teamService.joinTeam(data.code);

      await useAuthStore.getState().loadUserContext(userId);

      reset();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Input placeholder="Invite code" {...register("code")} />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Spinner /> : "Join team"}
      </Button>
    </form>
  );
}
