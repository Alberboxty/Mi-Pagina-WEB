import { describe, it, expect} from "vitest";
import { Transaction } from "./Transaction"
import { Editor } from "./Editor";

describe("Transaction", () => {
    it("Guarda el documento anterior y posterior", () => {
        const documentA = {
            version: 1,
            blocks: []
        };

        const documentB = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [],
                    attributes: {}
                }
            ]
        };

        const transaction = new Transaction(
            documentA,
            documentB
        );

        expect(transaction.before).toBe(documentA);
        expect(transaction.after).toBe(documentB);


    });

    it("Guarda la selección anterior y posterior", () => {

        const document = {
            version: 1,
            blocks: []
        };

        const seleccionA = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            }
        };

        const seleccionB = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 5
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 5
            }
        };

        const transaction = new Transaction(
            document,
            document,
            seleccionA,
            seleccionB
        );

        expect(transaction.selectionBefore).toBe(seleccionA);
        expect(transaction.selectionAfter).toBe(seleccionB);
    });

    it("Guarda una transacción en el historial al aplicar un cambio", () => {

        const documentA = {
            version: 1,
            blocks: []
        };

        const documentB = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [],
                    attributes: {}
                }
            ]
        };

        const editor = new Editor(documentA);

        const transaction = new Transaction(
            documentA,
            documentB
        );

        expect(editor.canUndo()).toBe(false);

        editor.apply(transaction);

        expect(editor.canUndo()).toBe(true);
        expect(editor.canRedo()).toBe(false);

        expect(editor.getDocument()).toBe(documentB);
    });

    it("Undo restaura el documento y la selección anteriores", () => {

        const documentA = {
            version: 1,
            blocks: []
        };

        const documentB = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [],
                    attributes: {}
                }
            ]
        };

        const seleccionA = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            }
        };

        const seleccionB = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 5
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 5
            }
        };

        const editor = new Editor(documentA);

        editor.setSelection(seleccionA);


        const transaction = new Transaction(
            documentA,
            documentB,
            seleccionA,
            seleccionB
        );

        editor.apply(transaction);

        expect(editor.getDocument()).toBe(documentB);
        expect(editor.getSelection()).toBe(seleccionB);

        editor.undo();

        expect(editor.getDocument()).toBe(documentA);
        expect(editor.getSelection()).toBe(seleccionA);
    });

    it("Undo restaura el documento y la selección posteriores", () => {

        const documentA = {
            version: 1,
            blocks: []
        };

        const documentB = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [],
                    attributes: {}
                }
            ]
        };

        const seleccionA = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            }
        };

        const seleccionB = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 5
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 5
            }
        };

        const editor = new Editor(documentA);


        const transaction = new Transaction(
            documentA,
            documentB,
            seleccionA,
            seleccionB
        );

        editor.apply(transaction);
        editor.undo();
        editor.redo();

        expect(editor.getDocument()).toBe(documentB);
        expect(editor.getSelection()).toBe(seleccionB);
    });

    it("Actualiza correctamente canUndo y canRedo", () => {

        const documentA = {
            version: 1,
            blocks: []
        };

        const documentB = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [],
                    attributes: {}
                }
            ]
        };

        const editor = new Editor(documentA);

        const transaction = new Transaction(
            documentA,
            documentB,
        );

        expect(editor.canUndo()).toBe(false);
        expect(editor.canRedo()).toBe(false);

        editor.apply(transaction);

        expect(editor.canUndo()).toBe(true);
        expect(editor.canRedo()).toBe(false);

        editor.undo();

        expect(editor.canUndo()).toBe(false);
        expect(editor.canRedo()).toBe(true);

        editor.redo();

        expect(editor.canUndo()).toBe(true);
        expect(editor.canRedo()).toBe(false);
    });

    it("Un cambio nuevo elimina el redo anterior", () => {

        const documentA = {
            version: 1,
            blocks: []
        };

        const documentB = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [],
                    attributes: {}
                }
            ]
        };

        const documentC = {
            version: 1,
            blocks: [
                {
                    id: "2",
                    type: "paragraph" as const,
                    children: [],
                    attributes: {}
                }
            ]
        };


        const editor = new Editor(documentA);

        const transactionB = new Transaction(
            documentA,
            documentB,
        );

        const transactionC = new Transaction(
            documentA,
            documentC,
        );

        editor.apply(transactionB);

        editor.undo();

        expect(editor.canRedo()).toBe(true);

        editor.apply(transactionC);

        expect(editor.canUndo()).toBe(true);
        expect(editor.canRedo()).toBe(false);

        expect(editor.getDocument()).toBe(documentC);

    });

    it("Undo y redo restauran tambien la selección correcta", () => {

        const documentA = {
            version: 1,
            blocks: []
        };

        const documentB = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [],
                    attributes: {}
                }
            ]
        };

        const seleccionA = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            }
        };

        const seleccionB = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 5
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 5
            }
        };

        const editor = new Editor(documentA);

        editor.setSelection(seleccionA)

        const transaction = new Transaction(
            documentA,
            documentB,
            seleccionA,
            seleccionB
        );

        editor.apply(transaction);

        expect(editor.getSelection()).toBe(seleccionB);

        editor.undo();

        expect(editor.getSelection()).toBe(seleccionA);

        editor.redo();

        expect(editor.getSelection()).toBe(seleccionB);
    });

    it("Un cambio de documento conserva correctamente la selección en undo y redo", () => {

        const documentA = {
            version: 1,
            blocks: []
        };

        const documentB = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [],
                    attributes: {}
                }
            ]
        };

        const seleccionA = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            }
        };

        const seleccionB = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 5
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 5
            }
        };

        const editor = new Editor(documentA);

        editor.setSelection(seleccionA);

        editor.applyDocument(documentB, seleccionB)

        editor.undo();

        expect(editor.getDocument()).toBe(documentA);
        expect(editor.getSelection()).toBe(seleccionA);

        editor.redo();
        
        expect(editor.getDocument()).toBe(documentB);
        expect(editor.getSelection()).toBe(seleccionB);
    });

});