import { describe, it, expect} from "vitest";

import { Editor } from "../core/Editor"

import { deleteForward } from "./Delete";
import { deleteText } from "./DeleteText";



describe("Delete", () => {
    it("Requiere una selección", () => {
        const editor = new Editor();

        deleteForward(editor);

        expect(editor.getDocument().blocks).toHaveLength(0);
    });

    it("Elimina el caracter anterior al cursor", () => {
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

        editor.commands.deleteText(1, "backward");

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Holamundo");
        expect(editor.getSelection()?.anchor.offset).toBe(4);
    });

    it("Elimina el caracter posterior al cursor", () => {
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
                offset: 9
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 9
            }
        })

        deleteForward(editor);

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola mund");
        expect(editor.getSelection()).toEqual({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 9
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 9
            }
        });
    });

    it("Elimina una selección", () => {
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
                offset: 4
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        })

        deleteForward(editor);

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola");
        expect(editor.getSelection()?.anchor.offset).toBe(4);
        expect(editor.getSelection()?.focus.offset).toBe(4);
    });

    it("Undo restaura la seleccion anterior al hacer delete", () => {
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

        const selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 9
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 9
            }
        }

        editor.setSelection(selection)

        editor.commands.deleteForward();

        editor.undo();

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola mundo");

        expect(editor.getSelection()).toBe(selection);
    });

    it("Redo restaura la seleccion posterior al hacer delete", () => {
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

        const selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 9
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 9
            }
        }

        editor.setSelection(selection)

        editor.commands.deleteForward();

        const selectionAfter = editor.getSelection();

        editor.undo();
        editor.redo();

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola mund");

        expect(editor.getSelection()).toBe(selectionAfter);
    });
    
    it("Elimina el primer caracter del Inline siguiente", () => {
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
                inlineIndex: 0,
                offset: 4
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        });

        deleteForward(editor);

        expect(editor.getDocument().blocks[0].children[0].text)
            .toBe("Hola");

        expect(editor.getDocument().blocks[0].children[1].text)
            .toBe("undo");

        expect(editor.getSelection()).toEqual({
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
        });
    });
});