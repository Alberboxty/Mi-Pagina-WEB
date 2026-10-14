import { describe, it, expect} from "vitest";

import { HtmlRenderer } from "./HtmlRenderer";

describe("HtmlRenderer", () => {
    it("Renderiza un párrafo", () => {
        const renderer = new HtmlRenderer();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola mundo",
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        const html = renderer.render(document);

        expect(html).toBe('<p data-block-id="1">Hola mundo</p>');
    });

    it("Renderiza varios párrafos", () => {
        const renderer = new HtmlRenderer();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola",
                            marks: []
                        }
                    ],
                    attributes: {}
                },
                {
                    id: "2",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Mundo",
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        const html = renderer.render(document);

        expect(html).toBe('<p data-block-id="1">Hola</p><p data-block-id="2">Mundo</p>');
    });

    it("Escapa HTML dentro del texto", () => {
        const renderer = new HtmlRenderer();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: `<script>alert("xss")</script>`,
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        const html = renderer.render(document);

        expect(html).toBe('<p data-block-id="1">&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>');
    });

    it("Renderiza texto en negrita", () => {
        const renderer = new HtmlRenderer();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola",
                            marks: [
                                {
                                    type: "bold"
                                }
                            ]
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        const html = renderer.render(document);

        console.log(html);

        expect(html).toBe('<p data-block-id="1"><strong>Hola</strong></p>');
    });

    it("Renderiza texto en cursiva", () => {
        const renderer = new HtmlRenderer();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola",
                            marks: [
                                {
                                    type: "italic"
                                }
                            ]
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        const html = renderer.render(document);

        console.log(html);

        expect(html).toBe('<p data-block-id="1"><em>Hola</em></p>');
    });

    it("Renderiza texto en subrayado", () => {
        const renderer = new HtmlRenderer();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola",
                            marks: [
                                {
                                    type: "underline"
                                }
                            ]
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        const html = renderer.render(document);

        console.log(html);

        expect(html).toBe('<p data-block-id="1"><u>Hola</u></p>');
    });

    it("Renderiza texto en strikethrough", () => {
        const renderer = new HtmlRenderer();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola",
                            marks: [
                                {
                                    type: "strikethrough"
                                }
                            ]
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        const html = renderer.render(document);

        console.log(html);

        expect(html).toBe('<p data-block-id="1"><s>Hola</s></p>');
    });

    it("Renderiza varias marks en el mismo texto", () => {
        const renderer = new HtmlRenderer();

        const document = {
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola",
                            marks: [
                                {
                                    type: "bold"
                                },
                                {
                                    type: "italic"
                                }
                            ]
                        }
                    ],
                    attributes: {}
                }
            ]
        };

        const html = renderer.render(document);

        console.log(html);

        expect(html).toBe('<p data-block-id="1"><strong><em>Hola</em></strong></p>');
    });
});

