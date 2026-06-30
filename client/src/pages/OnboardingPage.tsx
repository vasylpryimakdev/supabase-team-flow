import { CreateTeam } from "../components/onboarding/CreateTeam";
import JoinTeam from "../components/onboarding/JoinTeam";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">Setup your team</h1>

        <CreateTeam />
        <JoinTeam />
      </div>
    </div>
  );
}
