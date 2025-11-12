// /services/auth/src/auth.service.ts

import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = 10;
const API_KEY_LENGTH = 32; // 32 bytes de token aleatorio (64 caracteres hexadecimales)

/**
 * Servicio encargado de la lógica de seguridad y emisión de tokens.
 */
export class AuthService {
    
    /**
     * Hashea la contraseña del usuario usando bcrypt.
     */
    async hashPassword(password: string): Promise<string> {
        // Usamos bcrypt para proteger las contraseñas de la tabla 'users'.
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    /**
     * Genera un API Key único (RAW KEY) y su hash para almacenamiento (KEY HASH).
     * El rawKey es el 'Token de Soberanía' que usa el SimbyonClient.
     */
    generateApiKeyHash(): { keyHash: string, rawKey: string } {
        // 1. Generar la clave RAW (la que se le da al cliente, NO se almacena en DB)
        const rawKey = crypto.randomBytes(API_KEY_LENGTH).toString('hex');

        // 2. Hashear la clave RAW para el almacenamiento en DB (KEY HASH)
        // Usamos SHA-256 para un hashing rápido en las peticiones.
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

        return { keyHash, rawKey };
    }

    /**
     * Valida una clave RAW recibida del SimbyonClient contra el hash almacenado en DB.
     */
    validateApiKey(rawKey: string, storedHash: string): boolean {
        // Hashing rápido y seguro para validar la clave sin usar recursos de bcrypt.
        const incomingHash = crypto.createHash('sha256').update(rawKey).digest('hex');
        return incomingHash === storedHash;
    }
}

export default new AuthService();
