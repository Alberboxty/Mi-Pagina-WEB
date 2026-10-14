import type { Block } from "./Block"

export interface Document {
    /**
     * Versión del formato del documento.
     * Permitirá migrar documentos en el futuro.
     */
    version: number;

    /**
     * Bloques que forman el documento.
     */
    blocks: Block[];
}