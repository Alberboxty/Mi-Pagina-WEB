import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { History } from "./History";
import { Transaction } from "./Transaction";

const doc = (text: string) => ({
    version: 1,
    blocks: [
        {
            id: "b1",
            type: "paragraph",
            children: [{ text, marks: [] }]
        }
    ]
}) as any;

const tx = (from: string, to: string) =>
    new Transaction(doc(from), doc(to), null, null);

describe("History", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("empieza sin undo ni redo", () => {
        const history = new History();

        expect(history.canUndo()).toBe(false);
        expect(history.canRedo()).toBe(false);
    });

    it("undo y redo devuelven la misma transacción", () => {
        const history = new History();
        const t = tx("", "a");

        history.push(t);

        expect(history.undo()).toBe(t);
        expect(history.canRedo()).toBe(true);
        expect(history.redo()).toBe(t);
    });

    it("un push nuevo borra el redo", () => {
        const history = new History();

        history.push(tx("", "a"));
        history.undo();
        history.push(tx("", "b"));

        expect(history.canRedo()).toBe(false);
    });

    it("agrupa transacciones con la misma clave dentro de la ventana", () => {
        const history = new History();

        history.push(tx("", "h"), "typing");
        vi.advanceTimersByTime(100);
        history.push(tx("h", "ho"), "typing");
        vi.advanceTimersByTime(100);
        history.push(tx("ho", "hol"), "typing");

        const merged = history.undo()!;

        expect(merged.before.blocks[0].children[0].text).toBe("");
        expect(merged.after.blocks[0].children[0].text).toBe("hol");
        expect(history.canUndo()).toBe(false);
    });

    it("no agrupa si pasa más de 800 ms", () => {
        const history = new History();

        history.push(tx("", "a"), "typing");
        vi.advanceTimersByTime(900);
        history.push(tx("a", "ab"), "typing");

        history.undo();

        expect(history.canUndo()).toBe(true);
    });

    it("no agrupa sin clave", () => {
        const history = new History();

        history.push(tx("", "a"));
        history.push(tx("a", "ab"));

        history.undo();

        expect(history.canUndo()).toBe(true);
    });

    it("tras undo, el tecleo no se fusiona con lo anterior", () => {
        const history = new History();

        history.push(tx("", "a"), "typing");
        history.undo();
        history.redo();
        history.push(tx("a", "ab"), "typing");

        history.undo();

        expect(history.canUndo()).toBe(true);
    });

    it("limita el historial a 200 pasos", () => {
        const history = new History();

        for (let i = 0; i < 250; i++) {
            history.push(tx(String(i), String(i + 1)));
        }

        let count = 0;
        while (history.undo()) count++;

        expect(count).toBe(200);
    });

    it("clear vacía ambas pilas", () => {
        const history = new History();

        history.push(tx("", "a"));
        history.undo();
        history.clear();

        expect(history.canUndo()).toBe(false);
        expect(history.canRedo()).toBe(false);
    });
});