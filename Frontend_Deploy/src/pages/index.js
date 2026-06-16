import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { checkSession } from "../services/authService";

const ledgerRows = [
  { label: "Ingresos", value: "120.000,00", accent: "text-teal" },
  { label: "Gastos", value: "85.000,00", accent: "text-rose" },
  { label: "Ahorro estimado", value: "35.000,00", accent: "text-gold" },
  { label: "Patrimonio total", value: "—", accent: "text-paper" },
];

export default function HomePage() {
  const [email, setEmail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    checkSession(token).then((res) => {
      if (res.email) setEmail(res.email);
    });
  }, []);

  return (
    <main className="min-h-screen bg-ink flex items-center">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div>
          <p className="eyebrow mb-4">FinTrack · Gestión patrimonial personal</p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold leading-[1.1] mb-5">
            Tu plata, llevada como un balance — no como una corazonada.
          </h1>
          <p className="text-muted text-base sm:text-lg mb-8 max-w-md">
            Registrá tus activos, conocé tu perfil de riesgo y mirá tu patrimonio
            total en un solo lugar, siempre actualizado.
          </p>

          {email ? (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Sesión activa como <span className="text-paper font-medium">{email}</span>
              </p>
              <button onClick={() => router.push("/dashboard")} className="btn-primary">
                Ir al dashboard
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button onClick={() => router.push("/login")} className="btn-primary">
                Iniciar sesión
              </button>
              <button onClick={() => router.push("/register")} className="btn-secondary">
                Crear cuenta
              </button>
            </div>
          )}
        </div>

        {/* Right: ledger mock */}
        <div className="card overflow-hidden">
          <p className="eyebrow mb-4">Resumen mensual · vista previa</p>
          <div className="divide-y divide-line">
            {ledgerRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-3.5">
                <span className="text-sm text-muted">{row.label}</span>
                <span className={`figure text-lg font-semibold ${row.accent}`}>
                  {row.value === "—" ? "—" : `$${row.value}`}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-line flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-conservador" />
            <span className="w-2 h-2 rounded-full bg-moderado" />
            <span className="w-2 h-2 rounded-full bg-agresivo" />
            <span className="text-xs text-muted ml-2">
              Recomendaciones según tu perfil de riesgo
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
