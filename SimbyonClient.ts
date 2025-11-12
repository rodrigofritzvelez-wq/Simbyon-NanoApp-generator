// ====================================
// SIMBYON SDK v1.0.0 (TS Core Implementation)
// ====================================

// ========== TYPES & INTERFACES (Reutilizados de la especificación original) ==========

export interface SimbyonConfig {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
    environment?: 'development' | 'staging' | 'production';
}

export interface DataUpload {
    id: string;
    filename: string;
    fileType: 'csv' | 'json';
    rowCount: number;
    status: 'uploaded' | 'processing' | 'processed' | 'failed';
    createdAt: Date;
}

export interface SystemAnalysis {
    id: string;
    systemType: 'supply_chain' | 'healthcare' | 'iot_energy' | 'financial';
    detectedConfidence: number;
    dataVolume: number;
    beforeMetrics: any; // Usar 'any' por simplicidad, se usarían PerformanceMetrics reales.
    afterMetrics: any;
    createdAt: Date;
}

// ... Otras interfaces (Optimization, NanoApp, etc.) irían aquí.

// ========== ERROR HANDLING ==========

export class SimbyonError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public details?: any
    ) {
        super(message);
        this.name = 'SimbyonError';
    }
}

// ========== MAIN SDK CLASS ==========

export class SimbyonClient {
    private config: Required<SimbyonConfig>;
    private headers: Record<string, string>;

    constructor(config: SimbyonConfig) {
        this.config = {
            apiKey: config.apiKey,
            baseUrl: config.baseUrl || 'https://api.simbyon.com/v1',
            timeout: config.timeout || 30000,
            retryAttempts: config.retryAttempts || 3,
            environment: config.environment || 'production'
        };

        this.headers = {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'X-Simbyon-SDK': 'typescript-1.0.0'
        };
    }

    // ========== DATA MANAGEMENT (Ejemplo de Implementación) ==========

    /**
     * Sube el archivo de datos para iniciar el Análisis Ontológico.
     * @param file - Objeto File o Blob con los datos.
     * @param metadata - Metadatos opcionales.
     */
    async uploadData(file: File | Blob, metadata?: any): Promise<DataUpload> {
        const formData = new FormData();
        formData.append('file', file);
        if (metadata) {
            formData.append('metadata', JSON.stringify(metadata));
        }

        // Sobrescribir 'Content-Type' para permitir el boundary de FormData
        const response = await this.request('/data/upload', {
            method: 'POST',
            body: formData,
            headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
        });

        return this.parseDataUpload(response);
    }

    // ========== SYSTEM ANALYSIS (Ejemplo de Implementación) ==========

    /**
     * Inicia el Diagnóstico Ontológico sobre los datos subidos.
     * @param uploadId - ID del archivo de datos subido.
     */
    async startAnalysis(uploadId: string, systemType: string): Promise<SystemAnalysis> {
        const response = await this.request('/analysis/start', {
            method: 'POST',
            body: JSON.stringify({ uploadId, systemType })
        });
        return this.parseAnalysis(response);
    }
    
    // NOTA: Otros métodos como 'getAnalysis', 'runOptimization', y 'generateNanoApp'
    // utilizan la misma estructura 'request' y 'parse'.

    // ========== HELPER METHODS (Core Logic) ==========

    /**
     * Manejador central de peticiones con lógica de retry y timeout.
     */
    private async request(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<any> {
        const url = `${this.config.baseUrl}${endpoint}`;
        // Combina headers por defecto y headers específicos de la petición
        const headers = options.body instanceof FormData 
            ? { 'Authorization': this.headers['Authorization'], 'X-Simbyon-SDK': this.headers['X-Simbyon-SDK'] }
            : { ...this.headers, ...options.headers };

        let lastError: Error | null = null;

        for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(
                    () => controller.abort(),
                    this.config.timeout
                );

                const response = await fetch(url, {
                    ...options,
                    headers,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const error = await response.json();
                    throw new SimbyonError(
                        error.message || 'Request failed',
                        response.status,
                        error
                    );
                }

                return await response.json();
            } catch (error) {
                lastError = error as Error;
                
                if (error instanceof SimbyonError) throw error; // No reintentar errores de negocio
                
                if (attempt < this.config.retryAttempts - 1) {
                    // Backoff exponencial: 1s, 2s, 4s...
                    await this.sleep(Math.pow(2, attempt) * 1000);
                }
            }
        }

        throw lastError; // Lanza el último error después de todos los reintentos
    }

    private parseDataUpload(data: any): DataUpload {
        return {
            ...data,
            // Conversión explícita del timestamp a objeto Date
            createdAt: new Date(data.createdAt) 
        };
    }

    private parseAnalysis(data: any): SystemAnalysis {
        return {
            ...data,
            // Conversión explícita del timestamp a objeto Date
            createdAt: new Date(data.createdAt)
        };
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Implementación de WebSockets (streaming) - Solo la conexión
    subscribeToAnalysisProgress(
        analysisId: string,
        callback: (progress: { percentage: number; stage: string }) => void
    ): WebSocket {
        const wsUrl = this.config.baseUrl.replace('http', 'ws');
        const ws = new WebSocket(`${wsUrl}/ws/analysis/${analysisId}`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            callback(data);
        };

        return ws;
    }
}

export default SimbyonClient;
