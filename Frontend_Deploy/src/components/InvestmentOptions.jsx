import { estiloPorPerfil } from "../data/dashboardData";

export default function InvestmentOptions({ typePerfil, opcionesPorPerfil }) {
  const opciones = opcionesPorPerfil[typePerfil] || [];
  const estilo = estiloPorPerfil[typePerfil] || estiloPorPerfil.CONSERVADOR;

  return (
    <div className={`card-accent ${estilo.accent}`}>
      <p className="eyebrow mb-1">Inversión sugerida</p>
      <h2 className="font-display text-lg font-semibold mb-4">
        Opciones para perfil <span className={estilo.text}>{estilo.label}</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {opciones.map((option, index) => (
          <div
            key={index}
            className="bg-surface-2 border border-line rounded-md p-4"
          >
            <h3 className="text-sm font-semibold text-paper mb-1.5">{option.name}</h3>
            <p className="text-sm text-muted mb-3">{option.description}</p>
            <span className="eyebrow">
              Riesgo: <span className={estilo.text}>{option.risk}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
