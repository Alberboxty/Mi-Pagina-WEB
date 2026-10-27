import type { Editor } from "../core/Editor";
import type { Block } from "../model/Block";
import { getOrderedSelection } from "../model/SelectionUtils";

export function toggleList(editor: Editor, ordered: boolean): void {
    if (!editor.getSchema().hasBlock("list-item")) {
        return;
    }

    const document = editor.getDocument();
    const selection = editor.getSelection();

    if (!selection) {
        return;
    }

    const range = getOrderedSelection(document, selection);

    if (!range) {
        return;
    }

    const startIndex = document.blocks.findIndex(b => b.id === range.anchor.blockId);
    const endIndex = document.blocks.findIndex(b => b.id === range.focus.blockId);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
        return;
    }

    const selected = document.blocks.slice(startIndex, endIndex + 1);

    const allSameList = selected.every(
        block =>
            block.type === "list-item" &&
            block.attributes?.ordered === ordered
    );

    const newBlocks = document.blocks.map((block, index): Block => {
        if (index < startIndex || index > endIndex) {
            return block;
        }

        if (allSameList) {
            return { ...block, type: "paragraph", attributes: {} };
        }

        // Conserva el nivel si ya era un ítem de lista.
        const level =
            block.type === "list-item" && typeof block.attributes?.level === "number"
                ? block.attributes.level
                : 0;

        return {
            ...block,
            type: "list-item",
            attributes: { ordered, level }
        };
    });

    // Los ids no cambian, así que la selección sigue siendo válida.
    editor.applyDocument({ ...document, blocks: newBlocks }, selection);
}