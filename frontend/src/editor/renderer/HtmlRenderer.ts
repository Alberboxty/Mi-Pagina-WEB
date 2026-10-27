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
        let html = "";
        let openWrapper: { key: string; close: string } | null = null;

        for (const block of document.blocks) {
            const spec = this.schema.getBlock(block.type);

            // Bloque que el esquema no conoce: no se pinta.
            if (!spec) {
                continue;
            }

            const wrapper = spec.wrapper?.(block) ?? null;

            // Cambia el contenedor: se cierra el anterior.
            if (openWrapper && openWrapper.key !== wrapper?.key) {
                html += openWrapper.close;
                openWrapper = null;
            }

            // Se abre un contenedor nuevo si hace falta.
            if (wrapper && !openWrapper) {
                html += wrapper.open;
                openWrapper = { key: wrapper.key, close: wrapper.close };
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

            html += spec.render(content, block);
        }

        if (openWrapper) {
            html += openWrapper.close;
        }

        return html;
    }
}