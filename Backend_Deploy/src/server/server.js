const express = require("express");
require("dotenv").config();
const cors = require("cors");

const userRouter = require("../routes/user.routes");
const assetRouter = require("../routes/asset.routes");
const movementRouter = require("../routes/movement.routes");
const authRouter = require("../routes/auth.routes");
const walletRouter = require("../routes/wallet.routes");

const app = express();
app.use(express.json());

// Dynamic CORS — accepts localhost and any *.vercel.app URL
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app')
        ) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.get('/', (req, res) => res.json({ message: 'FinTrack API OK' }));

app.use("/user", userRouter);
app.use("/assets", assetRouter);
app.use("/movements", movementRouter);
app.use("/auth", authRouter);
app.use("/wallet", walletRouter);

// 404
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
