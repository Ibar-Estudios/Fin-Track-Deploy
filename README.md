# 💰 FinTrack — Gestión Patrimonial Personal

FinTrack es una aplicación web full-stack para el seguimiento y gestión de activos financieros personales. Permite registrar activos (acciones, bonos, criptomonedas, etc.), gestionar métodos de pago, visualizar el patrimonio total y recibir recomendaciones de inversión personalizadas según el perfil de riesgo del usuario.

---

## 📋 Tabla de contenidos

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Requisitos previos](#-requisitos-previos)
- [Variables de entorno](#-variables-de-entorno)
- [Instalación y uso local](#-instalación-y-uso-local)
- [API Reference](#-api-reference)
- [Modelos de datos](#-modelos-de-datos)
- [Perfiles de inversión](#-perfiles-de-inversión)
- [Deploy](#-deploy)

---

## ✨ Características

- **Autenticación JWT** con sesión persistente y validación por middleware
- **Gestión de activos**: crear, editar, eliminar y listar activos financieros (stocks, bonos, crypto, real estate, commodities)
- **Precios en tiempo real** mediante integración con la API de [Marketstack](https://marketstack.com/)
- **Validación de símbolos bursátiles** con caché de 12 horas para optimizar llamadas a la API
- **Wallet personal**: múltiples métodos de pago (banco, MercadoPago, PayPal, crypto, efectivo) con soporte para depósitos
- **Historial de movimientos**: registro de compras y ventas de activos
- **Evaluador de perfil de riesgo**: cuestionario interactivo que clasifica al usuario como Conservador, Moderado o Agresivo
- **Dashboard personalizado**: recomendaciones, opciones de inversión y consejos de ahorro según el perfil
- **Resumen patrimonial**: cálculo automático del patrimonio total basado en precios actuales

---

## 🛠️ Tech Stack

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | — | Runtime |
| Express | ^5.1.0 | Framework HTTP |
| MongoDB + Mongoose | ^8.18.0 | Base de datos |
| bcryptjs | ^3.0.2 | Hashing de contraseñas |
| jsonwebtoken | ^9.0.2 | Autenticación JWT |
| express-validator | ^7.2.1 | Validación de inputs |
| axios | ^1.11.0 | Llamadas a API externa |
| dotenv | ^17.2.1 | Variables de entorno |
| nodemon | ^3.1.10 | Dev server con hot reload |

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | ^16.2.9 | Framework React con SSR |
| React | 19.1.0 | UI |
| Tailwind CSS | ^4.1.13 | Estilos |
| Chart.js + react-chartjs-2 | ^4.5.0 | Gráficos de distribución |
| axios | ^1.11.0 | Llamadas al backend |
| jwt-decode | ^4.0.0 | Decodificación del token en cliente |

---

## 📁 Estructura del proyecto

```
Fin-Track-Deploy-main/
├── Backend_Deploy/
│   └── src/
│       ├── app.js                  # Entry point
│       ├── server/
│       │   └── server.js           # Configuración Express + CORS
│       ├── db/
│       │   └── connection.js       # Conexión a MongoDB
│       ├── models/
│       │   ├── user.model.js
│       │   ├── asset.model.js
│       │   ├── wallet.model.js
│       │   └── movement.model.js
│       ├── controllers/            # Capa de control HTTP
│       ├── services/               # Lógica de negocio
│       ├── routes/                 # Definición de endpoints
│       └── utils/
│           ├── generateJWT.js
│           ├── validateToken.js    # Middleware de auth
│           ├── validateSymbol.js   # Middleware con caché de símbolos
│           └── validateTypes.js
│
└── Frontend_Deploy/
    └── src/
        ├── pages/
        │   ├── index.js            # Landing page
        │   ├── login.jsx
        │   ├── register.jsx
        │   ├── dashboard.jsx       # Panel principal del usuario
        │   └── evaluate.jsx        # Evaluador de perfil de riesgo
        ├── components/             # Componentes reutilizables
        ├── services/               # Llamadas al backend (axios)
        ├── hooks/
        │   ├── useSession.js       # Manejo de sesión activa
        │   └── useLogout.js
        ├── data/
        │   └── dashboardData.js    # Recomendaciones por perfil
        └── styles/
            └── global.css
```

---

## ✅ Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [MongoDB](https://www.mongodb.com/) (local o Atlas)
- Clave de API de [Marketstack](https://marketstack.com/) (plan gratuito disponible)

---

## 🚀 Instalación y uso local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Ibar-Estudios/Fin-Track-Deploy.git
cd fin-track
```

### 2. Iniciar el Backend

```bash
cd Backend_Deploy
npm install
npm run dev        # con hot reload (nodemon)
# o
npm start          # producción
```

El servidor quedará corriendo en `http://localhost:5000`.

### 3. Iniciar el Frontend

```bash
cd Frontend_Deploy
npm install
npm run dev        # con Turbopack
```

La app estará disponible en `http://localhost:3000`.

---

## 📡 API Reference

### Autenticación — `/auth`

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/auth/login` | Iniciar sesión, retorna JWT | ❌ |
| GET | `/auth/session` | Verificar sesión activa | ✅ Bearer |

### Usuarios — `/user`

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/user/register` | Crear cuenta nueva |
| GET | `/user/:username` | Obtener perfil por username |
| PUT | `/user/:username` | Editar datos del usuario |
| DELETE | `/user/:id` | Eliminar cuenta |
| POST | `/user/evaluate-profile` | Asignar perfil de inversión |

> **Validaciones en registro**: email válido, edad mínima 18 años, contraseña de 8–20 caracteres con al menos 1 dígito.

### Activos — `/assets`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/assets/user/:userId` | Listar activos del usuario |
| POST | `/assets/user/:userId` | Crear nuevo activo (valida símbolo) |
| PUT | `/assets/:assetId` | Editar activo (actualiza precio actual) |
| DELETE | `/assets/:assetId` | Eliminar activo |

### Wallet — `/wallet`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/wallet/user/:userId` | Ver métodos de pago |
| POST | `/wallet/user/:userId` | Agregar método de pago |
| POST | `/wallet/user/:userId/deposit/:methodId` | Depositar fondos |
| DELETE | `/wallet/user/:userId/:methodId` | Eliminar método |

### Movimientos — `/movements`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/movements/:id` | Historial de movimientos de un activo |
| POST | `/movements/` | Registrar compra o venta |

---

## 🗂️ Modelos de datos

### User
```js
{
  name: String,
  username: String (único),
  email: String (único),
  password: String (hash),
  age: Number (min: 18),
  rol: "ADMIN" | "USER",
  typePerfil: "CONSERVADOR" | "MODERADO" | "AGRESIVO",
  walletBalance: Number
}
```

### Asset
```js
{
  name: String,
  type: "stock" | "bond" | "crypto" | "real_estate" | "commodity" | "other",
  value: Number,
  currency: String (default: "USD"),
  averagePrice: Number,
  currentPrice: Number,   // obtenido de Marketstack
  user: ObjectId (ref: User)
}
```

### WalletMethod
```js
{
  user: ObjectId (ref: User),
  type: "bank" | "mercadopago" | "paypal" | "crypto" | "cash",
  label: String,
  lastFour: String,
  balance: Number
}
```

### Movement
```js
{
  asset: ObjectId (ref: Asset),
  type: "BUY" | "SELL",
  quantity: Number,
  price: Number,
  date: Date
}
```

---

## 📊 Perfiles de inversión

El evaluador de perfil clasifica a los usuarios en base a 6 preguntas sobre tolerancia al riesgo, horizonte temporal y objetivos financieros:

| Perfil | Descripción | Instrumentos sugeridos |
|---|---|---|
| **CONSERVADOR** | Prioriza proteger el capital | Fondos comunes de bajo riesgo, bonos soberanos |
| **MODERADO** | Busca crecimiento equilibrado | Bonos corporativos, ETFs sectoriales |
| **AGRESIVO** | Maximiza el retorno asumiendo más riesgo | Acciones tecnológicas, criptomonedas |

---

## ☁️ Deploy

### Backend — [Render](https://render.com/](https://fin-track-deploy.onrender.com) 

1. Crear un nuevo Web Service apuntando a `Backend_Deploy/`
2. Build command: `npm install`
3. Start command: `npm start`
4. Configurar las variables de entorno en el dashboard del proveedor
5. Actualizar `FRONTEND_URL` con la URL de producción del frontend

### Frontend — [Vercel](fin-track-deploy-sooty.vercel.app)

1. Conectar el repositorio desde el dashboard de Vercel
2. Definir el directorio raíz como `Frontend_Deploy/`
3. Agregar `NEXT_PUBLIC_API_URL` apuntando al backend desplegado
4. Vercel detecta Next.js automáticamente

> El backend está configurado para aceptar CORS desde cualquier dominio `*.vercel.app`, por lo que el deploy en Vercel funciona sin configuración adicional.

---

## 📄 Caubet Ibar.Dev

ISC
