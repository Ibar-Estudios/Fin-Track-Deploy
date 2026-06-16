import { estiloPorPerfil } from "../data/dashboardData";

export default function Recommendations({ typePerfil, recomendacionesPorPerfil }) {
  const recomendaciones = recomendacionesPorPerfil[typePerfil] || [];
  const estilo = estiloPorPerfil[typePerfil] || estiloPorPerfil.CONSERVADOR;

  return (
    <div className={`card-accent ${estilo.accent}`}>
      <p className="eyebrow mb-1">Recomendaciones</p>
      <h2 className="font-display text-lg font-semibold mb-4">
        Para tu perfil <span className={estilo.text}>{estilo.label}</span>
      </h2>
      <ul className="space-y-2.5">
        {recomendaciones.map((item, index) => (
          <li
            key={index}
            className="bg-surface-2 border border-line rounded-md p-3.5 text-sm text-paper"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
