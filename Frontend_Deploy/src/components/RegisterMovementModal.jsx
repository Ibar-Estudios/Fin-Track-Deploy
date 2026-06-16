import { useState } from "react";
import { registerMovement } from "../services/movementService";

const tipoOpciones = [
  { value: "BUY", label: "Compra" },
  { value: "SELL", label: "Venta" },
];

export default function RegisterMovementModal({ asset, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    type: "BUY",
    quantity: "",
    price: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const total = Number(formData.quantity) * Number(formData.price);
  const isSell = formData.type === "SELL";
  const exceedsAvailable = isSell && Number(formData.quantity) > asset.value;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type || !formData.quantity || !formData.price ||
        Number(formData.quantity) <= 0 || Number(formData.price) <= 0) {
      setMessage("Todos los campos son obligatorios y deben ser positivos.");
      return;
    }

    if (exceedsAvailable) {
      setMessage("No podés vender más de lo que tenés disponible.");
      return;
    }

    const payload = {
      asset: asset._id,
      type: formData.type,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      date: new Date(formData.date),
    };

    setLoading(true);
    try {
      await registerMovement(payload);
      setLoading(false);
      onSuccess();
    } catch (error) {
      console.error("Error al registrar movimiento:", error.response?.data || error.message);
      setLoading(false);
      setMessage("Error al registrar el movimiento.");
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md">
        <p className="eyebrow mb-1">Activo: {asset.name}</p>
        <h2 className="font-display text-xl font-bold mb-5">Registrar movimiento</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Tipo de movimiento</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input-field"
            >
              {tipoOpciones.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-field">Cantidad</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="input-field"
              min={1}
            />
            {isSell && (
              <p className="text-xs text-muted mt-1.5">
                Disponible para vender: <span className="figure text-paper">{asset.value}</span>
              </p>
            )}
          </div>

          <div>
            <label className="label-field">Precio unitario</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-field"
              min={0.01}
              step={0.01}
            />
          </div>

          <div>
            <label className="label-field">Fecha</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="bg-surface-2 border border-line rounded-md p-3.5">
            <p className="eyebrow mb-1">Total estimado</p>
            <p className="figure text-xl font-semibold text-gold">
              ${isNaN(total) ? "0.00" : total.toFixed(2)}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || exceedsAvailable}
              className="btn-primary"
            >
              {loading ? "Guardando…" : "Registrar"}
            </button>
          </div>

          {message && <p className="text-sm text-rose">{message}</p>}
        </form>
      </div>
    </div>
  );
}
