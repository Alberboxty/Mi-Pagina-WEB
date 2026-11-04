import { describe, it, expect } from "vitest";
import { Editor } from "../core/Editor";
import { richSchema, listsSchema } from "../schema/defaultSchema";

const para = (children: any[]) => ({
    id: "a",
    type: "paragraph",
    children,
    attributes: {}
});

const sel = (from: number, to: number, inlineA = 0, inlineB = 0) => ({
    anchor: { blockId: "a", inlineIndex: inlineA, offset: from },
    focus: { blockId: "a", inlineIndex: inlineB, offset: to }
});

const make = (children: any[], schema = richSchema) =>
    new Editor({ version: 1, blocks: [para(children)] }, schema);

describe("setLink / removeLink", () => {
    it("aplica un enlace a una parte del texto", () => {
        const editor = make([{ text: "hola mundo", marks: [] }]);
        editor.setSelection(sel(5, 10));

        expect(editor.commands.setLink("https://example.com")).toBe(true);

        const children = editor.getDocument().blocks[0].children;
        expect(children.map(c => c.text)).toEqual(["hola ", "mundo"]);
        expect(children[1].marks).toEqual([
            { type: "link", attributes: { href: "https://example.com/" } }
        ]);
        expect(children[0].marks).toEqual([]);
    });

    it("conserva otras marcas del texto", () => {
        const editor = make([{ text: "hola", marks: [{ type: "bold" }] }]);
        editor.setSelection(sel(0, 4));

        editor.commands.setLink("https://example.com");

        const types = editor.getDocument().blocks[0].children[0].marks.map(m => m.type);
        expect(types).toEqual(["bold", "link"]);
    });

    it("funciona con una selección que abarca varios inlines", () => {
        const editor = make([
            { text: "uno", marks: [] },
            { text: "dos", marks: [{ type: "bold" }] }
        ]);
        editor.setSelection(sel(1, 2, 0, 1));

        editor.commands.setLink("https://example.com");

        const children = editor.getDocument().blocks[0].children;
        expect(children.map(c => c.text)).toEqual(["u", "no", "do", "s"]);
        expect(children[1].marks.some(m => m.type === "link")).toBe(true);
        expect(children[2].marks.some(m => m.type === "link")).toBe(true);
        expect(children[3].marks.some(m => m.type === "link")).toBe(false);
    });

    it("sustituye un enlace existente en lugar de apilar otro", () => {
        const editor = make([
            { text: "hola", marks: [{ type: "link", attributes: { href: "https://a.com/" } }] }
        ]);
        editor.setSelection(sel(0, 4));

        editor.commands.setLink("https://b.com");

        const marks = editor.getDocument().blocks[0].children[0].marks;
        expect(marks).toEqual([
            { type: "link", attributes: { href: "https://b.com/" } }
        ]);
    });

    it("rechaza URLs peligrosas sin tocar el documento ni el historial", () => {
        const editor = make([{ text: "hola", marks: [] }]);
        editor.setSelection(sel(0, 4));

        for (const url of ["javascript:alert(1)", "data:text/html,x", "/relativa", ""]) {
            expect(editor.commands.setLink(url)).toBe(false);
        }

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([]);
        expect(editor.canUndo()).toBe(false);
    });

    it("no hace nada con la selección contraída", () => {
        const editor = make([{ text: "hola", marks: [] }]);
        editor.setSelection(sel(2, 2));

        expect(editor.commands.setLink("https://example.com")).toBe(false);
        expect(editor.canUndo()).toBe(false);
    });

    it("usa la selección guardada si se pasa explícitamente", () => {
        const editor = make([{ text: "hola mundo", marks: [] }]);
        editor.setSelection(sel(0, 0)); // el DOM "perdió" la selección

        expect(editor.commands.setLink("https://example.com", sel(0, 4))).toBe(true);
        expect(editor.getDocument().blocks[0].children[0].text).toBe("hola");
    });

    it("no hace nada si el esquema no incluye link", () => {
        const editor = make([{ text: "hola", marks: [] }], listsSchema);
        editor.setSelection(sel(0, 4));

        expect(editor.commands.setLink("https://example.com")).toBe(false);
    });

    it("removeLink quita el enlace y conserva las demás marcas", () => {
        const editor = make([
            {
                text: "hola",
                marks: [{ type: "bold" }, { type: "link", attributes: { href: "https://a.com/" } }]
            }
        ]);
        editor.setSelection(sel(0, 4));

        expect(editor.commands.removeLink()).toBe(true);

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([{ type: "bold" }]);
    });

    it("removeLink devuelve false si no había enlace", () => {
        const editor = make([{ text: "hola", marks: [] }]);
        editor.setSelection(sel(0, 4));

        expect(editor.commands.removeLink()).toBe(false);
    });

    it("se puede deshacer", () => {
        const editor = make([{ text: "hola", marks: [] }]);
        editor.setSelection(sel(0, 4));

        editor.commands.setLink("https://example.com");
        editor.undo();

        expect(editor.getDocument().blocks[0].children[0].marks).toEqual([]);
    });

    it("el resultado pasa la validación del documento", () => {
        const editor = make([{ text: "hola", marks: [] }]);
        editor.setSelection(sel(0, 4));
        editor.commands.setLink("https://example.com");

        expect(() => editor.toJSON()).not.toThrow();
    });
});