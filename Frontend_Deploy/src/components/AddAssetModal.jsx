import { useState, useEffect } from "react";
import { createAsset } from "../services/assetService";
import { registerMovement } from "../services/movementService";
import axios from "axios";

const tipoOpciones = [
  { value: "stock", label: "Acción 📈" },
  { value: "crypto", label: "Cripto 🪙" },
  { value: "bond", label: "Bono 💵" },
  { value: "real_estate", label: "Inmueble 🏠" },
  { value: "commodity", label: "Commodities 🛢️" },
  { value: "other", label: "Otro 📦" },
];

const currencyOptions = ["USD", "EUR", "ARS"];

const minValuesByType = {
  stock: 100,
  crypto: 10,
  bond: 500,
  real_estate: 10000,
  commodity: 50,
  other: 1,
};

export default function AddAssetModal({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    type: "stock",
    value: "",
    currency: "USD",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allSymbols, setAllSymbols] = useState([]);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await axios.get("https://api.marketstack.com/v1/tickers", {
          params: {
            access_key: "714c14d99ffd040fbfc0e78d4a95c346",
            limit: 1000,
          },
        });
        const symbols = res.data.data.map((item) => ({
          name: item.name,
          symbol: item.symbol.toUpperCase(),
        }));
        setAllSymbols(symbols);
      } catch (error) {
        console.error("Error al cargar símbolos:", error.message);
      }
    };
    fetchSymbols();
  }, []);

  useEffect(() => {
    if (formData.name && !formData.symbol) {
      const match = allSymbols.find(
        (s) =>
          s.name.toLowerCase() === formData.name.toLowerCase() ||
          s.symbol.toLowerCase() === formData.name.toLowerCase()
      );
      if (match) {
        setFormData((prev) => ({
          ...prev,
          name: match.name,
          symbol: match.symbol,
        }));
      }
    }
  }, [formData.name, allSymbols]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "name") {
      const filtered = allSymbols.filter(
        (s) =>
          s.name.toLowerCase().includes(value.toLowerCase()) ||
          s.symbol.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    }
  };

  const handleSelectSuggestion = (symbolObj) => {
    setFormData((prev) => ({
      ...prev,
      name: symbolObj.name,
      symbol: symbolObj.symbol,
    }));
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const minValue = minValuesByType[formData.type] || 1;
    const parsedValue = Number(formData.value);

    if (
      !formData.name.trim() ||
      !formData.symbol.trim() ||
      !formData.value ||
      parsedValue < minValue
    ) {
      setMessage(
        `Todos los campos son obligatorios. El valor mínimo para "${formData.type}" es $${minValue}.`
      );
      return;
    }

    if (!user || !user._id) {
      setMessage("Sesión no detectada. Iniciá sesión nuevamente.");
      return;
    }

    const payload = {
      ...formData,
      currency: formData.currency.toUpperCase(),
      value: parsedValue,
    };

    setLoading(true);
    setSuggestions([]);
    try {
      const res = await createAsset(user._id, payload);
      const newAsset = res.data.asset || res.data; // según cómo responda tu backend

      // Registrar movimiento inicial como compra
      const movementPayload = {
        asset: newAsset._id,
        type: "BUY",
        quantity: parsedValue,
        price: parsedValue, // asumimos precio unitario = valor inicial
        date: new Date(),
      };

      await registerMovement(movementPayload);

      setLoading(false);
      onSuccess();
    } catch (error) {
      console.error(
        "❌ Error al crear activo o registrar movimiento:",
        error.response?.data || error.message
      );
      setLoading(false);
      setMessage("Error al crear el activo o registrar el movimiento.");
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md">
        <h2 className="font-display text-xl font-bold mb-4">Agregar nuevo activo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Nombre del activo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              autoComplete="off"
            />
            <p className="text-xs text-muted mt-1.5">
              Escribí y seleccioná el activo desde la lista o asegurate de que
              el nombre o símbolo coincidan exactamente.
            </p>
            {suggestions.length > 0 && (
              <ul className="bg-surface-2 border border-line rounded-md shadow mt-2 max-h-40 overflow-y-auto text-sm">
                {suggestions.map((s) => (
                  <li
                    key={s.symbol}
                    onClick={() => handleSelectSuggestion(s)}
                    className="px-3 py-2 hover:bg-ink cursor-pointer text-paper"
                  >
                    {s.name} ({s.symbol})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="label-field">Tipo</label>
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
            <label className="label-field">Valor inicial</label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              min={minValuesByType[formData.type]}
              className="input-field"
            />
            <p className="text-xs text-muted mt-1.5">
              Mínimo sugerido para este tipo: ${minValuesByType[formData.type]}
            </p>
          </div>

          <div>
            <label className="label-field">Moneda</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="input-field"
            >
              {currencyOptions.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
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
    </div>
  );
}
