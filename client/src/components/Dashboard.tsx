import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const login = async () => {
    const email = prompt("Email");
    const password = prompt("Password");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email!,
      password: password!,
    });

    console.log(data, error);
    setUser(data.user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const createTeam = async () => {
    setLoading(true);

    const { data, error } = await supabase.functions.invoke("create-team", {
      body: { name: "My Team" },
    });

    setLoading(false);
    setResult({ data, error });

    console.log("CREATE TEAM:", data, error);
  };

  const joinTeam = async () => {
    const code = prompt("Invite code");

    if (!code) return;

    setLoading(true);

    const { data, error } = await supabase.functions.invoke("join-team", {
      body: { inviteCode: code },
    });

    setLoading(false);
    setResult({ data, error });

    console.log("JOIN TEAM:", data, error);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <div style={{ marginBottom: 20 }}>
        {user ? (
          <>
            <p>✅ Logged in as: {user.email}</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <p>❌ Not logged in</p>
            <button onClick={login}>Login</button>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={createTeam} disabled={!user || loading}>
          Create Team
        </button>

        <button onClick={joinTeam} disabled={!user || loading}>
          Join Team
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {result && (
        <pre
          style={{
            marginTop: 20,
            background: "#111",
            color: "#0f0",
            padding: 10,
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
