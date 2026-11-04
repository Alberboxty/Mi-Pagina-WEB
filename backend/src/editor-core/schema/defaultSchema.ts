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

// ---- Enlaces ----

const ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:"];
const MAX_URL_LENGTH = 2048;

/** Devuelve la URL normalizada si es segura, o null. */
export function sanitizeUrl(value: unknown): string | null {
    if (typeof value !== "string" || value.length === 0 || value.length > MAX_URL_LENGTH) {
        return null;
    }

    // Sin espacios ni caracteres de control (evita trucos como "java\tscript:").
    if (/[\s\u0000-\u001F\u007F]/.test(value)) {
        return null;
    }

    try {
        const url = new URL(value); // lanza si es relativa

        return ALLOWED_PROTOCOLS.includes(url.protocol) ? url.href : null;
    } catch {
        return null;
    }
}

export const link: MarkSpec = {
    name: "link",

    validateAttributes: raw => {
        if (!isPlainObject(raw)) {
            return null;
        }

        for (const key of Object.keys(raw)) {
            if (key !== "href") {
                return null;
            }
        }

        const href = sanitizeUrl(raw.href);

        return href === null ? null : { href };
    },

    render: (inner, attributes) => {
        // El renderer puede recibir documentos sin validar: se comprueba otra vez.
        const href = sanitizeUrl(attributes.href);

        if (href === null) {
            return inner;
        }

        return `<a href="${escapeHtml(href)}" rel="noopener noreferrer" target="_blank">${inner}</a>`;
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

/** Listas y enlaces: pensado, por ejemplo, para noticias. */
export const richSchema = createSchema({
    blocks: [paragraph, listItem],
    marks: [italic, bold, underline, strikethrough, link] // link al final: envuelve al resto
});