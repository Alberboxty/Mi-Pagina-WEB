import { describe, it, expect} from "vitest";
import { Editor } from "./Editor";

describe("Editor", () => {
    it("Crea un documento vacio", () => {
        const editor = new Editor();

        expect(editor.getDocument()).toEqual({
            version: 1,
            blocks: []
        });
    });

    it("Empieza sin selección", () => {
        const editor = new Editor();

        expect(editor.getSelection()).toBeNull();
    });

    it("Empieza sin foco", () => {
        const editor = new Editor();

        expect(editor.isFocused()).toBe(false);
    });

    it("Empieza en modo editable", () => {
        const editor = new Editor();

        expect(editor.isReadOnly()).toBe(false);
    });

    it("Puede hacer undo", () => {
        const editor = new Editor();

        editor.setDocument({
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph",
                    children: [],
                    attributes: {}
                }
            ]
        })

        expect(editor.getDocument().blocks).toHaveLength(1);

        editor.undo();

        expect(editor.getDocument().blocks).toHaveLength(0);

    });

    it("Puede hacer redo", () => {
        const editor = new Editor();

        const document = {
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

        editor.setDocument(document);

        expect(editor.getDocument().blocks).toHaveLength(1);

        editor.undo();

        expect(editor.getDocument().blocks).toHaveLength(0);
        
        editor.redo();

        expect(editor.getDocument().blocks).toHaveLength(1);

    });

    it("Un cambio nuevo elimina el redo", () => {
        const editor = new Editor();

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

        editor.setDocument(documentB);
        editor.setDocument(documentC);

        editor.undo();

        expect(editor.canRedo()).toBe(true);

        editor.redo();

        expect(editor.canRedo()).toBe(false);

    });

    it("Expone los comandos del editor", () => {
        const editor = new Editor();

        expect(editor.commands).toBeDefined();
        expect(editor.commands.bold).toBeTypeOf("function");
        expect(editor.commands.italic).toBeTypeOf("function");
        expect(editor.commands.underline).toBeTypeOf("function");
        expect(editor.commands.strikethrough).toBeTypeOf("function");
    });

    it("Puede ejecutar bold desde los comandos del editor", () => {
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
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        });

        editor.commands.bold();

        const children = editor.getDocument().blocks[0].children;

        expect(children).toHaveLength(1);

        expect(children[0]).toEqual(
            {   
                text: "Hola mundo",
                marks: [
                    {
                        type: "bold"
                    }
                ]
            }
        );
    });

    it("Puede ejecutar italic desde los comandos del editor", () => {
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
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        });

        editor.commands.italic();

        const children = editor.getDocument().blocks[0].children;

        expect(children).toHaveLength(1);

        expect(children[0]).toEqual(
            {   
                text: "Hola mundo",
                marks: [
                    {
                        type: "italic"
                    }
                ]
            }
        );
    });

    it("Puede ejecutar underline desde los comandos del editor", () => {
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
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        });

        editor.commands.underline();

        const children = editor.getDocument().blocks[0].children;

        expect(children).toHaveLength(1);

        expect(children[0]).toEqual(
            {   
                text: "Hola mundo",
                marks: [
                    {
                        type: "underline"
                    }
                ]
            }
        );
    });

    it("Puede ejecutar strikethrough desde los comandos del editor", () => {
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
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        });

        editor.commands.strikethrough();

        const children = editor.getDocument().blocks[0].children;

        expect(children).toHaveLength(1);

        expect(children[0]).toEqual(
            {   
                text: "Hola mundo",
                marks: [
                    {
                        type: "strikethrough"
                    }
                ]
            }
        );
    });

    it("Ejecuta splitBlock desde los comandos del editor", () => {
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
                    offset: 5
                }
            });
    
            editor.commands.splitBlock();
    
            expect(editor.getDocument().blocks).toHaveLength(2);
    
            expect(editor.getDocument().blocks[0].children[0]).toEqual(
                {   
                    text: "Hola ",
                    marks: []
                }
            );
            expect(editor.getDocument().blocks[1].children[0]).toEqual(
                {   
                    text: "mundo",
                    marks: []
                }
            );
    });

    it("Ejecuta insertText desde los comandos del editor", () => {
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
                    offset: 5
                }
            });
    
            editor.commands.insertText("bonito ");
    
            expect(editor.getDocument().blocks[0].children[0]).toEqual(
                {   
                    text: "Hola bonito mundo",
                    marks: []
                }
            );
    });

    it("Ejecuta deleteText desde los comandos del editor", () => {
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
                    offset: 5
                }
            });
    
            editor.commands.deleteText(2, "backward");
    
            expect(editor.getDocument().blocks[0].children[0]).toEqual(
                {   
                    text: "Holmundo",
                    marks: []
                }
            );
    });

    it("Ejecuta backspace desde los comandos del editor", () => {
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
                offset: 4
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        });

        editor.commands.backspace();

        expect(editor.getDocument().blocks[0].children[0]).toEqual(
            {   
                text: "Hol mundo",
                marks: []
            }
        );
    });

    it("Ejecuta deleteForward desde los comandos del editor", () => {
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
                offset: 4
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        });

        editor.commands.deleteForward();

        expect(editor.getDocument().blocks[0].children[0]).toEqual(
            {   
                text: "Holamundo",
                marks: []
            }
        );
    });

    it("Puede hacer undo y redo de un comando", () => {
        const editor = new Editor();

        editor.setDocument({
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "",
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
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            }
        });

        editor.commands.insertText("hola");

        expect(editor.getDocument().blocks[0].children[0].text).toBe("hola");

        editor.undo();

        expect(editor.getDocument().blocks[0].children[0].text).toBe("");

        editor.redo();

        expect(editor.getDocument().blocks[0].children[0].text).toBe("hola");
    });

    it("Puede hacer undo y redo de un bold", () => {
        const editor = new Editor();

        editor.setDocument({
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
        });

        editor.setSelection({
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

        editor.commands.bold();

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([
            {
                type: "bold"
            }
        ]);

        editor.undo();

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([]);

        editor.redo();

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([
            {
                type: "bold"
            }
        ]);
    });

    it("Puede hacer undo y redo de un bold parcial", () => {
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
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        });

        editor.commands.bold();

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
                text: " mundo",
                marks: []
            }
        ]);


        editor.undo();

        expect(editor.getDocument().blocks[0].children).toEqual([
            {
                text: "Hola mundo",
                marks: []
            }
        ]);

        editor.redo();

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
                text: " mundo",
                marks: []
            }
        ]);
    });

    it("Puede hacer undo y redo de italic, underline, strikethrough", () => {
        const marks = ["italic", "underline", "strikethrough"]

        for (const mark of marks) {
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
                    offset: 0
                },
                focus: {
                    blockId: "1",
                    inlineIndex: 0,
                    offset: 4
                }
            });

            if (mark === "italic") {
                editor.commands.italic();
            }

            if (mark === "underline") {
                editor.commands.underline();
            }

            if (mark === "strikethrough") {
                editor.commands.strikethrough();
            }

            expect(editor.getDocument().blocks[0].children[0].marks).toEqual([
                {
                    type: mark
                }
            ]);

            editor.undo();

            expect(editor.getDocument().blocks[0].children[0].marks).toEqual([]);

            editor.redo();

            expect(editor.getDocument().blocks[0].children[0].marks).toEqual([
                {
                    type: mark
                }
            ]);
        }
    });

    it("Renderiza el documento como HTML", () => {
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

        const html = editor.render();

        expect(html).toBe('<p data-block-id="1">Hola mundo</p>');
    });
});
