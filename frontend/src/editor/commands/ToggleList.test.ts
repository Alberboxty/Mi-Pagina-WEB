import { describe, it, expect } from "vitest";
import { Editor } from "../core/Editor";
import { listsSchema } from "../schema/defaultSchema";

const para = (id: string, text: string) => ({
    id,
    type: "paragraph",
    children: [{ text, marks: [] }],
    attributes: {}
});

const pos = (blockId: string) => ({ blockId, inlineIndex: 0, offset: 0 });

function setup(blocks: any[], from: string, to: string) {
    const editor = new Editor({ version: 1, blocks }, listsSchema);
    editor.setSelection({ anchor: pos(from), focus: pos(to) });
    return editor;
}

describe("ToggleList", () => {
    it("convierte un párrafo en ítem de lista", () => {
        const editor = setup([para("a", "uno")], "a", "a");

        editor.commands.bulletList();

        expect(editor.getDocument().blocks[0]).toMatchObject({
            type: "list-item",
            attributes: { ordered: false, level: 0 }
        });
    });

    it("convierte varios bloques seleccionados", () => {
        const editor = setup(
            [para("a", "uno"), para("b", "dos"), para("c", "tres")],
            "a",
            "b"
        );

        editor.commands.orderedList();

        const types = editor.getDocument().blocks.map(b => b.type);
        expect(types).toEqual(["list-item", "list-item", "paragraph"]);
    });

    it("al repetirlo vuelve a párrafo", () => {
        const editor = setup([para("a", "uno")], "a", "a");

        editor.commands.bulletList();
        editor.commands.bulletList();

        expect(editor.getDocument().blocks[0]).toMatchObject({
            type: "paragraph",
            attributes: {}
        });
    });

    it("cambia de viñetas a numerada", () => {
        const editor = setup([para("a", "uno")], "a", "a");

        editor.commands.bulletList();
        editor.commands.orderedList();

        expect(editor.getDocument().blocks[0].attributes).toEqual({
            ordered: true,
            level: 0
        });
    });

    it("se puede deshacer", () => {
        const editor = setup([para("a", "uno")], "a", "a");

        editor.commands.bulletList();
        editor.undo();

        expect(editor.getDocument().blocks[0].type).toBe("paragraph");
    });

    it("no hace nada si el esquema no tiene listas", () => {
        const editor = new Editor({ version: 1, blocks: [para("a", "uno")] });
        editor.setSelection({ anchor: pos("a"), focus: pos("a") });

        editor.commands.bulletList();

        expect(editor.getDocument().blocks[0].type).toBe("paragraph");
    });
});