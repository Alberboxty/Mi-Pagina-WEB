import fs from "fs";
import path from "path";
import { Request } from "express";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads", "noticias");

/** Borra el fichero que multer ya guardó en esta petición. */
export function removeUploadedFile(req: Request): void {
    if (req.file?.path) {
        fs.unlink(req.file.path, () => {});
    }
}

/** Borra una imagen por su ruta guardada en la BD, solo si está dentro de uploads/noticias. */
export function deleteStoredImage(storedPath: string | null | undefined): void {
    if (!storedPath) return;

    const absolute = path.resolve(process.cwd(), "." + storedPath);

    if (!absolute.startsWith(UPLOADS_DIR + path.sep)) return;

    fs.unlink(absolute, () => {});
}