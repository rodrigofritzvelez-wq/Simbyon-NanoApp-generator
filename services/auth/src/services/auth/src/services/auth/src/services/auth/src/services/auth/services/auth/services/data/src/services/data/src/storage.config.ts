// /services/data/src/storage.config.ts

import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento en disco temporal
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // En producción, esto sería un bucket S3 o similar.
        // Usamos una carpeta temporal de uploads para este ejemplo.
        cb(null, path.resolve(__dirname, '..', 'temp_uploads')); 
    },
    filename: (req, file, cb) => {
        // Renombrar el archivo para evitar colisiones: tenantID-timestamp-originalName
        const tenantId = req.tenantId || 'unknown';
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${tenantId}-${uniqueSuffix}${ext}`);
    }
});

/**
 * Middleware de Multer configurado para la subida de un solo archivo.
 * Límite de tamaño: 50MB (capacidad máxima para el análisis inicial).
 */
export const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.mimetype === 'application/json') {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no soportado. Solo se permiten CSV o JSON.'), false);
        }
    }
});
