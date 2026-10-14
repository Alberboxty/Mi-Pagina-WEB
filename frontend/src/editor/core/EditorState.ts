import type { Document } from "../model/Document";
import type { Selection } from "../model/Selection";

export class EditorState {

    private document: Document;
    private selection: Selection | null;
    private focused: boolean;
    private readOnly: boolean;

    constructor(
        document: Document,
        selection: Selection | null = null,
        focused: boolean = false,
        readOnly: boolean = false
    ) {
        this.document = document;
        this.selection = selection;
        this.focused = focused;
        this.readOnly = readOnly;
    }

    public getDocument(): Document {
        return this.document;
    }

    public setDocument(document: Document): void {
        this.document = document;
    }

    public getSelection(): Selection | null {
        return this.selection;
    }

    public setSelection(selection: Selection | null): void {
        this.selection = selection;
    }

    public isFocused(): boolean {
        return this.focused;
    }

    public setFocused(focused: boolean): void {
        this.focused = focused;
    }

    public isReadOnly(): boolean {
        return this.readOnly;
    }

    public setReadOnly(readOnly: boolean): void {
        this.readOnly = readOnly;
    }
}