import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import router from './routes/index.js';
import chatSocket from './sockets/chatSocket.js';

dotenv.config(); 

const app = express();                  // 📡 Inicializar Express
const server = http.createServer(app);  // 🔌 Crear servidor HTTP
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000' }  // 🌐 Permitir conexión desde frontend
});

// 📦 Middlewares
app.use(cors());             // 🔓 Habilitar CORS
app.use(express.json());     // 📥 Permitir solicitudes JSON

// 📌 Rutas de la API
app.use('/api', router);    

// 💬 Configuración de Socket.IO para chat en tiempo real
chatSocket(io);

// 🚀 Iniciar el servidor solo si no está en modo test
const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
}

// 🛠️ Exportar app y server para pruebas
export { app, server };
