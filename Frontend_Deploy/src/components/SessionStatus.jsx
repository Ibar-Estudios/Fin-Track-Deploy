import { useEffect, useState } from "react";
import { checkSession } from "../services/authService";

export default function SessionStatus() {
  const [status, setStatus] = useState("Verificando…");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("No autenticado");
      return;
    }

    checkSession(token)
      .then((res) => {
        if (res?.email) {
          setStatus("Sesión activa");
        } else {
          setStatus("Token inválido");
        }
      })
      .catch(() => setStatus("Error al validar"));
  }, []);

  return (
    <p className="eyebrow">
      Estado de sesión: <span className="text-paper">{status}</span>
    </p>
  );
}
