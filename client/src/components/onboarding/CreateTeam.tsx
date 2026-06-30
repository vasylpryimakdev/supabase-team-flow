import { useState } from "react";

export function CreateTeam() {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    await fetch("/api/create-team", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  };

  return (
    <div className="space-y-2">
      <input
        className="w-full p-2 bg-white/10"
        placeholder="Team name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={handleCreate}
        className="w-full bg-white text-black py-2"
      >
        Create team
      </button>
    </div>
  );
}

export default CreateTeam;
