import { createSchema, type BlockSpec, type MarkSpec } from "./Schema";
import { escapeHtml } from "./escapeHtml";

export const paragraph: BlockSpec = {
    name: "paragraph",
    render: (content, block) =>
        `<p data-block-id="${escapeHtml(block.id)}">${content}</p>`
};

export const italic: MarkSpec = {
    name: "italic",
    render: inner => `<em>${inner}</em>`
};

export const bold: MarkSpec = {
    name: "bold",
    render: inner => `<strong>${inner}</strong>`
};

export const underline: MarkSpec = {
    name: "underline",
    render: inner => `<u>${inner}</u>`
};

export const strikethrough: MarkSpec = {
    name: "strikethrough",
    render: inner => `<s>${inner}</s>`
};

// ---- Listas ----

const MAX_LIST_LEVEL = 5;

// Helper local: importarlo de validateDocument crearía un import circular.
function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }

    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

function isValidLevel(value: unknown): value is number {
    return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= MAX_LIST_LEVEL
    );
}

/** Lee los atributos de un list-item y devuelve valores siempre seguros. */
function safeListAttributes(raw: unknown): { ordered: boolean; level: number } {
    const attrs = isPlainObject(raw) ? raw : {};

    return {
        ordered: attrs.ordered === true,
        level: isValidLevel(attrs.level) ? attrs.level : 0
    };
}

export const listItem: BlockSpec = {
    name: "list-item",

    validateAttributes: raw => {
        if (raw === undefined) {
            return { ordered: false, level: 0 };
        }

        if (!isPlainObject(raw)) {
            return null;
        }

        // Cualquier clave que no sea ordered o level invalida el bloque.
        for (const key of Object.keys(raw)) {
            if (key !== "ordered" && key !== "level") {
                return null;
            }
        }

        const ordered = raw.ordered === undefined ? false : raw.ordered;
        const level = raw.level === undefined ? 0 : raw.level;

        if (typeof ordered !== "boolean" || !isValidLevel(level)) {
            return null;
        }

        return { ordered, level };
    },

    wrapper: block => {
        // El renderer puede recibir documentos no validados: se normaliza.
        const { ordered } = safeListAttributes(block.attributes);

        return ordered
            ? { key: "ol", open: "<ol>", close: "</ol>" }
            : { key: "ul", open: "<ul>", close: "</ul>" };
    },

    render: (content, block) => {
        const { level } = safeListAttributes(block.attributes);

        return `<li data-block-id="${escapeHtml(block.id)}" class="level-${level}">${content}</li>`;
    }
};

export const defaultSchema = createSchema({
    blocks: [paragraph],
    marks: [italic, bold, underline, strikethrough]
});

/** Esquema con listas, pensado por ejemplo para noticias. */
export const listsSchema = createSchema({
    blocks: [paragraph, listItem],
    marks: [italic, bold, underline, strikethrough]
});