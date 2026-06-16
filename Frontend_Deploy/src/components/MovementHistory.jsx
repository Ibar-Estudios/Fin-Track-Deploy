import { useEffect, useState } from "react";
import { getMovementsByAsset } from "../services/movementService";

export default function MovementHistory({ assetId }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMovements = async () => {
      setLoading(true);
      try {
        const res = await getMovementsByAsset(assetId);
        if (res.data.movements) {
          setMovements(res.data.movements);
        } else {
          setMessage(res.data.message || "No hay movimientos registrados.");
        }
      } catch (error) {
        console.error("Error al cargar movimientos:", error.response?.data || error.message);
        setMessage("Error al cargar historial.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, [assetId]);

  if (loading) return <p className="eyebrow py-4">Cargando historial…</p>;
  if (message) return <p className="text-sm text-muted py-4">{message}</p>;

  return (
    <div className="mt-5 pt-5 border-t border-line">
      <p className="eyebrow mb-3">Historial de movimientos</p>
      <ul className="divide-y divide-line">
        {movements.map((mov) => {
          const isBuy = mov.type === "BUY";
          return (
            <li key={mov._id} className="py-3.5 flex justify-between items-start gap-4">
              <div>
                <span className={`inline-block text-xs px-2 py-0.5 rounded font-mono mb-1.5 ${
                  isBuy
                    ? "bg-teal/15 text-teal"
                    : "bg-rose/15 text-rose"
                }`}>
                  {isBuy ? "COMPRA" : "VENTA"}
                </span>
                <p className="text-sm text-paper">
                  {mov.quantity} unidades · ${mov.price.toFixed(2)} c/u
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {new Date(mov.date).toLocaleDateString("es-AR")}
                </p>
              </div>
              <p className="figure text-base font-semibold text-gold whitespace-nowrap">
                ${(mov.quantity * mov.price).toFixed(2)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
