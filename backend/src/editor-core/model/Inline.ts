import type { Mark } from "./Mark";

export interface Inline {
    /**
     * Texto del fragmento.
     */
    text: string;

    /**
     * Formatos aplicados al texto.
     */
    marks: Mark[];
}