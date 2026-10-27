import type { Editor } from "../core/Editor";
import type { Block } from "../model/Block";
import { getOrderedSelection } from "../model/SelectionUtils";

const MIN_LEVEL = 0;
const MAX_LEVEL = 5;

function changeLevel(editor: Editor, delta: 1 | -1): boolean {
    const document = editor.getDocument();
    const selection = editor.getSelection();

    if (!selection) return false;

    const range = getOrderedSelection(document, selection);
    if (!range) return false;

    const start = document.blocks.findIndex(b => b.id === range.anchor.blockId);
    const end = document.blocks.findIndex(b => b.id === range.focus.blockId);

    if (start === -1 || end === -1 || start > end) return false;

    let changed = false;

    const newBlocks = document.blocks.map((block, index): Block => {
        if (index < start || index > end || block.type !== "list-item") {
            return block;
        }

        const current =
            typeof block.attributes?.level === "number" ? block.attributes.level : 0;

        const next = Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, current + delta));

        if (next === current) return block;

        changed = true;

        return { ...block, attributes: { ...block.attributes, level: next } };
    });

    if (!changed) return false;

    editor.applyDocument({ ...document, blocks: newBlocks }, selection);
    return true;
}

/** Devuelve true si cambió algo (para decidir si se consume la tecla Tab). */
export function indent(editor: Editor): boolean {
    return changeLevel(editor, 1);
}

export function outdent(editor: Editor): boolean {
    return changeLevel(editor, -1);
}