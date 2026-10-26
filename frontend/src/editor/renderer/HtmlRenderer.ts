import type { Document } from "../model/Document";
import type { Inline } from "../model/Inline";
import type { Renderer } from "./Renderer";
import type { Schema } from "../schema/Schema";
import { defaultSchema } from "../schema/defaultSchema";
import { escapeHtml } from "../schema/escapeHtml";

export class HtmlRenderer implements Renderer {

    constructor(private readonly schema: Schema = defaultSchema) {}

    private renderInline(inline: Inline): string {
        let content = escapeHtml(inline.text);

        for (const spec of this.schema.markSpecs) {
            if (inline.marks.some(mark => mark.type === spec.name)) {
                content = spec.render(content);
            }
        }

        return content;
    }

    public render(document: Document): string {
        return document.blocks
            .map(block => {
                const spec = this.schema.getBlock(block.type);

                // Bloque que el esquema no conoce: no se pinta.
                if (!spec) {
                    return "";
                }

                // Un bloque sin texto necesita un <br> para tener altura
                // y poder alojar el cursor.
                const isEmpty = block.children.every(
                    inline => inline.text.length === 0
                );

                const content = isEmpty
                    ? "<br>"
                    : block.children
                        .map(inline => this.renderInline(inline))
                        .join("");

                return spec.render(content, block);
            })
            .join("");
    }
}