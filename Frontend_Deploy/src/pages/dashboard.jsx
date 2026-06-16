import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "../hooks/useSession";
import { useLogout } from "../hooks/useLogout";
import { deleteUser } from "../services/userService";

import ProfileCard from "../components/ProfileCard";
import Recommendations from "../components/Recommendations";
import InvestmentOptions from "../components/InvestmentOptions";
import SavingsTips from "../components/SavingsTips";
import FinancialSummary from "../components/FinancialSummary";
import EditProfileForm from "../components/UserEditForm";
import AssetsList from "../components/AssetsList";
import AddAssetModal from "../components/AddAssetModal";
import WalletSection from "../components/WalletSection";
import { getAssets } from "../services/assetService";

import {
  recomendacionesPorPerfil,
  opcionesDeInversionPorPerfil,
  consejosDeAhorroPorPerfil,
  perfilesFinancieros,
  estiloPorPerfil,
} from "../data/dashboardData";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, refreshSession } = useSession();
  const logout = useLogout();

  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [assets, setAssets] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const patrimonioTotal = Array.isArray(assets)
    ? assets.reduce((acc, asset) => acc + (Number(asset.currentPrice) * Number(asset.value) || 0), 0)
    : 0;

  useEffect(() => { refreshSession(); }, []);

  // Sync walletBalance from user token
  useEffect(() => {
    if (user?.walletBalance !== undefined) {
      setWalletBalance(user.walletBalance);
    }
  }, [user]);

  const fetchAssets = async () => {
    if (!user?._id) return;
    try {
      const res = await getAssets(user._id);
      const data = Array.isArray(res.data) ? res.data : res.data?.assets || [];
      setAssets(data);
    } catch {
      setAssets([]);
    }
  };

  useEffect(() => { fetchAssets(); }, [user, refreshTrigger]);

  const triggerRefresh = () => setRefreshTrigger((p) => p + 1);

  const handleDelete = async () => {
    if (!confirm("¿Seguro querés eliminar tu cuenta? Esta acción es irreversible.")) return;
    const result = await deleteUser(user._id);
    if (result.statusCode === 200) logout();
    else alert("No se pudo eliminar la cuenta.");
  };

  const perfilData = perfilesFinancieros[user?.typePerfil];
  const estilo = estiloPorPerfil[user?.typePerfil] || estiloPorPerfil.CONSERVADOR;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <p className="eyebrow animate-pulse">Cargando sesión…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink px-6 text-center">
        <div>
          <p className="text-muted mb-4">No se pudo cargar el usuario.</p>
          <button onClick={() => router.push("/login")} className="btn-primary">
            Ir al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      {/* Edit profile modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <EditProfileForm
            user={user}
            onClose={() => setShowEdit(false)}
            onUpdate={refreshSession}
          />
        </div>
      )}

      {/* Add asset modal */}
      {showAdd && (
        <AddAssetModal
          user={user}
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); triggerRefresh(); }}
        />
      )}

      {/* ── Top bar ── */}
      <header className="border-b border-line sticky top-0 bg-ink/95 backdrop-blur-sm z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="eyebrow mb-0.5">FinTrack</p>
            <h1 className="font-display text-xl sm:text-2xl font-bold leading-tight">
              Hola, {user?.name}
            </h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setShowEdit(true)} className="btn-secondary">
              Editar perfil
            </button>
            <button onClick={() => setShowAdd(true)} className="btn-primary">
              + Agregar activo
            </button>
            <button onClick={logout} className="btn-ghost">
              Cerrar sesión
            </button>
            <button onClick={handleDelete} className="btn-danger">
              Eliminar cuenta
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Hero: patrimonio total ── */}
        <section className={`card-accent ${estilo.accent} flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4`}>
          <div>
            <p className="eyebrow mb-2">Patrimonio total</p>
            <p className="figure text-4xl sm:text-5xl font-semibold text-gold leading-none">
              ${patrimonioTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </p>
            {walletBalance > 0 && (
              <p className="text-sm text-muted mt-2">
                + <span className="figure text-paper">${walletBalance.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span> en wallet
              </p>
            )}
          </div>
          <div className={`self-start sm:self-end px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider ${estilo.chip}`}>
            Perfil {estilo.label}
          </div>
        </section>

        {/* ── Profile + guidance grid ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ProfileCard
            profile={perfilData}
            typePerfil={user.typePerfil}
            edadUsuario={user.age}
          />
          <Recommendations
            typePerfil={user.typePerfil}
            recomendacionesPorPerfil={recomendacionesPorPerfil}
          />
          <InvestmentOptions
            typePerfil={user.typePerfil}
            opcionesPorPerfil={opcionesDeInversionPorPerfil}
          />
          <SavingsTips
            typePerfil={user.typePerfil}
            consejosPorPerfil={consejosDeAhorroPorPerfil}
          />
        </section>

        {/* ── Financial summary (dinámico) ── */}
        <section>
          <FinancialSummary
            typePerfil={user.typePerfil}
            assets={assets}
            walletBalance={walletBalance}
          />
        </section>

        {/* ── Wallet / métodos de pago ── */}
        <section>
          <WalletSection
            user={user}
            onBalanceUpdate={(newBalance) => setWalletBalance(newBalance)}
          />
        </section>

        {/* ── Assets list ── */}
        <section>
          <AssetsList
            assets={assets}
            user={user}
            onRefresh={triggerRefresh}
            refreshTrigger={refreshTrigger}
          />
        </section>

      </main>
    </div>
  );
}
