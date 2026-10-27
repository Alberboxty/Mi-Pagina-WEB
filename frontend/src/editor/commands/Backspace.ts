import type { Editor } from "../core/Editor"
import { deleteText } from "./DeleteText";
import { isSelectionCollapsed } from "../model/SelectionUtils";


export function backspace(editor: Editor): void {
    const document = editor.getDocument();
    const selection = editor.getSelection();

    if (!selection) {
        return;
    }

    // Cualquier selección expandida (varios inlines o bloques) se borra
    // con insertText(""), que ya sabe hacerlo.
    if (!isSelectionCollapsed(selection)) {
        editor.commands.insertText("");
        return;
    }

    const blockId = selection.anchor.blockId;
    const blockIndex = document.blocks.findIndex(
        block => block.id === blockId
    );

    if (blockIndex === -1) {
        return;
    }

    const offset = selection.anchor.offset;
    const inlineIndex = selection.anchor.inlineIndex;

    // Backspace al inicio de un ítem de lista: lo convierte en párrafo.
    const listBlock = document.blocks[blockIndex];

    if (
        listBlock.type === "list-item" &&
        offset === 0 &&
        inlineIndex === 0
    ) {
        const listBlocks = [...document.blocks];

        listBlocks[blockIndex] = {
            ...listBlock,
            type: "paragraph",
            attributes: {}
        };

        editor.applyDocument(
            { ...document, blocks: listBlocks },
            selection
        );

        return;
    }

    if(offset === 0 && inlineIndex > 0) {
        const block = document.blocks[blockIndex];
        const previousInline = block.children[inlineIndex - 1];

        const newPreviousInline = {
            ...previousInline,
            text: previousInline.text.slice(0, -1),
            marks: [...previousInline.marks]    
        };

        const newChildren = [...block.children];

        if (newPreviousInline.text.length === 0) {
            newChildren.splice(inlineIndex - 1, 1);
        } else {
            newChildren[inlineIndex - 1] = newPreviousInline;
        }

        const newBlocks = [...document.blocks];

        newBlocks[blockIndex] = {
            ...block,
            children: newChildren
        };

        const newInlineIndex =
            newPreviousInline.text.length === 0
                ? inlineIndex - 1
                : inlineIndex - 1;

        const newOffset =
            newPreviousInline.text.length === 0
                ? 0
                : newPreviousInline.text.length;

        editor.applyDocument(
            {
                ...document,
                blocks: newBlocks
            },
            {
                anchor: {
                    blockId: block.id,
                    inlineIndex: newInlineIndex,
                    offset: newOffset
                },
                focus: {
                    blockId: block.id,
                    inlineIndex: newInlineIndex,
                    offset: newOffset
                }
            }
        );

        return;

    }

    if(offset === 0 && blockIndex > 0) {
        const previousBlock = document.blocks[blockIndex - 1];
        const currentBlock = document.blocks[blockIndex];

        const previousChildren = [...previousBlock.children];
        const currentChildren = currentBlock.children.filter(
            child => child.text.length > 0
        );

        const newPreviousBlock = {
            ...previousBlock,
            children: [
                ...previousChildren,
                ...currentChildren
            ]
        };

        const newBlocks = [...document.blocks];

        newBlocks[blockIndex - 1] = newPreviousBlock;
        newBlocks.splice(blockIndex, 1);

        const cursorInlineIndex = previousChildren.length - 1;
        const cursorInline = previousChildren[cursorInlineIndex];

        editor.applyDocument(
            {
                ...document,
                blocks: newBlocks
            },
            {
                anchor: {
                    blockId: previousBlock.id,
                    inlineIndex: cursorInlineIndex,
                    offset: cursorInline?.text.length ?? 0
                },
                focus: {
                    blockId: previousBlock.id,
                    inlineIndex: cursorInlineIndex,
                    offset: cursorInline?.text.length ?? 0
                }
            }
        );

        return;

    }

    deleteText(editor, 1, "backward");

}