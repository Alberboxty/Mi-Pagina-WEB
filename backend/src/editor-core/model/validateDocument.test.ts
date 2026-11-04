import { describe, it, expect } from "vitest";
import { validateDocument } from "./validateDocument";

const valid = () => ({
    version: 1,
    blocks: [
        {
            id: "b1",
            type: "paragraph",
            children: [
                { text: "Hola ", marks: [] },
                { text: "mundo", marks: [{ type: "bold" }] }
            ]
        }
    ]
});

const withBlock = (patch: Record<string, unknown>) => {
    const doc: any = valid();
    Object.assign(doc.blocks[0], patch);
    return doc;
};

describe("validateDocument", () => {
    it("acepta un documento válido", () => {
        const result = validateDocument(valid());

        expect(result.ok).toBe(true);
    });

    it("acepta un id UUID y attributes vacío", () => {
        const result = validateDocument(
            withBlock({ id: crypto.randomUUID(), attributes: {} })
        );

        expect(result.ok).toBe(true);
    });

    it("rechaza lo que no es un objeto", () => {
        for (const bad of [null, undefined, 1, "x", []]) {
            expect(validateDocument(bad).ok).toBe(false);
        }
    });

    it("rechaza una versión distinta de 1", () => {
        expect(validateDocument({ ...valid(), version: 2 }).ok).toBe(false);
    });

    it("rechaza ids con comillas o atributos inyectados", () => {
        const result = validateDocument(
            withBlock({ id: `x" onmouseover="alert(1)` })
        );

        expect(result.ok).toBe(false);
    });

    it("rechaza ids duplicados", () => {
        const doc: any = valid();
        doc.blocks.push({ ...doc.blocks[0] });

        expect(validateDocument(doc).ok).toBe(false);
    });

    it("rechaza tipos de bloque desconocidos", () => {
        expect(validateDocument(withBlock({ type: "script" })).ok).toBe(false);
    });

    it("rechaza marcas desconocidas", () => {
        const doc: any = valid();
        doc.blocks[0].children[0].marks = [{ type: "script" }];

        expect(validateDocument(doc).ok).toBe(false);
    });

    it("rechaza atributos en marcas y bloques", () => {
        const a: any = valid();
        a.blocks[0].children[1].marks = [
            { type: "bold", attributes: { href: "javascript:alert(1)" } }
        ];

        expect(validateDocument(a).ok).toBe(false);
        expect(
            validateDocument(withBlock({ attributes: { onclick: "x" } })).ok
        ).toBe(false);
    });

    it("rechaza text que no es string", () => {
        for (const bad of [null, 5, {}, ["a"]]) {
            const doc: any = valid();
            doc.blocks[0].children[0].text = bad;

            expect(validateDocument(doc).ok).toBe(false);
        }
    });

    it("rechaza children o marks que no son arrays", () => {
        expect(validateDocument(withBlock({ children: "hola" })).ok).toBe(false);

        const doc: any = valid();
        doc.blocks[0].children[0].marks = "bold";

        expect(validateDocument(doc).ok).toBe(false);
    });

    it("descarta campos extra y __proto__ en la copia limpia", () => {
        const json = `{
            "version": 1,
            "evil": "x",
            "blocks": [{
                "id": "b1",
                "type": "paragraph",
                "extra": "x",
                "__proto__": { "polluted": true },
                "children": [{ "text": "hola", "marks": [], "extra": 1 }]
            }]
        }`;

        const result = validateDocument(JSON.parse(json));

        expect(result.ok).toBe(true);

        if (result.ok) {
            expect(result.document).toEqual({
                version: 1,
                blocks: [
                    {
                        id: "b1",
                        type: "paragraph",
                        attributes: {},
                        children: [{ text: "hola", marks: [] }]
                    }
                ]
            });
            expect(({} as any).polluted).toBeUndefined();
        }
    });

    it("rechaza documentos con demasiado texto", () => {
        const doc: any = valid();
        doc.blocks[0].children[0].text = "a".repeat(1_000_001);

        expect(validateDocument(doc).ok).toBe(false);
    });
});