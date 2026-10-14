import { describe, expect, it } from "vitest";

import type { Document } from "./Document";
import type { Position, Selection } from "./Selection";

import {
    comparePositions,
    getOrderedSelection,
    isSelectionCollapsed
} from "./SelectionUtils";

const document: Document = {
    version: 1,
    blocks: [
        {
            id: "1",
            type: "paragraph",
            children: [
                { text: "Hola ", marks: [] },
                { text: "mundo", marks: [{ type: "bold" }] }
            ]
        },
        {
            id: "2",
            type: "paragraph",
            children: [
                { text: "Segundo", marks: [] }
            ]
        }
    ]
};

describe("SelectionUtils", () => {
    it("Detecta una selección contraída", () => {
        const selection: Selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 2
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 2
            }
        };

        expect(isSelectionCollapsed(selection)).toBe(true);
    });

    it("Detecta una selección no contraída", () => {
        const selection: Selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 1
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 4
            }
        };

        expect(isSelectionCollapsed(selection)).toBe(false);
    });

    it("Compara posiciones dentro del mismo Inline", () => {
        const a: Position = {
            blockId: "1",
            inlineIndex: 0,
            offset: 1
        };

        const b: Position = {
            blockId: "1",
            inlineIndex: 0,
            offset: 4
        };

        expect(comparePositions(document, a, b)).toBeLessThan(0);
        expect(comparePositions(document, b, a)).toBeGreaterThan(0);
        expect(comparePositions(document, a, a)).toBe(0);
    });

    it("Compara posiciones entre Inlines", () => {
        const a: Position = {
            blockId: "1",
            inlineIndex: 0,
            offset: 5
        };

        const b: Position = {
            blockId: "1",
            inlineIndex: 1,
            offset: 0
        };

        expect(comparePositions(document, a, b)).toBeLessThan(0);
    });

    it("Compara posiciones entre bloques", () => {
        const a: Position = {
            blockId: "1",
            inlineIndex: 1,
            offset: 5
        };

        const b: Position = {
            blockId: "2",
            inlineIndex: 0,
            offset: 0
        };

        expect(comparePositions(document, a, b)).toBeLessThan(0);
    });

    it("Devuelve null para una posición inválida", () => {
        const invalid: Position = {
            blockId: "999",
            inlineIndex: 0,
            offset: 0
        };

        const valid: Position = {
            blockId: "1",
            inlineIndex: 0,
            offset: 0
        };

        expect(comparePositions(document, invalid, valid)).toBeNull();
    });

    it("Ordena una selección realizada hacia atrás", () => {
        const selection: Selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 1,
                offset: 3
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 2
            }
        };

        expect(getOrderedSelection(document, selection)).toEqual({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 2
            },
            focus: {
                blockId: "1",
                inlineIndex: 1,
                offset: 3
            }
        });
    });

    it("Devuelve null si la selección contiene una posición inválida", () => {
        const selection: Selection = {
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 99,
                offset: 0
            }
        };

        expect(getOrderedSelection(document, selection)).toBeNull();
    });
});