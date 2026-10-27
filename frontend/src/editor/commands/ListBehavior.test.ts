import { describe, it, expect } from "vitest";
import { Editor } from "../core/Editor";
import { listsSchema } from "../schema/defaultSchema";

const item = (id: string, text: string) => ({
    id,
    type: "list-item",
    children: [{ text, marks: [] }],
    attributes: { ordered: false, level: 0 }
});

const at = (blockId: string, offset: number) => ({
    anchor: { blockId, inlineIndex: 0, offset },
    focus: { blockId, inlineIndex: 0, offset }
});

describe("Comportamiento de listas", () => {
    it("Enter en un ítem con texto crea otro ítem", () => {
        const editor = new Editor(
            { version: 1, blocks: [item("a", "uno")] },
            listsSchema
        );
        editor.setSelection(at("a", 3));

        editor.commands.splitBlock();

        const types = editor.getDocument().blocks.map(b => b.type);
        expect(types).toEqual(["list-item", "list-item"]);
    });

    it("Enter en un ítem vacío lo convierte en párrafo", () => {
        const editor = new Editor(
            { version: 1, blocks: [item("a", "uno"), item("b", "")] },
            listsSchema
        );
        editor.setSelection(at("b", 0));

        editor.commands.splitBlock();

        const types = editor.getDocument().blocks.map(b => b.type);
        expect(types).toEqual(["list-item", "paragraph"]);
    });

    it("Backspace al inicio de un ítem lo convierte en párrafo", () => {
        const editor = new Editor(
            { version: 1, blocks: [item("a", "uno"), item("b", "dos")] },
            listsSchema
        );
        editor.setSelection(at("b", 0));

        editor.commands.backspace();

        const blocks = editor.getDocument().blocks;
        expect(blocks).toHaveLength(2);
        expect(blocks[1].type).toBe("paragraph");
        expect(blocks[1].children[0].text).toBe("dos");
    });

    it("se puede deshacer la salida de la lista", () => {
        const editor = new Editor(
            { version: 1, blocks: [item("a", "")] },
            listsSchema
        );
        editor.setSelection(at("a", 0));

        editor.commands.splitBlock();
        editor.undo();

        expect(editor.getDocument().blocks[0].type).toBe("list-item");
    });
});