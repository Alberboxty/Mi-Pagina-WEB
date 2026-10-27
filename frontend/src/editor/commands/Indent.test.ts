import { describe, it, expect } from "vitest";
import { Editor } from "../core/Editor";
import { listsSchema } from "../schema/defaultSchema";

const item = (id: string, level: number) => ({
    id,
    type: "list-item",
    children: [{ text: "x", marks: [] }],
    attributes: { ordered: false, level }
});

const at = (blockId: string) => ({
    anchor: { blockId, inlineIndex: 0, offset: 0 },
    focus: { blockId, inlineIndex: 0, offset: 0 }
});

describe("Indent / Outdent", () => {
    it("indent sube el nivel", () => {
        const editor = new Editor({ version: 1, blocks: [item("a", 0)] }, listsSchema);
        editor.setSelection(at("a"));

        expect(editor.commands.indent()).toBe(true);
        expect(editor.getDocument().blocks[0].attributes?.level).toBe(1);
    });

    it("outdent baja el nivel pero no pasa de 0", () => {
        const editor = new Editor({ version: 1, blocks: [item("a", 0)] }, listsSchema);
        editor.setSelection(at("a"));

        expect(editor.commands.outdent()).toBe(false);
        expect(editor.canUndo()).toBe(false);
    });

    it("indent no pasa de 5", () => {
        const editor = new Editor({ version: 1, blocks: [item("a", 5)] }, listsSchema);
        editor.setSelection(at("a"));

        expect(editor.commands.indent()).toBe(false);
        expect(editor.getDocument().blocks[0].attributes?.level).toBe(5);
    });

    it("ignora los párrafos", () => {
        const editor = new Editor(
            {
                version: 1,
                blocks: [
                    { id: "p", type: "paragraph", children: [{ text: "x", marks: [] }], attributes: {} }
                ]
            },
            listsSchema
        );
        editor.setSelection(at("p"));

        expect(editor.commands.indent()).toBe(false);
    });

    it("se puede deshacer", () => {
        const editor = new Editor({ version: 1, blocks: [item("a", 1)] }, listsSchema);
        editor.setSelection(at("a"));

        editor.commands.indent();
        editor.undo();

        expect(editor.getDocument().blocks[0].attributes?.level).toBe(1);
    });
});