import { estiloPorPerfil } from "../data/dashboardData";

export default function SavingsTips({ typePerfil, consejosPorPerfil }) {
  const tips = consejosPorPerfil[typePerfil] || [];
  const estilo = estiloPorPerfil[typePerfil] || estiloPorPerfil.CONSERVADOR;

  return (
    <div className={`card-accent ${estilo.accent}`}>
      <p className="eyebrow mb-1">Hábitos</p>
      <h2 className="font-display text-lg font-semibold mb-4">Consejos para mejorar tu ahorro</h2>
      <ul className="space-y-2.5">
        {tips.map((tip, index) => (
          <li
            key={index}
            className="bg-surface-2 border-l-2 border-line rounded-md p-3.5 text-sm text-paper"
          >
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
