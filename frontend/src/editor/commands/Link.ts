import type { Editor } from "../core/Editor";
import type { Inline } from "../model/Inline";
import type { Mark } from "../model/Mark";
import type { Document } from "../model/Document";
import type { Selection } from "../model/Selection";

import { getOrderedSelection } from "../model/SelectionUtils";
import { sanitizeUrl } from "../schema/defaultSchema";
import { mapPositionToDocument } from "./ToggleMark";

/**
 * Parte los inlines en los extremos de la selección y transforma las marcas
 * del texto seleccionado. Devuelve false si no cambió nada.
 */
function updateMarks(
    editor: Editor,
    selection: Selection,
    update: (marks: Mark[]) => Mark[]
): boolean {
    const document = editor.getDocument();
    const ordered = getOrderedSelection(document, selection);

    if (!ordered) return false;

    const { anchor, focus } = ordered;

    const startIndex = document.blocks.findIndex(b => b.id === anchor.blockId);
    const endIndex = document.blocks.findIndex(b => b.id === focus.blockId);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
        return false;
    }

    let changed = false;

    const newBlocks = document.blocks.map((block, blockIndex) => {
        if (blockIndex < startIndex || blockIndex > endIndex) {
            return block;
        }

        const first = blockIndex === startIndex ? anchor.inlineIndex : 0;
        const last = blockIndex === endIndex ? focus.inlineIndex : block.children.length - 1;

        const children: Inline[] = [];

        block.children.forEach((inline, inlineIndex) => {
            if (inlineIndex < first || inlineIndex > last) {
                children.push(inline);
                return;
            }

            const start =
                blockIndex === startIndex && inlineIndex === anchor.inlineIndex
                    ? anchor.offset
                    : 0;

            const end =
                blockIndex === endIndex && inlineIndex === focus.inlineIndex
                    ? focus.offset
                    : inline.text.length;

            if (end <= start) {
                children.push(inline);
                return;
            }

            const before = inline.text.slice(0, start);
            const selected = inline.text.slice(start, end);
            const after = inline.text.slice(end);

            const newMarks = update(inline.marks);

            if (JSON.stringify(newMarks) !== JSON.stringify(inline.marks)) {
                changed = true;
            }

            if (before) {
                children.push({ ...inline, text: before, marks: [...inline.marks] });
            }

            children.push({ ...inline, text: selected, marks: newMarks });

            if (after) {
                children.push({ ...inline, text: after, marks: [...inline.marks] });
            }
        });

        return { ...block, children };
    });

    if (!changed) return false;

    const newDocument: Document = { ...document, blocks: newBlocks };

    const newAnchor = mapPositionToDocument(document, newDocument, selection.anchor);
    const newFocus = mapPositionToDocument(document, newDocument, selection.focus);

    editor.applyDocument(
        newDocument,
        newAnchor && newFocus ? { anchor: newAnchor, focus: newFocus } : null
    );

    return true;
}

/**
 * Aplica un enlace a la selección. Si ya había uno, lo sustituye.
 * Devuelve false si la URL no es segura, no hay texto seleccionado
 * o el esquema no incluye la marca link.
 */
export function setLink(
    editor: Editor,
    url: string,
    selection: Selection | null = editor.getSelection()
): boolean {
    if (!selection || !editor.getSchema().hasMark("link")) {
        return false;
    }

    const href = sanitizeUrl(url.trim());

    if (href === null) {
        return false;
    }

    return updateMarks(editor, selection, marks => [
        ...marks.filter(mark => mark.type !== "link"),
        { type: "link", attributes: { href } }
    ]);
}

export function removeLink(
    editor: Editor,
    selection: Selection | null = editor.getSelection()
): boolean {
    if (!selection) {
        return false;
    }

    return updateMarks(editor, selection, marks =>
        marks.filter(mark => mark.type !== "link")
    );
}