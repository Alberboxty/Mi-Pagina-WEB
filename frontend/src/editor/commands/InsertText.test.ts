import { describe, it, expect} from "vitest";

import { Editor } from "../core/Editor"

import { insertText } from "./InsertText"

describe("InsertText", () => {
    it("Requiere una selección", () => {
        const editor = new Editor();

        insertText(editor, "Hola");

        expect(editor.getDocument().blocks).toHaveLength(0);
    });

    it("Inserta texto al final de un Inline", () => {
        const editor = new Editor();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola",
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        editor.setDocument(document);

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        })

        insertText(editor, " mundo");

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola mundo");
    });

    it("Inserta texto a la mitad de un Inline", () => {
        const editor = new Editor();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola mundo",
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        editor.setDocument(document);

        editor.setSelection({
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
        })

        insertText(editor, "gran ");

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola gran mundo");
    });

    it("Inserta texto correctamente con varios Inline", () => {
        const editor = new Editor();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola ",
                            marks: []
                        },
                        {
                            text: "mundo",
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        editor.setDocument(document);

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 1,
                offset: 2
            },
            focus: {
                blockId: "1",
                inlineIndex: 1,
                offset: 2
            }
        })

        insertText(editor, "gran ");

        const children = editor.getDocument().blocks[0].children;

        expect(children).toHaveLength(2);

        expect(children[0].text).toBe("Hola ");
        expect(children[1].text).toBe("mugran ndo");
    });

    it("Conserva los marks del Inline al insertar texto", () => {
        const editor = new Editor();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola ",
                            marks: []
                        },
                        {
                            text: "mundo",
                            marks: [
                                {
                                    type: "bold"
                                }
                            ]
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        editor.setDocument(document);

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 1,
                offset: 2
            },
            focus: {
                blockId: "1",
                inlineIndex: 1,
                offset: 2
            }
        })

        insertText(editor, "gran ");

        const inline = editor.getDocument().blocks[0].children[1];

        expect(inline.text).toBe("mugran ndo");
        expect(inline.marks).toEqual([
            {
                type: "bold"
            }
        ]);
    });

    it("Undo restaura la selección anterior a insertar texto", () => {
        const editor = new Editor();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola",
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        editor.setDocument(document);

        const selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        };

        editor.setSelection(selection)

        editor.commands.insertText(" mundo");

        editor.undo();

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola");

        expect(editor.getSelection()).toBe(selection);
    });

    it("Redo restaura la selección anterior a insertar texto", () => {
        const editor = new Editor();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola",
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        editor.setDocument(document);

        const selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        };

        editor.setSelection(selection)

        editor.commands.insertText(" mundo");

        const selectionAfter = editor.getSelection();

        editor.undo();
        editor.redo();

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola mundo");

        expect(editor.getSelection()).toBe(selectionAfter);
    });
});