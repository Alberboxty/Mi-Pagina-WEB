import type { Document } from "../model/Document";
import type { Renderer } from "./Renderer";

export class HtmlRenderer implements Renderer {

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    public render(document: Document): string {
        return document.blocks
            .map(block => {
                if (block.type === "paragraph") {
                    const content = block.children
                        .map(inline => {
                            const text = this.escapeHtml(inline.text);

                            let content = text

                            if (inline.marks.some(mark => mark.type === "italic")) {
                                content = `<em>${content}</em>`;
                            }

                            if (inline.marks.some(mark => mark.type === "bold")) {
                                content = `<strong>${content}</strong>`;
                            }

                            if (inline.marks.some(mark => mark.type === "underline")) {
                                content = `<u>${content}</u>`;
                            }

                            if (inline.marks.some(mark => mark.type === "strikethrough")) {
                                content = `<s>${content}</s>`;
                            }

                            return content;
                        })
                        .join("");

                    return `<p data-block-id="${block.id}">${content}</p>`;
                }
                return "";
            })
            .join("");
    }
}