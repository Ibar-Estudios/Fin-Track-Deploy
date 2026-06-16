import { deleteAssetById } from "../services/assetService";
import EditAssetModal from "./EditAssetModal";
import { useState } from "react";

const tipoLabel = {
  stock: "Acción",
  crypto: "Cripto",
  bond: "Bono",
  real_estate: "Inmueble",
  commodity: "Commodity",
  other: "Otro",
};

export default function AssetCard({ asset, onRefresh }) {
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirm = window.confirm("¿Eliminar este activo?");
    if (!confirm) return;

    setLoading(true);
    await deleteAssetById(asset._id);
    setLoading(false);
    onRefresh();
  };

  return (
    <div className="bg-surface-2 border border-line rounded-lg p-4 hover:border-gold/40 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-semibold text-paper mb-0.5">{asset.name}</h3>
          <p className="eyebrow">{tipoLabel[asset.type] || "Otro"}</p>
        </div>
        <span className="text-xs px-2 py-1 bg-ink border border-line rounded text-muted uppercase font-mono">
          {asset.currency}
        </span>
      </div>

      <div className="space-y-1 mb-4">
        <p className="text-sm text-muted">
          Valor actual: <span className="figure text-paper">${asset.currentPrice.toFixed(2)}</span>
        </p>
        <p className="text-sm text-muted">
          Valor registrado: <span className="figure text-gold">${asset.value.toFixed(2)}</span>
        </p>
        <p className="text-xs text-muted/70">
          Creado: {new Date(asset.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <button
          className="text-sm px-3 py-1.5 rounded-md border border-line text-muted hover:text-gold hover:border-gold transition-colors"
          onClick={() => setShowEdit(true)}
        >
          Editar
        </button>
        <button
          className="text-sm px-3 py-1.5 rounded-md border border-rose/40 text-rose hover:bg-rose/10 transition-colors disabled:opacity-50"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Eliminando…" : "Eliminar"}
        </button>
      </div>

      {showEdit && (
        <EditAssetModal
          asset={asset}
          onClose={() => setShowEdit(false)}
          onSuccess={() => {
            setShowEdit(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
