// /services/data/src/server.ts

import express from 'express';
import * as dotenv from 'dotenv';
import dataController from './data.controller';
// Importamos el middleware de autenticación desde el Auth Service (simulado aquí)
import { authenticateToken } from '../../auth/src/auth.middleware'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- CONFIGURACIÓN DE SEGURIDAD Y RUTAS ---

// TODAS las rutas del Data Service están protegidas por el Token de Soberanía
app.use('/v1/data', authenticateToken, dataController);

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Error en el Data Service.',
        details: err.message
    });
});

app.listen(PORT, () => {
    console.log(`[DATA SERVICE]: Running on port ${PORT}`);
});
