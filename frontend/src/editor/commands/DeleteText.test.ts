import { describe, it, expect} from "vitest";

import { Editor } from "../core/Editor"

import { deleteText } from "./DeleteText"

describe("DeleteText", () => {
    it("Requiere una selección", () => {
        const editor = new Editor();

        deleteText(editor, 1);

        expect(editor.getDocument().blocks).toHaveLength(0);
    });

    it("Elimina texto antes del cursor", () => {
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

        deleteText(editor, 1, "backward");

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Holamundo");
        expect(editor.getSelection()?.anchor.offset).toBe(4);
    });

    it("Elimina texto despues del cursor", () => {
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

        deleteText(editor, 1, "forward");

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola undo");
        expect(editor.getSelection()?.anchor.offset).toBe(5);
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

        deleteText(editor, 1, "forward");

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

    it("Elimina una selección de texto", () => {
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

        deleteText(editor, 1, "backward");

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola ");
        expect(editor.getSelection()?.anchor.offset).toBe(5);
        expect(editor.getSelection()?.focus.offset).toBe(5);
    });

    it("Elimina texto correctamente con varios Inline", () => {
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
                offset: 5
            },
            focus: {
                blockId: "1",
                inlineIndex: 1,
                offset: 5
            }
        })

        deleteText(editor, 2, "backward");

        const children = editor.getDocument().blocks[0].children;

        expect(children[0].text).toBe("Hola ");
        expect(children[1].text).toBe("mun");

        expect(editor.getSelection()?.anchor.inlineIndex).toBe(1);
        expect(editor.getSelection()?.anchor.offset).toBe(3);
    });

    it("Undo restaura la selección anterior al borrar texto", () => {
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

        editor.setSelection(selection);

        editor.commands.deleteText( 1, "backward");

        editor.undo();

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola mundo"); ;

        expect(editor.getSelection()).toBe(selection);
    });
    
    it("Redo restaura la selección posterior al borrar texto", () => {
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

        editor.setSelection(selection);

        editor.commands.deleteText( 1, "backward");

        const selectionAfter = editor.getSelection();

        editor.undo();
        editor.redo();

        expect(editor.getDocument().blocks[0].children[0].text).toBe("Hola mund"); ;

        expect(editor.getSelection()).toBe(selectionAfter);
    });

    it("Une el bloque siguiente al hacer delete al final del bloque", () => {
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

        editor.commands.deleteForward();

        expect(editor.getDocument().blocks).toHaveLength(1);

        expect(editor.getDocument().blocks[0].children).toHaveLength(2);

        expect(editor.getDocument().blocks[0].children[0].text)
            .toBe("Hola");

        expect(editor.getDocument().blocks[0].children[1].text)
            .toBe("mundo");

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

    it("Une bloques conservando todos los Inline y sus marks", () => {
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
                                    type: "bold" as const
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
                            text: "esto ",
                            marks: [
                                {
                                    type: "italic" as const
                                }
                            ]
                        },
                        {
                            text: "es",
                            marks: [
                                {
                                    type: "underline" as const
                                }
                            ]
                        },
                        {
                            text: " una prueba",
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
                offset: 5
            },
            focus: {
                blockId: "1",
                inlineIndex: 1,
                offset: 5
            }
        });

        editor.commands.deleteForward();

        const blocks = editor.getDocument().blocks;

        expect(blocks).toHaveLength(1);

        expect(blocks[0].children).toHaveLength(5);

        expect(blocks[0].children[0].text).toBe("Hola ");
        expect(blocks[0].children[0].marks).toEqual([]);

        expect(blocks[0].children[1].text).toBe("mundo");
        expect(blocks[0].children[1].marks).toEqual([
            {
                type: "bold"
            }
        ]);

        expect(blocks[0].children[2].text).toBe("esto ");
        expect(blocks[0].children[2].marks).toEqual([
            {
                type: "italic"
            }
        ]);

        expect(blocks[0].children[3].text).toBe("es");
        expect(blocks[0].children[3].marks).toEqual([
            {
                type: "underline"
            }
        ]);

        expect(blocks[0].children[4].text).toBe(" una prueba");
        expect(blocks[0].children[4].marks).toEqual([]);

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

    it("Elimina el Inline siguiente cuando borra su último caracter", () => {
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
                            text: "x",
                            marks: [
                                {
                                    type: "bold" as const
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
                offset: 4
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        });

        editor.commands.deleteForward();

        const children = editor.getDocument().blocks[0].children;

        expect(children).toHaveLength(1);

        expect(children[0].text).toBe("Hola");
        expect(children[0].marks).toEqual([]);

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

    it("Elimina texto hacia delante atravesando varios Inline", () => {
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
                            marks: [
                                {
                                    type: "bold" as const
                                }
                            ]
                        },
                        {
                            text: "!!!",
                            marks: [
                                {
                                    type: "italic" as const
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
                offset: 4
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        });

        editor.commands.deleteText(10, "forward");

        const children = editor.getDocument().blocks[0].children;

        expect(children).toHaveLength(1);

        expect(children[0].text).toBe("Hola");
        expect(children[0].marks).toEqual([]);

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

    it("Elimina texto hacia delante atravesando varios bloques", () => {
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
                            marks: [
                                {
                                    type: "bold" as const
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
                            marks: [
                                {
                                    type: "italic" as const
                                }
                            ]
                        },
                        {
                            text: "es",
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

        editor.commands.deleteText(11, "forward");

        const blocks = editor.getDocument().blocks;

        expect(blocks).toHaveLength(1);

        expect(blocks[0].children).toHaveLength(1);

        expect(blocks[0].children[0].text).toBe("Hola");
        expect(blocks[0].children[0].marks).toEqual([]);

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

    it("Elimina completamente un Inline hacia delante", () => {
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
                            marks: [
                                {
                                    type: "bold" as const
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
                offset: 4
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        });

        editor.commands.deleteText(5, "forward");

        const blocks = editor.getDocument().blocks;

        expect(blocks).toHaveLength(1);

        expect(blocks[0].children).toHaveLength(1);

        expect(blocks[0].children[0].text).toBe("Hola");
        expect(blocks[0].children[0].marks).toEqual([]);

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

    it("Elimina un bloque cuando se eliminan todos sus Inlines", () => {
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

        editor.commands.deleteText(5, "forward");

        const blocks = editor.getDocument().blocks;

        expect(blocks).toHaveLength(1);

        expect(blocks[0].id).toBe("1");

        expect(blocks[0].children).toHaveLength(2);

        expect(blocks[0].children[0].text).toBe("Hola");
        expect(blocks[0].children[1].text).toBe("mundo");
    });

    it("Elimina el Inline actual cuando todo su texto se borra hacia delante", () => {
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
                            marks: [
                                {
                                    type: "bold" as const
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
                offset: 0
            }
        });

        editor.commands.deleteText(4, "forward");

        const blocks = editor.getDocument().blocks;

        expect(blocks).toHaveLength(1);

        expect(blocks[0].children).toHaveLength(1);

        expect(blocks[0].children[0].text).toBe("mundo");

        expect(blocks[0].children[0].marks).toEqual([
            {
                type: "bold"
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
});