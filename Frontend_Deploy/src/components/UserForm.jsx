import { useState } from "react";
import { createUser } from "../services/userService";
import { jwtDecode } from "jwt-decode";

export default function UserForm() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    age: "",
    password: "",
    confirmpassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmpassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await createUser(form);
      setMessage(res.data.message);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        jwtDecode(res.data.token);
      }

      if (res.data.message === "Usuario creado con éxito") {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al registrar");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-display text-2xl font-bold mb-1">Crear cuenta</h2>
      <p className="text-sm text-muted mb-4">Sumate para armar tu balance personal.</p>

      <div>
        <label className="label-field">Nombre completo</label>
        <input
          name="name"
          required
          placeholder="Ej: Juan Pérez"
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field">Nombre de usuario</label>
        <input
          name="username"
          required
          placeholder="Username"
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field">Email</label>
        <input
          name="email"
          required
          type="email"
          placeholder="tu@email.com"
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field">Edad</label>
        <input
          name="age"
          required
          type="number"
          placeholder="Edad"
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field">Contraseña</label>
        <input
          name="password"
          required
          type="password"
          placeholder="••••••••"
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field">Repetir contraseña</label>
        <input
          name="confirmpassword"
          required
          type="password"
          placeholder="••••••••"
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Registrar
      </button>

      {message && (
        <p className="text-sm text-muted text-center">
          {message}{" "}
          {message === "Usuario creado con éxito" && "Redirigiendo al dashboard…"}
        </p>
      )}

      <p className="text-sm text-muted text-center">
        ¿Ya tenés cuenta?{" "}
        <a href="/login" className="text-gold hover:underline">
          Iniciá sesión
        </a>
      </p>
    </form>
  );
}
