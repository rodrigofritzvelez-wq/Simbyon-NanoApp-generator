// /services/auth/src/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import authService from './auth.service';

/**
 * Interface extendida para añadir el 'tenantId' al objeto de Request.
 * Esto permite que los controladores subsiguientes sepan quién está haciendo la petición.
 */
interface AuthenticatedRequest extends Request {
    tenantId?: string;
}

/**
 * Middleware para validar el Token de Soberanía (API Key Hash) en todas las peticiones protegidas.
 *
 * Busca el formato: Authorization: Bearer <raw_api_key>
 */
export async function authenticateToken(
    req: AuthenticatedRequest, 
    res: Response, 
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Se requiere un Token de Soberanía (Bearer).' });
    }

    // Extrae la clave RAW del formato "Bearer <raw_key>"
    const rawApiKey = authHeader.split(' ')[1];

    if (!rawApiKey) {
        return res.status(401).json({ message: 'Token de Soberanía inválido o vacío.' });
    }

    try {
        // 1. Simulación de búsqueda en la base de datos
        // En un entorno real, buscarías en la tabla 'api_keys' por el hash SHA-256 del rawApiKey
        
        // **Simulamos encontrar un tenant y su hash almacenado:**
        const simulatedTenant = {
            id: 'simbion-tnt-42',
            companyName: 'Symbion Corp',
            // Este hash DEBE ser el resultado de crypto.createHash('sha256').update(rawApiKey).digest('hex')
            storedKeyHash: 'f45d3e8b0a9c1b2f4c6d8e0a1b3c5d7e9f0a2b4c6d8e0a1b3c5d7e9f0a2b4c6d' 
        };
        
        // 2. Validación de la clave
        const isKeyValid = authService.validateApiKey(rawApiKey, simulatedTenant.storedKeyHash);

        if (!isKeyValid) {
            // Se registra el intento fallido por si es un ataque
            console.warn(`[SECURITY FAIL]: Intento fallido de API Key para el tenant: ${simulatedTenant.id}`);
            return res.status(401).json({ message: 'Token de Soberanía no válido o revocado.' });
        }

        // 3. Aprobación: Inyecta el tenantId en el request (Principio RLS)
        req.tenantId = simulatedTenant.id;
        
        // Continúa con la ejecución del controlador (ej. startAnalysis)
        next();

    } catch (error) {
        console.error(`[AUTH ERROR]: Error al procesar el token: ${error.message}`);
        return res.status(500).json({ message: 'Error interno de autenticación.' });
    }
}
