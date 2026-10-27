import { describe, it, expect } from "vitest";
import { Editor } from "../core/Editor";
import { createSchema } from "./Schema";
import { paragraph, bold } from "./defaultSchema";

import { validateDocument } from "../model/validateDocument";

const onlyBold = createSchema({ blocks: [paragraph], marks: [bold] });

const docWith = (markType: string) => ({
    version: 1,
    blocks: [
        {
            id: "b1",
            type: "paragraph",
            children: [{ text: "hola", marks: [{ type: markType }] }]
        }
    ]
});

describe("Schema", () => {
    it("un esquema restringido rechaza marcas que no incluye", () => {
        const editor = new Editor(undefined, onlyBold);

        expect(editor.loadDocument(docWith("italic")).ok).toBe(false);
        expect(editor.loadDocument(docWith("bold")).ok).toBe(true);
    });

    it("el renderer solo pinta las marcas del esquema", () => {
        const editor = new Editor(
            {
                version: 1,
                blocks: [
                    {
                        id: "b1",
                        type: "paragraph",
                        children: [
                            { text: "hola", marks: [{ type: "italic" }, { type: "bold" }] }
                        ]
                    }
                ]
            },
            onlyBold
        );

        expect(editor.render()).toBe(
            '<p data-block-id="b1"><strong>hola</strong></p>'
        );
    });

    it("nombres como __proto__ no existen en el esquema", () => {
        expect(onlyBold.hasMark("__proto__")).toBe(false);
        expect(onlyBold.hasBlock("constructor")).toBe(false);
    });
});

const withLevel = createSchema({
    blocks: [
        {
            name: "paragraph",
            validateAttributes: raw => {
                if (raw === undefined) return {};
                if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
                    return null;
                }

                const { level, ...rest } = raw as Record<string, unknown>;

                if (Object.keys(rest).length > 0) return null; // claves extra
                if (level === undefined) return {};

                return Number.isInteger(level) && (level as number) >= 0 && (level as number) <= 5
                    ? { level }
                    : null;
            },
            render: (content, block) => `<p data-block-id="${block.id}">${content}</p>`
        }
    ],
    marks: []
});

const docWithAttrs = (attributes: unknown) => ({
    version: 1,
    blocks: [{ id: "b1", type: "paragraph", children: [], attributes }]
});

describe("Schema: atributos de bloque", () => {
    it("acepta atributos válidos y los devuelve limpios", () => {
        const result = validateDocument(docWithAttrs({ level: 2 }), withLevel);

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.document.blocks[0].attributes).toEqual({ level: 2 });
        }
    });

    it("rechaza valores fuera de rango, decimales y tipos incorrectos", () => {
        for (const level of [-1, 6, 1.5, "2", null]) {
            expect(validateDocument(docWithAttrs({ level }), withLevel).ok).toBe(false);
        }
    });

    it("rechaza claves extra como onclick", () => {
        expect(
            validateDocument(docWithAttrs({ level: 1, onclick: "x" }), withLevel).ok
        ).toBe(false);
    });

    it("un bloque sin validateAttributes sigue exigiendo atributos vacíos", () => {
        expect(validateDocument(docWithAttrs({ level: 1 })).ok).toBe(false);
        expect(validateDocument(docWithAttrs({})).ok).toBe(true);
    });
});