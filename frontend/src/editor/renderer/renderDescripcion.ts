import { HtmlRenderer } from "./HtmlRenderer";
import { richSchema } from "../schema/defaultSchema";
import { validateDocument } from "../model/validateDocument";
import { textToDocument } from "../model/documents";

const renderer = new HtmlRenderer(richSchema);

/** Acepta el JSON del documento o una descripción antigua en texto plano. */
function toDocumentInput(valor: unknown): unknown {
    if (typeof valor !== "string") return valor;

    // Por si el backend devolviera el JSON como string.
    try {
        const parsed: unknown = JSON.parse(valor);
        if (typeof parsed === "object" && parsed !== null) return parsed;
    } catch {
        // No era JSON: texto plano antiguo.
    }

    return textToDocument(valor);
}

/** Devuelve HTML seguro, o "" si la descripción no es válida. */
export function renderDescripcion(valor: unknown): string {
    const result = validateDocument(toDocumentInput(valor), richSchema);

    if (!result.ok) {
        console.warn("[noticias] descripción no válida:", result.errors);
        return "";
    }

    return renderer.render(result.document);
}

/** Texto plano de la descripción (para tablas y extractos). Nunca devuelve HTML. */
export function descripcionToText(valor: unknown, maxLength = 120): string {
    const result = validateDocument(toDocumentInput(valor), richSchema);

    if (!result.ok) return "";

    const text = result.document.blocks
        .map(block => block.children.map(inline => inline.text).join(""))
        .filter(line => line.length > 0)
        .join(" ");

    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}