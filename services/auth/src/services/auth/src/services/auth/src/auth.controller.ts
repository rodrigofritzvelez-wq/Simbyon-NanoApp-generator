// /services/auth/src/auth.controller.ts

import { Router, Request, Response } from 'express';
import authService from './auth.service';

const router = Router();

/**
 * [POST] /v1/auth/register
 * Crea un nuevo tenant/usuario y genera su primer API Key Hash.
 */
router.post('/register', async (req: Request, res: Response) => {
    const { email, password, companyName } = req.body;

    if (!email || !password || !companyName) {
        return res.status(400).json({ message: 'Faltan datos requeridos (email, password, companyName).' });
    }

    try {
        // 1. Hashear la contraseña para el almacenamiento seguro
        const hashedPassword = await authService.hashPassword(password);
        
        // 2. Generar el Token de Soberanía
        const { keyHash, rawKey } = authService.generateApiKeyHash();

        // 3. Simulación de almacenamiento en DB (Tabla 'users' y 'api_keys')
        // const newUser = await db.users.create({ email, hashedPassword, companyName });
        // const newApiKey = await db.api_keys.create({ keyHash, tenantId: newUser.id });

        // Nota: Solo se retorna la clave RAW (el token) una vez al cliente.
        res.status(201).json({
            message: 'Registro exitoso y Token de Soberanía generado.',
            tenantId: 'simbion-tnt-42', // ID simulado
            apiKey: rawKey, // ESTA ES LA CLAVE QUE USA EL SimbyonClient
            warning: 'Guarde esta API Key. Nunca será visible de nuevo.'
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el proceso de registro.', details: error.message });
    }
});

/**
 * [POST] /v1/auth/login
 * Permite a un usuario existente generar una nueva API Key.
 */
router.post('/login', (req: Request, res: Response) => {
    // La lógica de login y generación de clave es similar a 'register', 
    // pero requiere una verificación de contraseña (bcrypt.compare) previa.
    res.status(501).json({ message: 'Endpoint no implementado aún.' });
});


export default router;
