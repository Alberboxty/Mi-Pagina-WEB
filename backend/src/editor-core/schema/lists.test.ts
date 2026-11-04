import { describe, it, expect } from "vitest";
import { validateDocument } from "../model/validateDocument";
import { listsSchema } from "./defaultSchema";

const item = (id: string, text: string, attributes: unknown = {}) => ({
    id,
    type: "list-item",
    children: text ? [{ text, marks: [] }] : [],
    attributes
});

const doc = (...blocks: unknown[]) => ({ version: 1, blocks });

describe("Listas: validación", () => {
    it("rellena valores por defecto", () => {
        const result = validateDocument(doc(item("a", "x", {})), listsSchema);

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.document.blocks[0]!.attributes).toEqual({
                ordered: false,
                level: 0
            });
        }
    });

    it("acepta ordered y level válidos", () => {
        expect(
            validateDocument(doc(item("a", "x", { ordered: true, level: 5 })), listsSchema).ok
        ).toBe(true);
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

    it("el esquema por defecto rechaza list-item", () => {
        expect(validateDocument(doc(item("a", "x"))).ok).toBe(false);
    });
});