export interface Position {
    /**
     * ID del bloque.
     */
    blockId: string;

    /**
     * Índice del Inline dentro del bloque.
     */
    inlineIndex: number;

    /**
     * Posición del cursor dentro del texto.
     */
    offset: number;
}

export interface Selection {
    /**
     * Donde empieza la selección.
     */
    anchor: Position;

    /**
     * Donde termina la selección.
     */
    focus: Position;
}