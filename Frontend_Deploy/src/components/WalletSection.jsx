import { useEffect, useState } from "react";
import {
  getWalletMethods,
  addWalletMethod,
  depositToMethod,
  deleteWalletMethod,
} from "../services/walletService";

const METHOD_META = {
  bank: { label: "Banco", icon: "🏦", color: "text-conservador" },
  mercadopago: { label: "Mercado Pago", icon: "💙", color: "text-teal" },
  paypal: { label: "PayPal", icon: "🅿️", color: "text-conservador" },
  crypto: { label: "Cripto Wallet", icon: "₿", color: "text-gold" },
  cash: { label: "Efectivo", icon: "💵", color: "text-teal" },
};

export default function WalletSection({ user, onBalanceUpdate }) {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [depositModal, setDepositModal] = useState(null); // method object
  const [depositAmount, setDepositAmount] = useState("");
  const [newMethod, setNewMethod] = useState({ type: "bank", label: "", lastFour: "" });
  const [message, setMessage] = useState("");

  const fetchMethods = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await getWalletMethods(user._id);
      setMethods(res.data.data || []);
    } catch {
      setMethods([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMethods(); }, [user]);

  const totalWallet = methods.reduce((sum, m) => sum + (m.balance || 0), 0);

  const handleAddMethod = async (e) => {
    e.preventDefault();
    if (!newMethod.label.trim()) return;
    try {
      await addWalletMethod(user._id, newMethod);
      setShowAdd(false);
      setNewMethod({ type: "bank", label: "", lastFour: "" });
      fetchMethods();
    } catch {
      setMessage("Error al agregar método.");
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) return;
    try {
      const res = await depositToMethod(user._id, depositModal._id, depositAmount);
      onBalanceUpdate && onBalanceUpdate(res.data.walletBalance);
      setDepositModal(null);
      setDepositAmount("");
      fetchMethods();
    } catch {
      setMessage("Error al depositar.");
    }
  };

  const handleDelete = async (methodId) => {
    if (!confirm("¿Eliminar este método de pago?")) return;
    await deleteWalletMethod(user._id, methodId);
    fetchMethods();
  };

  return (
    <div className="card">
      {/* Add method modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-sm">
            <p className="eyebrow mb-1">Wallet</p>
            <h3 className="font-display text-xl font-bold mb-4">Agregar método de pago</h3>
            <form onSubmit={handleAddMethod} className="space-y-4">
              <div>
                <label className="label-field">Tipo</label>
                <select
                  value={newMethod.type}
                  onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value })}
                  className="input-field"
                >
                  {Object.entries(METHOD_META).map(([key, val]) => (
                    <option key={key} value={key}>{val.icon} {val.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-field">Nombre / Alias</label>
                <input
                  type="text"
                  placeholder="Ej: Cuenta Sueldo BBVA"
                  value={newMethod.label}
                  onChange={(e) => setNewMethod({ ...newMethod, label: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label-field">Últimos 4 dígitos (opcional)</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={newMethod.lastFour}
                  onChange={(e) => setNewMethod({ ...newMethod, lastFour: e.target.value })}
                  className="input-field"
                />
              </div>
              {message && <p className="text-sm text-rose">{message}</p>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost">Cancelar</button>
                <button type="submit" className="btn-primary">Agregar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit modal */}
      {depositModal && (
        <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-sm">
            <p className="eyebrow mb-1">{METHOD_META[depositModal.type]?.icon} {depositModal.label}</p>
            <h3 className="font-display text-xl font-bold mb-4">Depositar fondos</h3>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="label-field">Monto a depositar</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setDepositModal(null)} className="btn-ghost">Cancelar</button>
                <button type="submit" className="btn-primary">Confirmar depósito</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div>
          <p className="eyebrow mb-1">Billetera</p>
          <h2 className="font-display text-lg font-semibold">Métodos de pago</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="eyebrow">Balance total</p>
            <p className="figure text-xl font-semibold text-gold">
              ${totalWallet.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary">
            + Agregar método
          </button>
        </div>
      </div>

      {/* Methods list */}
      {loading ? (
        <p className="eyebrow py-4">Cargando métodos…</p>
      ) : methods.length === 0 ? (
        <div className="border border-dashed border-line rounded-lg p-10 text-center">
          <p className="text-sm text-muted mb-4">
            Todavía no tenés métodos de pago. Agregá uno para empezar a registrar tus fondos.
          </p>
          <button onClick={() => setShowAdd(true)} className="btn-secondary">
            Agregar primer método
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {methods.map((method) => {
            const meta = METHOD_META[method.type] || { label: method.type, icon: "💳", color: "text-muted" };
            return (
              <div
                key={method._id}
                className="bg-surface-2 border border-line rounded-lg p-4 hover:border-gold/40 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{meta.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-paper">{method.label}</p>
                      <p className={`eyebrow ${meta.color}`}>{meta.label}</p>
                    </div>
                  </div>
                  {method.lastFour && (
                    <span className="font-mono text-xs text-muted">···· {method.lastFour}</span>
                  )}
                </div>
                <p className="figure text-lg font-semibold text-gold mb-3">
                  ${(method.balance || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDepositModal(method)}
                    className="text-xs px-3 py-1.5 rounded-md bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 transition-colors cursor-pointer"
                  >
                    Depositar
                  </button>
                  <button
                    onClick={() => handleDelete(method._id)}
                    className="text-xs px-3 py-1.5 rounded-md border border-rose/40 text-rose hover:bg-rose/10 transition-colors cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
