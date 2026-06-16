import { estiloPorPerfil } from "../data/dashboardData";
import AssetDistributionChart from "./AssetDistributionChart";

/**
 * Calcula ingresos, gastos y ahorro dinámicamente desde los activos reales.
 * 
 * - Ingresos  = walletBalance del usuario + ganancias latentes (currentPrice > averagePrice)
 * - Gastos    = suma del costo de adquisición de todos los activos (averagePrice * value)
 * - Ahorro    = Ingresos - Gastos (nunca negativo para mostrar)
 */
function calcularResumen(assets, walletBalance = 0) {
  if (!Array.isArray(assets) || assets.length === 0) {
    return { income: walletBalance, expenses: 0, savings: walletBalance, gainLoss: 0 };
  }

  let costoTotal = 0;
  let valorActualTotal = 0;

  assets.forEach((asset) => {
    const qty = Number(asset.value) || 0;
    const avg = Number(asset.averagePrice) || 0;
    const current = Number(asset.currentPrice) || avg;

    costoTotal += qty * avg;
    valorActualTotal += qty * current;
  });

  const gainLoss = valorActualTotal - costoTotal;
  const income = walletBalance + Math.max(gainLoss, 0);
  const expenses = costoTotal;
  const savings = Math.max(income - expenses, 0);

  return { income, expenses, savings, gainLoss };
}

function fmt(n) {
  return Number(n).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function FinancialSummary({ typePerfil, assets, walletBalance }) {
  const estilo = estiloPorPerfil[typePerfil] || estiloPorPerfil.CONSERVADOR;
  const { income, expenses, savings, gainLoss } = calcularResumen(assets, walletBalance);
  const savingsRate = income > 0 ? Math.min(Math.round((savings / income) * 100), 100) : 0;
  const isGain = gainLoss >= 0;

  return (
    <div className={`card-accent ${estilo.accent}`}>
      <p className="eyebrow mb-1">Calculado desde tus activos reales</p>
      <h2 className="font-display text-lg font-semibold mb-5">Resumen financiero</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {/* Ingresos */}
        <div className="bg-surface-2 border-l-2 border-teal rounded-md p-4">
          <p className="eyebrow mb-1">Capital disponible</p>
          <p className="figure text-xl font-semibold text-teal">${fmt(income)}</p>
          <p className="text-xs text-muted mt-1">Wallet + ganancias latentes</p>
        </div>

        {/* Gastos */}
        <div className="bg-surface-2 border-l-2 border-rose rounded-md p-4">
          <p className="eyebrow mb-1">Invertido</p>
          <p className="figure text-xl font-semibold text-rose">${fmt(expenses)}</p>
          <p className="text-xs text-muted mt-1">Costo de adquisición total</p>
        </div>

        {/* Ahorro */}
        <div className="bg-surface-2 border-l-2 border-gold rounded-md p-4">
          <p className="eyebrow mb-1">Ahorro estimado</p>
          <p className="figure text-xl font-semibold text-gold">${fmt(savings)}</p>
          <p className="text-xs text-muted mt-1">Capital libre</p>
        </div>
      </div>

      {/* Ganancia / pérdida latente */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-md mb-5 ${
        isGain ? "bg-teal/10 border border-teal/30" : "bg-rose/10 border border-rose/30"
      }`}>
        <span className={`figure text-sm font-semibold ${isGain ? "text-teal" : "text-rose"}`}>
          {isGain ? "▲" : "▼"} ${fmt(Math.abs(gainLoss))}
        </span>
        <span className="text-xs text-muted">
          {isGain ? "Ganancia latente sobre tus activos" : "Pérdida latente sobre tus activos"}
        </span>
      </div>

      {/* Savings rate bar */}
      <div className="mb-6">
        <p className="text-sm text-muted mb-2">
          Tasa de ahorro:{" "}
          <span className="figure text-paper font-semibold">{savingsRate}%</span>
        </p>
        <div className="w-full bg-surface-2 rounded-full h-2">
          <div
            className="bg-gold h-2 rounded-full transition-all duration-500"
            style={{ width: `${savingsRate}%` }}
          />
        </div>
      </div>

      <AssetDistributionChart assets={assets} />
    </div>
  );
}
