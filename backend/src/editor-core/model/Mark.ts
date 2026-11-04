
export interface Mark {
    /**
     * Tipo de formato.
     */
    type: string;

    /**
     * Configuración del formato.
     */
    attributes?: Record<string, unknown>;
}