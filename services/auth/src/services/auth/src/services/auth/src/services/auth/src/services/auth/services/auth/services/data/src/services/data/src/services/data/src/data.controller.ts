// /services/data/src/data.controller.ts

import { Router, Request, Response } from 'express';
import { upload } from './storage.config';
import dataService from './data.service';

const router = Router();

// Extensión del Request para obtener el tenantId del middleware de Auth
interface AuthenticatedRequest extends Request {
    tenantId?: string;
    file?: Express.Multer.File; // Añadido por Multer
}

/**
 * [POST] /v1/data/upload
 * Endpoint que recibe la data del SimbyonClient.
 */
router.post('/upload', 
    upload.single('file'), // Middleware de Multer que procesa el archivo
    async (req: AuthenticatedRequest, res: Response) => {
    
    // El middleware de Multer ya ha guardado el archivo en el disco y lo puso en req.file
    if (!req.file) {
        return res.status(400).json({ message: 'No se recibió ningún archivo de datos.' });
    }

    try {
        const file = req.file;
        const tenantId = req.tenantId!; // Garantizado por authenticateToken middleware

        // 1. Simular el registro de la subida en la base de datos
        const uploadRecord = await dataService.registerUpload(tenantId, file);

        // 2. Notificar al sistema de cola (RabbitMQ) que hay un archivo listo para Análisis
        dataService.publishToAnalysisQueue(uploadRecord.id);

        // Retornar el DataUpload ID que el SimbyonClient espera
        res.status(200).json({
            id: uploadRecord.id,
            filename: uploadRecord.filename,
            fileType: uploadRecord.fileType,
            rowCount: uploadRecord.rowCount, // Este dato debe ser real, simulado aquí
            status: 'uploaded',
            createdAt: new Date().toISOString()
        });

    } catch (error) {
        // En caso de error, el archivo debe ser eliminado del almacenamiento temporal
        console.error('Error al procesar la subida y registro:', error);
        res.status(500).json({ message: 'Fallo en el registro de la carga de datos.' });
    }
});

export default router;
