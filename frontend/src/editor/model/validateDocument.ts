import type { Document } from "./Document";
import type { Block } from "./Block";
import type { Inline } from "./Inline";
import type { Mark } from "./Mark";

import type { Schema } from "../schema/Schema";
import { defaultSchema } from "../schema/defaultSchema";

export const SAFE_ID = /^[A-Za-z0-9_-]{1,64}$/;

export const LIMITS = {
    maxBlocks: 10_000,
    maxInlinesPerBlock: 5_000,
    maxMarksPerInline: 8,
    maxTextLength: 1_000_000, // caracteres totales en el documento
    maxErrors: 20
} as const;

export type ValidationResult =
    | { ok: true; document: Document }
    | { ok: false; errors: string[] };

export function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }

    const proto = Object.getPrototypeOf(value);

    return proto === Object.prototype || proto === null;
}

function isEmptyOrAbsent(value: unknown): boolean {
    return (
        value === undefined ||
        (isPlainObject(value) && Object.keys(value).length === 0)
    );
}

export function validateDocument(
    input: unknown,
    schema: Schema = defaultSchema
): ValidationResult {
    const errors: string[] = [];

    const fail = (path: string, message: string) => {
        if (errors.length < LIMITS.maxErrors) {
            errors.push(`${path}: ${message}`);
        }
    };

    if (!isPlainObject(input)) {
        return { ok: false, errors: ["document: debe ser un objeto"] };
    }

    if (input.version !== 1) {
        fail("document.version", "debe ser 1");
    }

    if (!Array.isArray(input.blocks)) {
        fail("document.blocks", "debe ser un array");
        return { ok: false, errors };
    }

    if (input.blocks.length > LIMITS.maxBlocks) {
        fail("document.blocks", `máximo ${LIMITS.maxBlocks} bloques`);
        return { ok: false, errors };
    }

    const blocks: Block[] = [];
    const seenIds = new Set<string>();
    let totalText = 0;

    input.blocks.forEach((rawBlock: unknown, b: number) => {
        const bp = `blocks[${b}]`;

        if (!isPlainObject(rawBlock)) {
            fail(bp, "debe ser un objeto");
            return;
        }

        const { id, type, children, attributes } = rawBlock;

        if (typeof id !== "string" || !SAFE_ID.test(id)) {
            fail(`${bp}.id`, "formato no válido");
        } else if (seenIds.has(id)) {
            fail(`${bp}.id`, "id duplicado");
        } else {
            seenIds.add(id);
        }

        if (typeof type !== "string" || !schema.hasBlock(type)) {
            fail(`${bp}.type`, "tipo de bloque no permitido");
        }

        // Atributos limpios del bloque: se rellenan según su spec.
        let cleanAttributes: Record<string, unknown> = {};

        const blockSpec =
            typeof type === "string" ? schema.getBlock(type) : undefined;

        if (blockSpec?.validateAttributes) {
            const validated = blockSpec.validateAttributes(attributes);

            if (validated === null) {
                fail(`${bp}.attributes`, "atributos no válidos");
            } else {
                cleanAttributes = validated;
            }
        } else if (!isEmptyOrAbsent(attributes)) {
            fail(`${bp}.attributes`, "no se permiten atributos");
        }

        if (!Array.isArray(children)) {
            fail(`${bp}.children`, "debe ser un array");
            return;
        }

        if (children.length > LIMITS.maxInlinesPerBlock) {
            fail(`${bp}.children`, "demasiados fragmentos");
            return;
        }

        const cleanInlines: Inline[] = [];

        children.forEach((rawInline: unknown, i: number) => {
            const ip = `${bp}.children[${i}]`;

            if (!isPlainObject(rawInline)) {
                fail(ip, "debe ser un objeto");
                return;
            }

            const { text, marks } = rawInline;

            if (typeof text !== "string") {
                fail(`${ip}.text`, "debe ser un string");
                return;
            }

            totalText += text.length;

            if (totalText > LIMITS.maxTextLength) {
                fail(ip, "el documento supera el tamaño máximo");
                return;
            }

            if (!Array.isArray(marks)) {
                fail(`${ip}.marks`, "debe ser un array");
                return;
            }

            if (marks.length > LIMITS.maxMarksPerInline) {
                fail(`${ip}.marks`, "demasiadas marcas");
                return;
            }

            const cleanMarks: Mark[] = [];

            marks.forEach((rawMark: unknown, m: number) => {
                const mp = `${ip}.marks[${m}]`;

                if (!isPlainObject(rawMark)) {
                    fail(mp, "debe ser un objeto");
                    return;
                }

                if (
                    typeof rawMark.type !== "string" ||
                    !schema.hasMark(rawMark.type)
                ) {
                    fail(`${mp}.type`, "marca no permitida");
                    return;
                }

                if (!isEmptyOrAbsent(rawMark.attributes)) {
                    fail(`${mp}.attributes`, "no se permiten atributos");
                    return;
                }

                cleanMarks.push({ type: rawMark.type });
            });

            cleanInlines.push({ text, marks: cleanMarks });
        });

        if (typeof id === "string" && typeof type === "string") {
            blocks.push({
                id,
                type,
                children: cleanInlines,
                attributes: cleanAttributes
            });
        }
    });

    if (errors.length > 0) {
        return { ok: false, errors };
    }

    return { ok: true, document: { version: 1, blocks } };
}