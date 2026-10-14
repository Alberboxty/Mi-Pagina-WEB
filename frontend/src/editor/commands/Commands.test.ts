import { describe, it, expect} from "vitest";

import { Editor } from "../core/Editor"

import { Commands } from "./Commands";

describe("Commands", () => {
    it("Ejecuta bold sobre el editor", () => {
        const editor = new Editor();
        const commands = new Commands(editor);

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

        commands.bold();

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

    it("Ejecuta splitBlock sobre el editor", () => {
        const editor = new Editor();
        const commands = new Commands(editor);

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

        commands.splitBlock();

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

    it("Ejecuta insertText sobre el editor", () => {
        const editor = new Editor();
        const commands = new Commands(editor);

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

        commands.insertText("bonito ");

        expect(editor.getDocument().blocks[0].children[0]).toEqual(
            {   
                text: "Hola bonito mundo",
                marks: []
            }
        );
    });

    it("Ejecuta deleteText sobre el editor", () => {
        const editor = new Editor();
        const commands = new Commands(editor);

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

        commands.deleteText(2, "backward");

        expect(editor.getDocument().blocks[0].children[0]).toEqual(
            {   
                text: "Holmundo",
                marks: []
            }
        );
    });

    it("Ejecuta backspace sobre el editor", () => {
        const editor = new Editor();
        const commands = new Commands(editor);

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

        commands.backspace();

        expect(editor.getDocument().blocks[0].children[0]).toEqual(
            {   
                text: "Hol mundo",
                marks: []
            }
        );
    });

    it("Ejecuta deleteForward sobre el editor", () => {
        const editor = new Editor();
        const commands = new Commands(editor);

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

        commands.deleteForward();

        expect(editor.getDocument().blocks[0].children[0]).toEqual(
            {   
                text: "Holamundo",
                marks: []
            }
        );
    });
});