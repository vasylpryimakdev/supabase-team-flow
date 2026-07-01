import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Spinner } from "../Spinner";

import { teamService } from "../../../services/team.service";
import { authService } from "../../../services/auth.service";
import { useAuthStore } from "../../../stores/auth.store";
import { handleError } from "../../../shared/errors/handleError";

const createTeamSchema = z.object({
  teamName: z.string().trim().min(1, "Team name is required"),
});

type CreateTeamForm = z.infer<typeof createTeamSchema>;

export function CreateTeam() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateTeamForm>({
    resolver: zodResolver(createTeamSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: CreateTeamForm) => {
    try {
      const sessionData = await authService.getSession();
      const token = sessionData.session?.access_token;
      const userId = sessionData.session?.user.id;

      if (!token || !userId) {
        throw new Error("You must be logged in to create a team");
      }

      await teamService.createTeam({
        teamName: data.teamName,
        token,
      });

      await useAuthStore.getState().loadTeam(userId);

      reset();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Input placeholder="Create team name" {...register("teamName")} />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Spinner /> : "Create team"}
      </Button>
    </form>
  );
}
