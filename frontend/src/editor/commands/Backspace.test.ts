import { describe, it, expect} from "vitest";

import { Editor } from "../core/Editor"

import { backspace } from "./Backspace";

describe("Backspace", () => {
    it("Requiere una selección", () => {
        const editor = new Editor();

        backspace(editor);

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

        backspace(editor);

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Holamundo");
        expect(editor.getSelection()?.anchor.offset).toBe(4);
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
                offset: 5
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        })

        backspace(editor);

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola ");
        expect(editor.getSelection()?.anchor.offset).toBe(5);
        expect(editor.getSelection()?.focus.offset).toBe(5);
    });

    it("Undo restaura la selección anterior al hacer backspace", () => {
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
                offset: 10
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        }

        editor.setSelection(selection)

        editor.commands.backspace();

        editor.undo();

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola mundo");
        expect(editor.getSelection()).toBe(selection);
    });

    it("Redo restaura la selección anterior al hacer backspace", () => {
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
                offset: 10
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        }

        editor.setSelection(selection)

        editor.commands.backspace();

        const selectionAfter = editor.getSelection(); 

        editor.undo();
        editor.redo();

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola mund");
        expect(editor.getSelection()).toBe(selectionAfter);
    });

    it("Debe unir el bloque actual con el anterior al hacer backspace al principio", () => {
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
                },
                {
                    id: "2",
                    type: "paragraph" as const,
                    children: [
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

        const selection = {
            anchor: {
                blockId: "2",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "2",
                inlineIndex: 0,
                offset: 0
            }
        }

        editor.setSelection(selection)

        editor.commands.backspace();

        expect(editor.getDocument().blocks).toHaveLength(1);

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola");
        expect(editor.getDocument().blocks[0].children[1].text).toBe("mundo");
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

    it("Elimina el caracter anterior al principio de un Inline", () => {
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
                inlineIndex: 1,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 1,
                offset: 0
            }
        }

        editor.setSelection(selection)

        editor.commands.backspace();

        expect(editor.getDocument().blocks[0].children).toHaveLength(2);

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola");
        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([
            {
                type: "bold"
            }
        ]);


        expect(editor.getDocument().blocks[0].children[1].text).toBe("mundo");
        expect(editor.getDocument().blocks[0].children[1].marks).toEqual([
            {
                type: "italic"
            }
        ]);


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

    it("Elimina el Inline vacio al borrar su último caracter", () => {
        const editor = new Editor();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "A",
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
                inlineIndex: 1,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 1,
                offset: 0
            }
        }

        editor.setSelection(selection)

        editor.commands.backspace();

        expect(editor.getDocument().blocks[0].children).toHaveLength(1);

        expect(editor.getDocument().blocks[0].children[0].text).toBe("mundo");
        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([
            {
                type: "italic"
            }
        ]);


        expect(editor.getSelection()).toEqual({
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
        });
    });

    it("Une el bloque anterior cuando el primer Inline actual está vacío", () => {
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
                },
                {
                    id: "2",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "",
                            marks: []
                        },
                        {
                            text: "mundo",
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

        const selection = {
            anchor: {
                blockId: "2",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "2",
                inlineIndex: 0,
                offset: 0
            }
        }

        editor.setSelection(selection)

        editor.commands.backspace();

        expect(editor.getDocument().blocks).toHaveLength(1);

        expect(editor.getDocument().blocks[0].children).toHaveLength(2);

        
        expect(editor.getDocument().blocks[0].children).toEqual([
            {
                text: "Hola",
                marks: []
            },
            {
                text: "mundo",
                marks: [
                    {
                        type: "italic"
                    }
                ]
            }
            
        ]);


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

    it("Une bloques conservando todos los Inline del bloque anterior", () => {
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
                        }
                    ],
                    attributes: {}
                },
                {
                    id: "2",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "esto",
                            marks: []
                        },
                        {
                            text: " es",
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

        const selection = {
            anchor: {
                blockId: "2",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "2",
                inlineIndex: 0,
                offset: 0
            }
        }

        editor.setSelection(selection)

        editor.commands.backspace();

        expect(editor.getDocument().blocks).toHaveLength(1);

        expect(editor.getDocument().blocks[0].children).toEqual([
            {
                text: "Hola",
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
                text: "esto",
                marks: []
            },
            {
                text: " es",
                marks: [
                    {
                        type: "underline"
                    }
                ]
            }
            
        ]);

        expect(editor.getSelection()).toEqual({
            anchor: {
                blockId: "1",
                inlineIndex: 1,
                offset: 5
            },
            focus: {
                blockId: "1",
                inlineIndex: 1,
                offset: 5
            }
        });
    });

    it("Elimina el último caracter del inline anterior conservando sus marcas y los demás Inlines", () => {
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
                            text: "!",
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

        const selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 1,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 1,
                offset: 0
            }
        }

        editor.setSelection(selection)

        editor.commands.backspace();

        expect(editor.getDocument().blocks[0].children).toEqual([
            {
                text: "Hol",
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
                text: "!",
                marks: [
                    {
                        type: "underline"
                    }
                ]
            }
        ]);

        expect(editor.getSelection()).toEqual({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 3
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 3
            }
        });
    });
});