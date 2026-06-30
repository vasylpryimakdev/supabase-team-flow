import { supabase } from "../lib/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useEffect, useState } from "react";

type View = "sign_in" | "sign_up" | "forgotten_password";

const titles: Record<View, { title: string; subtitle: string }> = {
  sign_in: {
    title: "Welcome back",
    subtitle: "Sign in to continue",
  },
  sign_up: {
    title: "Create account",
    subtitle: "Start building your workspace",
  },
  forgotten_password: {
    title: "Reset password",
    subtitle: "We’ll send you a reset link",
  },
};

function getView(): View {
  const hash = window.location.hash || "";

  if (hash.includes("sign_up")) return "sign_up";
  if (hash.includes("forgotten_password")) return "forgotten_password";
  return "sign_in";
}

export default function AuthPage() {
  const [view, setView] = useState<View>(getView());

  useEffect(() => {
    const sync = () => setView(getView());

    sync();
    window.addEventListener("hashchange", sync);

    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const content = titles[view];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-4">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-xl">{content.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{content.subtitle}</p>
        </CardHeader>

        <CardContent>
          <Auth
            supabaseClient={supabase}
            view="sign_in"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#000000",
                    brandAccent: "#000000",
                    inputBackground: "hsl(var(--background))",
                    inputText: "hsl(var(--foreground))",
                    inputBorder: "hsl(var(--border))",
                    messageText: "hsl(var(--foreground))",
                    anchorTextColor: "hsl(var(--primary))",
                  },
                },
              },
            }}
            providers={["google"]}
            redirectTo={`${window.location.origin}/auth/v1/callback`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
