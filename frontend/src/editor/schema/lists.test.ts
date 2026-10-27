import { describe, it, expect } from "vitest";
import { HtmlRenderer } from "../renderer/HtmlRenderer";
import { validateDocument } from "../model/validateDocument";
import { listsSchema } from "./defaultSchema";

const renderer = new HtmlRenderer(listsSchema);

const item = (id: string, text: string, attributes: unknown = {}) => ({
    id,
    type: "list-item",
    children: text ? [{ text, marks: [] }] : [],
    attributes
});

const doc = (...blocks: unknown[]) => ({ version: 1, blocks });

describe("Listas: renderer", () => {
    it("agrupa ítems consecutivos en un único <ul>", () => {
        const html = renderer.render(
            doc(item("a", "uno"), item("b", "dos")) as any
        );

        expect(html).toBe(
            '<ul><li data-block-id="a" class="level-0">uno</li>' +
            '<li data-block-id="b" class="level-0">dos</li></ul>'
        );
    });

    it("separa listas ordenadas y no ordenadas", () => {
        const html = renderer.render(
            doc(
                item("a", "uno", { ordered: false, level: 0 }),
                item("b", "dos", { ordered: true, level: 0 })
            ) as any
        );

        expect(html).toContain("</ul><ol>");
        expect(html.endsWith("</ol>")).toBe(true);
    });

    it("cierra la lista cuando aparece un párrafo", () => {
        const html = renderer.render(
            doc(
                item("a", "uno"),
                { id: "p", type: "paragraph", children: [{ text: "x", marks: [] }], attributes: {} }
            ) as any
        );

        expect(html).toBe(
            '<ul><li data-block-id="a" class="level-0">uno</li></ul>' +
            '<p data-block-id="p">x</p>'
        );
    });

    it("pinta el nivel como clase y un ítem vacío con <br>", () => {
        const html = renderer.render(
            doc(item("a", "", { ordered: false, level: 3 })) as any
        );

        expect(html).toBe(
            '<ul><li data-block-id="a" class="level-3"><br></li></ul>'
        );
    });

    it("un level malicioso en un documento sin validar cae a 0", () => {
        const html = renderer.render(
            doc(item("a", "x", { level: '0" onmouseover="alert(1)' })) as any
        );

        expect(html).not.toContain("onmouseover");
        expect(html).toContain('class="level-0"');
    });
});

describe("Listas: validación", () => {
    it("rellena valores por defecto", () => {
        const result = validateDocument(doc(item("a", "x", {})), listsSchema);

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.document.blocks[0].attributes).toEqual({
                ordered: false,
                level: 0
            });
        }
    });

    it("acepta ordered y level válidos", () => {
        const result = validateDocument(
            doc(item("a", "x", { ordered: true, level: 5 })),
            listsSchema
        );

        expect(result.ok).toBe(true);
    });

    it("rechaza level fuera de rango, decimal o de otro tipo", () => {
        for (const level of [-1, 6, 1.5, "1", null]) {
            expect(
                validateDocument(doc(item("a", "x", { level })), listsSchema).ok
            ).toBe(false);
        }
    });

    it("rechaza ordered que no es booleano y claves extra", () => {
        expect(
            validateDocument(doc(item("a", "x", { ordered: "true" })), listsSchema).ok
        ).toBe(false);
        expect(
            validateDocument(doc(item("a", "x", { onclick: "x" })), listsSchema).ok
        ).toBe(false);
    });

    it("el esquema por defecto sigue rechazando list-item", () => {
        expect(validateDocument(doc(item("a", "x"))).ok).toBe(false);
    });
});