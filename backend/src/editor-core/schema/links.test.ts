import { describe, it, expect } from "vitest";
import { validateDocument } from "../model/validateDocument";
import { richSchema, sanitizeUrl } from "./defaultSchema";

const doc = (marks: unknown[]) => ({
    version: 1,
    blocks: [
        {
            id: "b1",
            type: "paragraph",
            children: [{ text: "enlace", marks }],
            attributes: {}
        }
    ]
});

const linkMark = (href: unknown, extra: Record<string, unknown> = {}) => ({
    type: "link",
    attributes: { href, ...extra }
});

describe("sanitizeUrl", () => {
    it("acepta http, https y mailto", () => {
        expect(sanitizeUrl("https://example.com")).toBe("https://example.com/");
        expect(sanitizeUrl("mailto:hola@example.com")).toBe("mailto:hola@example.com");
    });

    it("rechaza protocolos peligrosos", () => {
        for (const url of [
            "javascript:alert(1)",
            "JAVASCRIPT:alert(1)",
            "data:text/html,<script>alert(1)</script>",
            "vbscript:x",
            "file:///etc/passwd"
        ]) {
            expect(sanitizeUrl(url)).toBeNull();
        }
    });

    it("rechaza URLs relativas, con espacios o caracteres de control", () => {
        for (const url of [
            "//evil.com",
            "/ruta",
            "example.com",
            " https://example.com",
            "java\tscript:alert(1)",
            "https://exa mple.com",
            ""
        ]) {
            expect(sanitizeUrl(url)).toBeNull();
        }
    });

    it("rechaza lo que no es string o es demasiado largo", () => {
        expect(sanitizeUrl(null)).toBeNull();
        expect(sanitizeUrl(5)).toBeNull();
        expect(sanitizeUrl("https://a.com/" + "a".repeat(3000))).toBeNull();
    });
});

describe("Enlaces: validación", () => {
    it("acepta un enlace válido y devuelve el href normalizado", () => {
        const result = validateDocument(doc([linkMark("https://example.com")]), richSchema);

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.document.blocks[0]!.children[0]!.marks).toEqual([
                { type: "link", attributes: { href: "https://example.com/" } }
            ]);
        }
    });

    it("rechaza javascript: y claves extra", () => {
        expect(
            validateDocument(doc([linkMark("javascript:alert(1)")]), richSchema).ok
        ).toBe(false);
        expect(
            validateDocument(doc([linkMark("https://a.com", { onclick: "x" })]), richSchema).ok
        ).toBe(false);
    });

    it("rechaza un enlace sin href", () => {
        expect(
            validateDocument(doc([{ type: "link", attributes: {} }]), richSchema).ok
        ).toBe(false);
        expect(validateDocument(doc([{ type: "link" }]), richSchema).ok).toBe(false);
    });

    it("el esquema por defecto rechaza la marca link", () => {
        expect(validateDocument(doc([linkMark("https://example.com")])).ok).toBe(false);
    });

    it("las demás marcas siguen sin admitir atributos", () => {
        expect(
            validateDocument(doc([{ type: "bold", attributes: { href: "x" } }]), richSchema).ok
        ).toBe(false);
    });
});