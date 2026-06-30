import { supabase } from "../lib/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <Auth
          supabaseClient={supabase}
          view="sign_in"
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#ffffff",
                  brandAccent: "#ffffff",
                  inputBackground: "rgba(255,255,255,0.05)",
                  inputText: "#ffffff",
                  inputBorder: "rgba(255,255,255,0.1)",
                  messageText: "#ffffff",
                  anchorTextColor: "#ffffff",
                },
              },
            },
            className: {
              container:
                "backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/10",
            },
          }}
          providers={["google"]}
          redirectTo={`${window.location.origin}/auth/v1/callback`}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Password",
                button_label: "Sign in",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
