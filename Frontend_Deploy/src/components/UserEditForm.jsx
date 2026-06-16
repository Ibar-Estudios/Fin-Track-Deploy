import { useState } from "react";
import { editUser } from "../services/userService";

export default function EditProfileForm({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    age: user.age || "",
    password: "",
    repeatPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.repeatPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    const updates = {
      name: formData.name,
      email: formData.email,
      age: formData.age,
    };

    if (formData.password) {
      updates.password = formData.password;
    }

    setLoading(true);
    console.log("Username en EditProfileForm:", user.username);

    const result = await editUser(user.username, updates);
    if (!user.username) {
      setMessage("No se pudo obtener el identificador del usuario.");
      setLoading(false);
      return;
    }
    setLoading(false);

    if (result.statusCode === 200) {
      if (result.token) {
        localStorage.setItem("token", result.token); // ✅ actualiza el token
      }
      setMessage("Perfil actualizado con éxito.");
      onUpdate(); // refresca sesión
      setTimeout(() => onClose(), 1000);
    } else {
      setMessage("Error al actualizar perfil.");
    }
  };

  return (
    <div className="card w-full max-w-md mx-auto">
      <h2 className="font-display text-xl font-bold mb-4">Editar perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-field">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="label-field">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="label-field">Edad</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="label-field">Nueva contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="label-field">Repetir contraseña</label>
          <input
            type="password"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>

        {message && <p className="mt-2 text-sm text-rose">{message}</p>}
      </form>
    </div>
  );
}
