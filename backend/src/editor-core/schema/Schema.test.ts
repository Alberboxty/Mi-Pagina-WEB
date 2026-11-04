import { describe, it, expect } from "vitest";
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
        expect(validateDocument(docWith("italic"), onlyBold).ok).toBe(false);
        expect(validateDocument(docWith("bold"), onlyBold).ok).toBe(true);
    });

    it("nombres como __proto__ no existen en el esquema", () => {
        expect(onlyBold.hasMark("__proto__")).toBe(false);
        expect(onlyBold.hasBlock("constructor")).toBe(false);
    });
});