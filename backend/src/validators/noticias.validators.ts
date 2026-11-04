import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

import { validateDocument } from "../editor-core/model/validateDocument";
import { richSchema } from "../editor-core/schema/defaultSchema";

const MAX_DESCRIPCION_BYTES = 1_000_000;

/** Valida la descripción con el esquema que decide el servidor (nunca el body). */
function sanitizarDescripcion(raw: unknown): string | false {
    if (typeof raw !== "string" || Buffer.byteLength(raw) > MAX_DESCRIPCION_BYTES) {
        return false;
    }

    let parsed: unknown;

    try {
        parsed = JSON.parse(raw);
    } catch {
        return false;
    }

    const result = validateDocument(parsed, richSchema);

    if (!result.ok) {
        console.warn("[noticias] descripción no válida:", result.errors);
        return false;
    }

    const hayTexto = result.document.blocks.some(block =>
        block.children.some(inline => inline.text.trim().length > 0)
    );

    if (!hayTexto) return false;

    // Se guarda la copia limpia, no lo que mandó el cliente.
    return JSON.stringify(result.document);
}

/** Texto simple: sin escape (Vue escapa al pintar), solo tipo y longitud. */
const texto = (name: string, max: number, required: boolean) => {
    const chain = required ? body(name) : body(name).optional();

    return chain
        .isString().withMessage(`${name} no válido`)
        .trim()
        .isLength({ min: 1, max }).withMessage(`${name} no válido`);
};

const descripcion = (required: boolean) => {
    const chain = required ? body("descripcion") : body("descripcion").optional();

    return chain
        .customSanitizer(sanitizarDescripcion)
        .custom(value => value !== false)
        .withMessage("Descripción no válida");
};

export const validarCrearNoticia = [
    texto("titulo", 200, true),
    texto("asunto", 200, true),
    texto("version", 50, true),
    descripcion(true)
];

// En PATCH todos los campos son opcionales
export const validarActualizarNoticia = [
    texto("titulo", 200, false),
    texto("asunto", 200, false),
    texto("version", 50, false),
    descripcion(false)
];

/**
 * Multer guarda el fichero antes de validar. Si algo falla, hay que
 * borrarlo o se acumulan imágenes huérfanas.
 */
export function responderErroresNoticia(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    if (req.file?.path) fs.unlink(req.file.path, () => {});

    // Detalle solo al log; al cliente, un mensaje genérico.
    console.warn("[noticias] validación:", errors.array());

    return res.status(400).json({ ok: false, msg: "Datos no válidos" });
}