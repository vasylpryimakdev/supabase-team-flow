import { useState } from "react";

export function JoinTeam() {
  const [code, setCode] = useState("");

  const handleJoin = async () => {
    await fetch("/api/join-team", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  };

  return (
    <div className="space-y-2">
      <input
        className="w-full p-2 bg-white/10"
        placeholder="Invite code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={handleJoin} className="w-full bg-white text-black py-2">
        Join team
      </button>
    </div>
  );
}

export default JoinTeam;
