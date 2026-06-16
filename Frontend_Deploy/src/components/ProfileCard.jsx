import { useRouter } from "next/router";
import { mapPerfilToLabel } from "@/utils/mapPerfilToLabel";
import { estiloPorPerfil } from "../data/dashboardData";

export default function ProfileCard({ profile, typePerfil, edadUsuario }) {
  const router = useRouter();
  if (!profile) return null;

  const { objetivos } = profile;
  const estilo = estiloPorPerfil[typePerfil] || estiloPorPerfil.CONSERVADOR;

  const descripcion = {
    CONSERVADOR: "Prioriza estabilidad y bajo riesgo.",
    MODERADO: "Busca equilibrio entre riesgo y retorno.",
    AGRESIVO: "Apunta a maximizar ganancias asumiendo mayor riesgo.",
  }[typePerfil];

  return (
    <div className={`card-accent ${estilo.accent} flex flex-col`}>
      <p className="eyebrow mb-2">Perfil financiero</p>

      <p className={`font-display text-2xl sm:text-3xl font-bold mb-1 ${estilo.text}`}>
        {mapPerfilToLabel[typePerfil]}
      </p>

      <p className="text-sm text-muted mb-4">
        Edad: <span className="figure text-paper">{edadUsuario}</span> años
      </p>

      <p className="text-sm text-muted mb-5">{descripcion}</p>

      <div className="mb-6">
        <p className="eyebrow mb-2">Objetivos</p>
        <ul className="space-y-1.5">
          {Array.isArray(objetivos) &&
            objetivos.map((objetivo, index) => (
              <li key={index} className="text-sm text-paper flex gap-2">
                <span className={estilo.text}>·</span>
                {objetivo}
              </li>
            ))}
        </ul>
      </div>

      <button onClick={() => router.push("/evaluate")} className="btn-secondary mt-auto self-start">
        Reevaluar perfil
      </button>
    </div>
  );
}
