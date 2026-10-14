import type { Document } from "../model/Document";
import type { Selection } from "../model/Selection";

export class Transaction {

    /**
     * Documento antes del cambio.
     */

    public readonly before: Document;

    /*
    * Documento despues del cambio.
    */

    public readonly after: Document;

    /*
    * Selección antes del cambio.
    */

    public readonly selectionBefore: Selection | null;

    /*
    * Selección después del cambio.
    */

    public readonly selectionAfter: Selection | null;


    constructor(
        before: Document,
        after: Document,
        selectionBefore: Selection | null = null,
        selectionAfter: Selection | null = null
    ) {
        this.before = before;
        this.after = after;
        this.selectionBefore = selectionBefore;
        this.selectionAfter = selectionAfter;
    }


}