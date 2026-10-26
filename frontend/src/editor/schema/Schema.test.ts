import { describe, it, expect } from "vitest";
import { Editor } from "../core/Editor";
import { createSchema } from "./Schema";
import { paragraph, bold } from "./defaultSchema";

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