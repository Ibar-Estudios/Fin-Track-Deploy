import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "../services/authService";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await loginUser({ email, password });

      if (result.token) {
        localStorage.setItem("token", result.token);
        router.push("/dashboard");
      } else {
        throw new Error(result.message || "Login fallido");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-display text-2xl font-bold mb-1">Iniciar sesión</h2>
      <p className="text-sm text-muted mb-4">Ingresá para ver tu balance y tu cartera.</p>

      <div>
        <label className="label-field">Email</label>
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="label-field">Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
      </div>

      {error && <p className="text-sm text-rose">{error}</p>}

      <button type="submit" className="btn-primary w-full">
        Entrar
      </button>

      <p className="text-sm text-muted text-center">
        ¿No tenés cuenta?{" "}
        <a href="/register" className="text-gold hover:underline">
          Registrate
        </a>
      </p>
    </form>
  );
}
