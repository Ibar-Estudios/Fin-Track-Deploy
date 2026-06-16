import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Token decodificado:", decoded);

      if (decoded?.email && decoded?.name && decoded?.perfil && decoded?._id) {
        setUser({
          _id: decoded._id,
          username: decoded.username,
          name: decoded.name,
          email: decoded.email,
          typePerfil: decoded.perfil,
          age: decoded.age,
        });
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Token inválido o corrupto:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession(); // Ejecutar al montar
  }, []);

  return { user, loading, refreshSession: loadSession };
}
