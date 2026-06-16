import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "../hooks/useSession";
import { evaluateProfile } from "../services/userService";
import { jwtDecode } from "jwt-decode";

const preguntas = [
  "¿Qué harías si tus inversiones bajan un 10% en una semana?",
  "¿Cuál es tu objetivo principal al invertir?",
  "¿Qué opinás de invertir en criptomonedas?",
  "¿Cuánto tiempo estás dispuesto a mantener una inversión?",
  "¿Qué porcentaje de tu ingreso estás dispuesto a invertir?",
  "¿Cómo reaccionás ante noticias económicas negativas?",
];

const opciones = [
  { CONSERVADOR: "Retiro todo", MODERADO: "Espero a ver qué pasa", AGRESIVO: "Compro más" },
  { CONSERVADOR: "Proteger mi capital", MODERADO: "Crecer lentamente", AGRESIVO: "Maximizar ganancias" },
  { CONSERVADOR: "No me interesa", MODERADO: "Podría probar con poco", AGRESIVO: "Me encanta el riesgo" },
  { CONSERVADOR: "Menos de 1 año", MODERADO: "1–3 años", AGRESIVO: "Más de 3 años" },
  { CONSERVADOR: "Menos del 10%", MODERADO: "10–25%", AGRESIVO: "Más del 25%" },
  { CONSERVADOR: "Me preocupa mucho", MODERADO: "Me informo y evalúo", AGRESIVO: "Veo oportunidades" },
];

export default function ProfileEvaluator() {
  const { user } = useSession();
  const router = useRouter();

  const [responses, setResponses] = useState(Array(6).fill(""));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (index, value) => {
    const updated = [...responses];
    updated[index] = value;
    setResponses(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.email) {
      setMessage("La sesión aún no está lista. Esperá unos segundos e intentá nuevamente.");
      return;
    }

    if (responses.some((r) => r === "")) {
      alert("Por favor respondé todas las preguntas.");
      return;
    }

    setLoading(true);

    const count = { CONSERVADOR: 0, MODERADO: 0, AGRESIVO: 0 };
    responses.forEach((perfil) => {
      if (count[perfil] !== undefined) count[perfil]++;
    });

    const perfilDominante = Object.entries(count).reduce((a, b) => (b[1] > a[1] ? b : a))[0];

    try {
      const response = await evaluateProfile(perfilDominante, user.email);

      if (response?.typePerfil && response.token) {
        localStorage.setItem("token", response.token);
        jwtDecode(response.token);

        setResult({ perfil: perfilDominante, conteo: count });

        setTimeout(() => {
          router.push("/dashboard?refresh=true");
        }, 3000);
      } else {
        alert("No se pudo actualizar el perfil.");
      }
    } catch (error) {
      console.error("Error al evaluar perfil:", error);
    }

    setLoading(false);
  };

  if (!user || !user.email) {
    return (
      <div className="text-center py-6">
        <p className="text-muted text-sm">Cargando sesión… Esperá unos segundos.</p>
        {message && <p className="text-rose mt-2 text-sm">{message}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="eyebrow mb-1">Reevaluación</p>
        <h2 className="font-display text-2xl font-bold">Perfil financiero</h2>
      </div>

      {preguntas.map((pregunta, i) => (
        <div key={i}>
          <label className="label-field">{pregunta}</label>
          <select
            value={responses[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            required
            className="input-field"
          >
            <option value="">Seleccionar una opción</option>
            {Object.entries(opciones[i]).map(([perfil, texto]) => (
              <option key={perfil} value={perfil}>
                {texto}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button type="submit" disabled={loading || !user || !user.email} className="btn-primary w-full">
        {loading ? "Evaluando…" : "Confirmar perfil"}
      </button>

      {result && (
        <div className="bg-surface-2 border border-line rounded-md p-4">
          <p className="text-sm text-muted mb-1">Nuevo perfil asignado</p>
          <p className="font-display text-xl font-bold text-gold mb-3">{result.perfil}</p>
          <div className="space-y-1 text-sm text-muted">
            <div className="flex justify-between">
              <span className="text-conservador">Conservador</span>
              <span className="figure">{result.conteo.CONSERVADOR}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-moderado">Moderado</span>
              <span className="figure">{result.conteo.MODERADO}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-agresivo">Agresivo</span>
              <span className="figure">{result.conteo.AGRESIVO}</span>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
