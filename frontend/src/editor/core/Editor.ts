import type { Document } from "../model/Document";
import type { Selection } from "../model/Selection";

import { History } from "./History"
import { EditorState } from "./EditorState"
import { Transaction } from "./Transaction"
import { Commands } from "../commands/Commands";

import { HtmlRenderer } from "../renderer/HtmlRenderer";

export class Editor {

    private state: EditorState;
    private history: History;

    public renderer: HtmlRenderer;

    private listeners: (() => void)[] = [];

    public readonly commands: Commands;

    constructor(document?: Document) {

        const initialDocument: Document = document ?? {
            version: 1,
            blocks: []
        }

        this.state = new EditorState(initialDocument);
        this.history = new History();

        this.renderer = new HtmlRenderer();

        this.commands = new Commands(this);

    }

    /**
     * Obtiene el documento actual.
     */
    public getDocument(): Document {
        return this.state.getDocument();
    }

    /**
     * Aplica un documento junto con su selección final.
     * Si se pasa mergeKey, las transacciones consecutivas con la misma
     * clave (y poco tiempo entre ellas) se agrupan en un solo paso del historial.
     */
    public applyDocument(
        document: Document,
        selection: Selection | null = this.state.getSelection(),
        mergeKey?: string
    ): void {
        const transaction = new Transaction(
            this.state.getDocument(),
            document,
            this.state.getSelection(),
            selection
        );

        this.apply(transaction, mergeKey);
    }

    /**
     * Sustituye el documento completo.
     */
    public setDocument(document: Document): void {
        this.applyDocument(document);
    }

    /**
     * Obtiene la selección actual.
     */
    public getSelection(): Selection | null {
        return this.state.getSelection();
    }

    /**
     * Cambia la selección.
     */
    public setSelection(selection: Selection | null): void {
        this.state.setSelection(selection)
    }

    public isFocused(): boolean {
        return this.state.isFocused();
    }

    public setFocused(focused: boolean): void {
        this.state.setFocused(focused);
    }

    public isReadOnly(): boolean {
        return this.state.isReadOnly();
    }

    public setReadOnly(readOnly: boolean): void {
        this.state.setReadOnly(readOnly);
    }

    public subscribe(listener: () => void): () => void {
        this.listeners.push(listener);

        return () => {
            this.listeners = this.listeners.filter(
                current => current !== listener
            );
        }
    }

    private notify(): void {
        for (const listener of this.listeners) {
            listener();
        }
    }

    public canUndo(): boolean {
        return this.history.canUndo();
    }

    public canRedo(): boolean {
        return this.history.canRedo();
    }

    public undo(): void {
        const transaction = this.history.undo();
        if (!transaction) {
            return;
        }

        this.state.setDocument(transaction.before);
        this.state.setSelection(transaction.selectionBefore);

        this.notify();
    }

    public redo(): void {
        const transaction = this.history.redo();
        if (!transaction) {
            return;
        }

        this.state.setDocument(transaction.after);
        this.state.setSelection(transaction.selectionAfter);

        this.notify();
    }

    public apply(transaction: Transaction, mergeKey?: string): void {
        this.state.setDocument(transaction.after);
        this.state.setSelection(transaction.selectionAfter);

        this.history.push(transaction, mergeKey);

        this.notify();
    }

    public render(): string {
        return this.renderer.render(this.getDocument());
    }
}