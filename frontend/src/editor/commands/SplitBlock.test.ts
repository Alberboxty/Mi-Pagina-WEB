import { describe, it, expect} from "vitest";

import { Editor } from "../core/Editor"
import { splitBlock } from "./SplitBlock"

describe("SplitBlock", () => {
    it("Requiere una selección", () => {
        const editor = new Editor();

        splitBlock(editor);

        expect(editor.getDocument().blocks).toHaveLength(0);
    });

    it("Crea un nuevo parrafo al final del bloque", () => {
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
                offset: 10
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        })

        splitBlock(editor);

        expect(editor.getDocument().blocks[1].children).toHaveLength(1);

        expect(editor.getDocument().blocks[1].children[0].text).toBe("");

        // expect(editor.getDocument().blocks[1].type).toBe("");

        expect(editor.getDocument().blocks[1].children[0].marks).toHaveLength(0);
    });

    it("Crea un nuevo parrafo al final del bloque y lo corta", () => {
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

        splitBlock(editor);

        expect(editor.getDocument().blocks).toHaveLength(2);

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola ");

        expect(editor.getDocument().blocks[1].children[0].text).toBe("mundo");

        // expect(editor.getDocument().blocks[1].type).toBe("");

        // expect(editor.getDocument().blocks[1].children[0].marks).toHaveLength(0);
    });

    it("Divide correctamente un bloque con varios Inline", () => {
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

        splitBlock(editor);

        expect(editor.getDocument().blocks).toHaveLength(2);

        //primer bloque
        expect(editor.getDocument().blocks[0].children).toHaveLength(2);

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola ");

        expect(editor.getDocument().blocks[0].children[1].text).toBe("mu");

        // Segundo bloque

        expect(editor.getDocument().blocks[1].children).toHaveLength(1);

        expect(editor.getDocument().blocks[1].children[0].text).toBe("ndo");

        // expect(editor.getDocument().blocks[1].type).toBe("");

        // expect(editor.getDocument().blocks[1].children[0].marks).toHaveLength(0);
    });

    it("Conserva las marks al dividir un Inline", () => {
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
                            marks: [
                                {
                                    type: "bold"
                                }
                            ]
                        },
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

        editor.commands.splitBlock();



        expect(editor.getDocument().blocks).toHaveLength(2);

        //primer bloque
        expect(editor.getDocument().blocks[0].children).toHaveLength(1);

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola ");

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([
            {
                type: "bold"
            }
        ]);

        // Segundo bloque

        expect(editor.getDocument().blocks[1].children).toHaveLength(1);

        expect(editor.getDocument().blocks[1].children[0].text).toBe("mundo");

        expect(editor.getDocument().blocks[1].children[0].marks).toEqual([
            {
                type: "bold"
            }
        ]);
    });

    it("Conserva las marks al dividir un Inline", () => {
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
                            marks: [
                                {
                                    type: "bold"
                                }
                            ]
                        },
                        {
                            text: "mundo",
                            marks: [
                                {
                                    type: "italic"
                                }
                            ]
                        },
                        {
                            text: " bonito",
                            marks: [
                                {
                                    type: "underline"
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

        editor.commands.splitBlock();

        expect(editor.getDocument().blocks).toHaveLength(2);

        //primer bloque
        expect(editor.getDocument().blocks[0].children).toHaveLength(2);

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola ");

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([
            {
                type: "bold"
            }
        ]);

        expect(editor.getDocument().blocks[0].children[1].text).toBe("mu");

        expect(editor.getDocument().blocks[0].children[1].marks).toEqual([
            {
                type: "italic"
            }
        ]);

        // Segundo bloque

        expect(editor.getDocument().blocks[1].children).toHaveLength(2);

        expect(editor.getDocument().blocks[1].children[0].text).toBe("ndo");

        expect(editor.getDocument().blocks[1].children[0].marks).toEqual([
            {
                type: "italic"
            }
        ]);

        expect(editor.getDocument().blocks[1].children[1].text).toBe(" bonito");

        expect(editor.getDocument().blocks[1].children[1].marks).toEqual([
            {
                type: "underline"
            }
        ]);
    });

});
