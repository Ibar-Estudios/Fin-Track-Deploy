export const resumenFinanciero = {
  income: 120000,
  expenses: 85000,
  savings: 35000,
};

export const recomendacionesPorPerfil = {
  CONSERVADOR: [
    "Invertí en fondos de bajo riesgo durante los próximos 6 meses.",
    "Evitá gastos innecesarios en suscripciones que no usás.",
    "Considerá abrir una cuenta remunerada para tu ahorro mensual.",
  ],
  MODERADO: [
    "Diversificá entre bonos y acciones estables.",
    "Explorá fondos mixtos con rendimiento histórico sólido.",
    "Revisá tu portafolio cada trimestre para ajustar riesgos.",
  ],
  AGRESIVO: [
    "Explorá inversiones en startups o criptomonedas.",
    "Aprovechá oportunidades en mercados emergentes.",
    "Asigná un porcentaje mayor a activos de alto rendimiento.",
  ],
};

export const estiloPorPerfil = {
  CONSERVADOR: {
    accent: "border-conservador",
    text: "text-conservador",
    chip: "bg-conservador/15 text-conservador",
    label: "Conservador",
  },
  MODERADO: {
    accent: "border-moderado",
    text: "text-moderado",
    chip: "bg-moderado/15 text-moderado",
    label: "Moderado",
  },
  AGRESIVO: {
    accent: "border-agresivo",
    text: "text-agresivo",
    chip: "bg-agresivo/15 text-agresivo",
    label: "Agresivo",
  },
};


export const opcionesDeInversionPorPerfil = {
  CONSERVADOR: [
    {
      name: "Fondos comunes de inversión",
      description: "Diversificá tu capital en instrumentos de renta fija y variable.",
      risk: "Bajo",
    },
    {
      name: "Bonos soberanos",
      description: "Invertí en deuda pública con vencimientos a mediano plazo.",
      risk: "Moderado",
    },
  ],
  MODERADO: [
    {
      name: "Bonos corporativos",
      description: "Invertí en empresas sólidas con buena calificación crediticia.",
      risk: "Moderado",
    },
    {
      name: "ETFs sectoriales",
      description: "Diversificá en sectores como salud, tecnología o energía.",
      risk: "Medio",
    },
  ],
  AGRESIVO: [
    {
      name: "Acciones tecnológicas",
      description: "Participá en el crecimiento de empresas innovadoras.",
      risk: "Alto",
    },
    {
      name: "Criptomonedas",
      description: "Explorá activos digitales con alto potencial y volatilidad.",
      risk: "Muy alto",
    },
  ],
};


export const consejosDeAhorroPorPerfil = {
  CONSERVADOR: [
    "Automatizá una transferencia mensual a tu cuenta de ahorro.",
    "Reducí el uso de tarjeta de crédito para compras impulsivas.",
    "Establecé un objetivo de ahorro claro y medible.",
  ],
  MODERADO: [
    "Usá una app para registrar tus gastos diarios.",
    "Establecé metas trimestrales de ahorro.",
    "Revisá tus suscripciones y eliminá las que no usás.",
  ],
  AGRESIVO: [
    "Aprovechá cashback y recompensas por consumo inteligente.",
    "Reinvertí tus ahorros en activos de alto rendimiento.",
    "Establecé un fondo de emergencia para cubrir riesgos.",
  ],
};


export const perfilesFinancieros = {
  CONSERVADOR: {
    nivel: "Conservador",
    edad: 45,
    objetivos: ["Mantener estabilidad", "Minimizar riesgos", "Ahorrar a largo plazo"],
  },
  MODERADO: {
    nivel: "Moderado",
    edad: 35,
    objetivos: ["Equilibrar riesgo y retorno", "Invertir en fondos mixtos", "Ahorrar para vivienda"],
  },
  AGRESIVO: {
    nivel: "Agresivo",
    edad: 28,
    objetivos: ["Maximizar retorno", "Invertir en criptomonedas", "Explorar startups"],
  },
};
