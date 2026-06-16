import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const colors = {
  stock: "#5fd6c4",
  crypto: "#d8b369",
  bond: "#6fa8dc",
  real_estate: "#e2706a",
  commodity: "#9d8ce2",
  other: "#8b94a8",
};

const labelNames = {
  stock: "Acciones",
  crypto: "Cripto",
  bond: "Bonos",
  real_estate: "Inmuebles",
  commodity: "Commodities",
  other: "Otros",
};

export default function AssetDistributionChart({ assets }) {
  if (!assets || assets.length === 0) {
    return (
      <div className="mt-6 pt-5 border-t border-line">
        <p className="eyebrow mb-2">Distribución</p>
        <p className="text-sm text-muted">Todavía no hay activos para graficar.</p>
      </div>
    );
  }

  const grouped = assets.reduce((acc, asset) => {
    if (asset.type && typeof asset.value === "number" && asset.value > 0) {
      acc[asset.type] = (acc[asset.type] || 0) + asset.value;
    }
    return acc;
  }, {});

  const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);

  if (total === 0) {
    return (
      <div className="mt-6 pt-5 border-t border-line">
        <p className="eyebrow mb-2">Distribución</p>
        <p className="text-sm text-muted">Los activos registrados no tienen valores asignados.</p>
      </div>
    );
  }

  const labels = Object.keys(grouped).map((key) => labelNames[key] || key);
  const data = Object.values(grouped).map((val) => ((val / total) * 100).toFixed(2));

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: Object.keys(grouped).map((label) => colors[label] || "#8b94a8"),
        borderColor: "#151c28",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#8b94a8",
          font: { family: "Inter", size: 12 },
          padding: 12,
        },
      },
    },
  };

  return (
    <div className="mt-6 pt-5 border-t border-line">
      <p className="eyebrow mb-3">Distribución de activos</p>
      <div className="max-w-xs mx-auto">
        {typeof window !== "undefined" ? (
          <Pie data={chartData} options={options} />
        ) : (
          <p className="text-sm text-muted">Cargando gráfico…</p>
        )}
      </div>
    </div>
  );
}
