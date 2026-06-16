import { useEffect, useState } from "react";
import { getUserByUsername } from "../services/userService";

export default function UserProfile({ username }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserByUsername(username)
      .then((response) => setUser(response.data))
      .catch(() => setUser(null));
  }, [username]);

  if (!user)
    return <p className="text-sm text-muted">Usuario no encontrado.</p>;

  return (
    <div className="card">
      <p className="eyebrow mb-1">Perfil</p>
      <h2 className="font-display text-xl font-bold mb-4">{user.username}</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between border-b border-line pb-2">
          <span className="text-muted">Email</span>
          <span className="text-paper">{user.email}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-muted">Edad</span>
          <span className="figure text-paper">{user.age}</span>
        </div>
      </div>
    </div>
  );
}
