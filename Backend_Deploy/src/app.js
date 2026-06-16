const app = require('./server/server');
const { connection } = require('./db/connection');

const PORT = process.env.PORT || 5000;

connection().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        console.log(`✅ MongoDB conectado`);
    });
}).catch(err => {
    console.error('❌ Error conectando MongoDB:', err);
    process.exit(1);
});
