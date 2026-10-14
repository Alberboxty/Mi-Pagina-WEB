import type { Editor } from "../core/Editor"

export function deleteText(editor: Editor, count: number, direction: "backward" | "forward"): void {
    const document = editor.getDocument();
    const selection = editor.getSelection();

    if (!selection) {
        return;
    }

    const blockId = selection.anchor.blockId;
    const inlineIndex = selection.anchor.inlineIndex;
    // 


    const blockIndex = document.blocks.findIndex(
        block => block.id === blockId
    );

    if (blockIndex === -1) {
        return;
    }

    const block = document.blocks[blockIndex];
    const inline = block.children[inlineIndex];

    if (!inline) {
        return;
    }

    if (
        selection.anchor.blockId === selection.focus.blockId &&
        selection.anchor.inlineIndex === selection.focus.inlineIndex &&
        selection.anchor.offset !== selection.focus.offset
    ) {
        const start = Math.min(
            selection.anchor.offset,
            selection.focus.offset
        );

        const end = Math.max(
            selection.anchor.offset,
            selection.focus.offset
        );

        const newInline = {
            ...inline,
            text:
                inline.text.slice(0, start) +
                inline.text.slice(end)
        }

        const newChildren = [...block.children];

        newChildren[inlineIndex] = newInline;

        const newBlock = {
            ...block,
            children: newChildren
        }

        const newBlocks = [...document.blocks];
        newBlocks[blockIndex] = newBlock;

        const newDocument = {
            ...document,
            blocks: newBlocks
        };

        const newSelection = {
            anchor: {
                blockId,
                inlineIndex,
                offset: start
            },
            focus: {
                blockId,
                inlineIndex,
                offset: start
            }
        }

        editor.applyDocument(newDocument, newSelection);

        return;
    }

    const offset = selection.anchor.offset;

    if (direction === "backward") {
        if (offset === 0) {
            return;
        }

        const start = Math.max(0, offset - count);

        const newInline = {
            ...inline,
            text:
                inline.text.slice(0, start) +
                inline.text.slice(offset)
        }

        const newChildren = [...block.children];

        newChildren[inlineIndex] = newInline;

        const newBlock = {
            ...block,
            children: newChildren
        }

        const newBlocks = [...document.blocks];
        newBlocks[blockIndex] = newBlock;

        const newDocument = {
            ...document,
            blocks: newBlocks
        };

        const newSelection = {
            anchor: {
                blockId,
                inlineIndex,
                offset: start
            },
            focus: {
                blockId,
                inlineIndex,
                offset: start
            }
        }

        editor.applyDocument(newDocument, newSelection);

        return;
    }

    if (direction === "forward") {
        const children = [...block.children];
        const blocks = [...document.blocks];

        const textAfterCursor =
            (inline.text.length - offset) +
            children
                .slice(inlineIndex + 1)
                .reduce((sum, c) => sum + c.text.length, 0);

        const mergeNextBlock = (): boolean => {
            const nextBlock = blocks[blockIndex + 1];
            if (!nextBlock) return false;

            children.push(...nextBlock.children.filter(c => c.text.length > 0));
            blocks.splice(blockIndex + 1, 1);
            return true;
        };

        if (textAfterCursor === 0) {
            // Cursor al final del bloque: solo fusionar (no consume count)
            if (!mergeNextBlock()) return;
        } else {
            let remaining = count;

            // 1. Resto del inline actual
            const take = Math.min(remaining, inline.text.length - offset);

            if (take > 0) {
                const newText =
                    inline.text.slice(0, offset) +
                    inline.text.slice(offset + take);

                if (newText.length === 0) {
                    children.splice(inlineIndex, 1);
                } else {
                    children[inlineIndex] = {
                        ...inline,
                        text: newText
                    };
                }

                remaining -= take;
            }

            // 2. Inlines siguientes; al acabar el bloque, fusionar gratis y seguir
            const next = inlineIndex + 1;

            while (remaining > 0) {
                if (next < children.length) {
                    const cur = children[next];

                    if (cur.text.length <= remaining) {
                        remaining -= cur.text.length;
                        children.splice(next, 1);
                    } else {
                        children[next] = {
                            ...cur,
                            text: cur.text.slice(remaining),
                            marks: [...cur.marks]
                        };
                        remaining = 0;
                    }
                    continue;
                }

                if (!mergeNextBlock()) break;
            }
        }

        blocks[blockIndex] = { ...block, children };

        const pos = { blockId, inlineIndex, offset };

        editor.applyDocument(
            { ...document, blocks },
            { anchor: pos, focus: pos }
        );

        return;
    }
}