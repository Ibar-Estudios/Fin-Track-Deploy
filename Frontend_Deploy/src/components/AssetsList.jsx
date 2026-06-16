import { useState, useEffect } from "react";
import AssetCard from "./AssetCard";
import AddAssetModal from "./AddAssetModal";

export default function AssetsList({ assets, onRefresh, user, refreshTrigger }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {}, [refreshTrigger]);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div>
          <p className="eyebrow mb-1">Cartera</p>
          <h2 className="font-display text-lg font-semibold">Tus activos financieros</h2>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Agregar activo
        </button>
      </div>

      {Array.isArray(assets) && assets.length === 0 ? (
        <div className="border border-dashed border-line rounded-lg p-10 text-center">
          <p className="text-sm text-muted mb-4">
            Todavía no registraste activos. Sumá el primero para ver tu distribución patrimonial.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-secondary">
            Agregar primer activo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.map((asset) => (
            <AssetCard
              key={asset._id}
              asset={asset}
              onRefresh={onRefresh}
              refreshTrigger={refreshTrigger}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddAssetModal
          user={user}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
