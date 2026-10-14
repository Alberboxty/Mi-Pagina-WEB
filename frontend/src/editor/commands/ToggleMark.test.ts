import { describe, it, expect} from "vitest";

import { Editor } from "../core/Editor"

import { toggleMark } from "./ToggleMark";

describe("ToggleMark", () => {
    it("Requiere una selección", () => {
        const editor = new Editor();

        toggleMark(editor, "bold");

        expect(editor.getDocument().blocks).toHaveLength(0);
    });

    it("Activa una marca en el Inline", () => {
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
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        })

        toggleMark(editor, "bold");

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([
            {
                type: "bold"
            }
        ]);
    });

    it("Desactiva una marca existente", () => {
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
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        })

        toggleMark(editor, "bold");

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([]);
    });

    it("Conserva otras marcas", () => {
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
                                    type: "italic"
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
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        })

        toggleMark(editor, "bold");

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([
            {
                type: "italic"
            },
            {
                type: "bold"
            }
        ]);
    });

    it("Activa una marca en una parte del inline", () => {
        const editor = new Editor();

        editor.setDocument({
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
        });

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 5
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        })

        toggleMark(editor, "bold");

        const children = editor.getDocument().blocks[0].children;

        expect(children).toHaveLength(2);

        expect(children[0]).toEqual(
            {   
                text: "Hola ",
                marks: []
            }
        );

        expect(children[1]).toEqual(
            {   
                text: "mundo",
                marks: [
                    {
                        type: "bold"
                    }
                ]
                
            }
        );
    });

    it("Activa una marca en una parte intermedia del inline", () => {
        const editor = new Editor();

        editor.setDocument({
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
        });

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 2
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 7
            }
        })

        toggleMark(editor, "bold");

        const children = editor.getDocument().blocks[0].children;

        expect(children).toHaveLength(3);

        expect(children[0]).toEqual(
            {   
                text: "Ho",
                marks: []
            }
        );

        expect(children[1]).toEqual(
            {   
                text: "la mu",
                marks: [
                    {
                        type: "bold"
                    }
                ]
                
            }
        );

        expect(children[2]).toEqual(
            {   
                text: "ndo",
                marks: []
            }
        );
    });

    it("Conserva las marcas existentes al activar otra marca", () => {
        const editor = new Editor();

        editor.setDocument({
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
                                    type: "italic"
                                }
                            ]
                        }
                    ],
                    attributes: {}
                }
            ]
        });

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 5
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        })

        toggleMark(editor, "bold");

        const children = editor.getDocument().blocks[0].children;

        expect(children).toHaveLength(2);

        expect(children[0]).toEqual(
            {   
                text: "Hola ",
                marks: [
                    {
                        type: "italic"
                    }
                ]
            }
        );

        expect(children[1]).toEqual(
            {   
                text: "mundo",
                marks: [
                    {
                        type: "italic"
                    },
                    {
                        type: "bold"
                    }
                ]
                
            }
        );
    });

    it("Desactiva una marca en una parte intermedia del inline", () => {
        const editor = new Editor();

        editor.setDocument({
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
                        }
                    ],
                    attributes: {}
                }
            ]
        });

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 2
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 7
            }
        })

        toggleMark(editor, "bold");

        const children = editor.getDocument().blocks[0].children;

        expect(children).toHaveLength(3);

        expect(children[0]).toEqual(
            {   
                text: "Ho",
                marks: [
                    {
                        type: "bold"
                    }
                ]
            }
        );

        expect(children[1]).toEqual(
            {   
                text: "la mu",
                marks: []
                
            }
        );

        expect(children[2]).toEqual(
            {   
                text: "ndo",
                marks: [
                    {
                        type: "bold"
                    }
                ]
            }
        );
    });

    it("Undo restaura las marcas anteriores", () => {
        const editor = new Editor();

        editor.setDocument({
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
        });

        const selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        };

        editor.setSelection(selection);

        toggleMark(editor, "bold");

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola");

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([
            {
                type: "bold"
            }   
        ]);

        editor.undo();

        expect(editor.getDocument().blocks[0].children).toHaveLength(1);
        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola mundo");

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([]);

        expect(editor.getSelection()).toBe(selection);
    });

    it("Redo restaura las marcas anteriores", () => {
        const editor = new Editor();

        editor.setDocument({
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
        });

        const selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        };

        editor.setSelection(selection);

        toggleMark(editor, "bold");

        const documentAfter = editor.getDocument();
        const selectionAfter = editor.getSelection();

        editor.undo();
        editor.redo();

        expect(editor.getDocument()).toBe(documentAfter);

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola");

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([
            {
                type: "bold"
            }   
        ]);

        expect(editor.getDocument().blocks[0].children[1].text).toBe(" mundo");

        expect(editor.getSelection()).toBe(selectionAfter);
    });

    it("Activa una marca en una selección que atraviesa varios Inlines", () => {
        const editor = new Editor();

        editor.setDocument({
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph",
                    children: [
                        {
                            text: "Hola ",
                            marks: [{ type: "italic" }]
                        },
                        {
                            text: "mundo",
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        });

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 2
            },
            focus: {
                blockId: "1",
                inlineIndex: 1,
                offset: 3
            }
        });

        toggleMark(editor, "bold");

        expect(editor.getDocument().blocks[0].children).toEqual([
            {
                text: "Ho",
                marks: [{ type: "italic" }]
            },
            {
                text: "la ",
                marks: [
                    { type: "italic" },
                    { type: "bold" }
                ]
            },
            {
                text: "mun",
                marks: [{ type: "bold" }]
            },
            {
                text: "do",
                marks: []
            }
        ]);
    });

    it("Desactiva una marca en una selección que atraviesa varios Inlines", () => {
        const editor = new Editor();

        editor.setDocument({
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph",
                    children: [
                        {
                            text: "Hola ",
                            marks: [{ type: "bold" }]
                        },
                        {
                            text: "mundo",
                            marks: [
                                { type: "bold" },
                                { type: "italic" }
                            ]
                        }
                    ],
                    attributes: {}
                }
            ]
        });

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 2
            },
            focus: {
                blockId: "1",
                inlineIndex: 1,
                offset: 3
            }
        });

        toggleMark(editor, "bold");

        expect(editor.getDocument().blocks[0].children).toEqual([
            {
                text: "Ho",
                marks: [{ type: "bold" }]
            },
            {
                text: "la ",
                marks: []
            },
            {
                text: "mun",
                marks: [{ type: "italic" }]
            },
            {
                text: "do",
                marks: [
                    { type: "bold" },
                    { type: "italic" }
                ]
            }
        ]);
    });

    it("Activa una marca en una selección inversa entre varios Inlines", () => {
        const editor = new Editor();

        editor.setDocument({
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph",
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
        });

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 1,
                offset: 3
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 2
            }
        });

        toggleMark(editor, "bold");

        expect(editor.getDocument().blocks[0].children).toEqual([
            {
                text: "Ho",
                marks: []
            },
            {
                text: "la ",
                marks: [{ type: "bold" }]
            },
            {
                text: "mun",
                marks: [{ type: "bold" }]
            },
            {
                text: "do",
                marks: []
            }
        ]);
    });

    it("Aplica una marca a toda la selección cuando los formatos son mixtos", () => {
        const editor = new Editor();

        editor.setDocument({
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph",
                    children: [
                        {
                            text: "Hola ",
                            marks: [{ type: "bold" }]
                        },
                        {
                            text: "mundo",
                            marks: [{ type: "italic" }]
                        }
                    ],
                    attributes: {}
                }
            ]
        });

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 2
            },
            focus: {
                blockId: "1",
                inlineIndex: 1,
                offset: 3
            }
        });

        toggleMark(editor, "bold");

        expect(editor.getDocument().blocks[0].children).toEqual([
            {
                text: "Ho",
                marks: [{ type: "bold" }]
            },
            {
                text: "la ",
                marks: [{ type: "bold" }]
            },
            {
                text: "mun",
                marks: [
                    { type: "italic" },
                    { type: "bold" }
                ]
            },
            {
                text: "do",
                marks: [{ type: "italic" }]
            }
        ]);
    });

    it("Activa una marca en una selección que atraviesa varios bloques", () => {
        const editor = new Editor();

        editor.setDocument({
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph",
                    children: [
                        {
                            text: "Hola mundo",
                            marks: []
                        }
                    ],
                    attributes: {}
                },
                {
                    id: "2",
                    type: "paragraph",
                    children: [
                        {
                            text: "Buenos días",
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        });

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 2
            },
            focus: {
                blockId: "2",
                inlineIndex: 0,
                offset: 5
            }
        });

        toggleMark(editor, "bold");

        expect(editor.getDocument().blocks).toEqual([
            {
                id: "1",
                type: "paragraph",
                children: [
                    {
                        text: "Ho",
                        marks: []
                    },
                    {
                        text: "la mundo",
                        marks: [{ type: "bold" }]
                    }
                ],
                attributes: {}
            },
            {
                id: "2",
                type: "paragraph",
                children: [
                    {
                        text: "Bueno",
                        marks: [{ type: "bold" }]
                    },
                    {
                        text: "s días",
                        marks: []
                    }
                ],
                attributes: {}
            }
        ]);
    });

    it("Conserva la selección después de dividir un Inline", () => {
        const editor = new Editor({
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph",
                    children: [
                        {
                            text: "Hola mundo",
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        });

        const selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        };

        editor.setSelection(selection);

        toggleMark(editor, "bold");

        expect(editor.getSelection()).toEqual({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        });
    });

    it("Restaura la selección al deshacer y rehacer una marca", () => {
        const editor = new Editor({
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph",
                    children: [
                        {
                            text: "Hola mundo",
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        });

        const selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        };

        editor.setSelection(selection);

        toggleMark(editor, "bold");

        const selectionAfterMark = editor.getSelection();

        editor.undo();

        expect(editor.getSelection()).toEqual(selection);

        editor.redo();

        expect(editor.getSelection()).toEqual(selectionAfterMark);
    });
});