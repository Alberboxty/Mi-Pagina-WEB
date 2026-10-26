import { describe, it, expect } from "vitest";
import { HtmlRenderer } from "./HtmlRenderer";

const renderer = new HtmlRenderer();

const docWith = (id: string, text: string, marks: any[] = []) =>
    ({
        version: 1,
        blocks: [
            {
                id,
                type: "paragraph",
                children: [{ text, marks }]
            }
        ]
    }) as any;

describe("HtmlRenderer: XSS", () => {
    it("escapa etiquetas en el texto", () => {
        const html = renderer.render(
            docWith("b1", "<script>alert(1)</script>")
        );

        expect(html).not.toContain("<script>");
        expect(html).toContain("&lt;script&gt;");
    });

    it("escapa comillas y manejadores en el texto", () => {
        const html = renderer.render(
            docWith("b1", `"><img src=x onerror=alert(1)>`)
        );

        expect(html).not.toContain("<img");
        expect(html).toContain("&quot;&gt;&lt;img");
    });

    it("no permite inyectar atributos mediante el id", () => {
        const html = renderer.render(
            docWith(`x" onmouseover="alert(1)`, "hola")
        );

        expect(html).not.toContain('" onmouseover');
        expect(html).toContain("data-block-id=\"x&quot; onmouseover=&quot;");
    });

    it("ignora marcas desconocidas", () => {
        const html = renderer.render(
            docWith("b1", "hola", [{ type: "script" }, { type: "bold" }])
        );

        expect(html).toBe(
            '<p data-block-id="b1"><strong>hola</strong></p>'
        );
    });

    it("ignora bloques de tipo desconocido", () => {
        const html = renderer.render({
            version: 1,
            blocks: [{ id: "b1", type: "script", children: [] }]
        } as any);

        expect(html).toBe("");
    });
});