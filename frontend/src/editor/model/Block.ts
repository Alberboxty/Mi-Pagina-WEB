import type {Inline} from "./Inline"

export interface Block {
    /**
     * Identificador único.
     */
    id: string;

    /**
     * Tipo del bloque.
     */
    type: string;

    /**
     * Contenido del bloque.
     */
    children: Inline[];

    /**
     * Atributos propios del bloque.
     */
    attributes?: Record<string, any>;
}