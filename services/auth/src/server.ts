// /services/auth/src/server.ts

import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import authController from './auth.controller';
// Nota: 'connectDB' se usaría para inicializar la conexión a PostgreSQL.
// Por simplicidad, se omite el código de la conexión real a DB.
// import { connectDB } from './db.config'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Simulacro de conexión a DB
const connectDB = () => {
    // Aquí iría la lógica para conectar a PostgreSQL
    console.log(`[AUTH SERVICE]: Intentando conectar a la DB: ${process.env.POSTGRES_URL}`);
};
connectDB();

// Rutas de Autenticación (Registro, Login)
app.use('/v1/auth', authController);

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Internal Server Error',
        details: err.message
    });
});

app.listen(PORT, () => {
    console.log(`[AUTH SERVICE]: Running on port ${PORT}`);
});
