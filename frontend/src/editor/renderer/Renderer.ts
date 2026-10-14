import type { Document } from "../model/Document";

export interface Renderer {
    render(document: Document): string;
}