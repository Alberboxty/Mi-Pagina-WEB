import type { Editor } from "../core/Editor"
import type { Block } from "../model/Block";

export function splitBlock(editor: Editor): void {
    const document = editor.getDocument();
    const selection = editor.getSelection();

    if (!selection) {
        return;
    }

    const blockId = selection.anchor.blockId;

    const blockIndex = document.blocks.findIndex(
        block => block.id === blockId
    );

    if (blockIndex === -1) {
        return;
    }

    const block = document.blocks[blockIndex];

    const inlineIndex = selection.anchor.inlineIndex;
    const offset = selection.anchor.offset;

    const inline = block.children[inlineIndex];

    if (!inline) {
        return; 
    }

    const textBefore = inline.text.slice(0, offset);
    const textAfter = inline.text.slice(offset);

    const beforeChildren = block.children.slice(0, inlineIndex);

    beforeChildren.push({
        ...inline,
        text: textBefore,
        marks: [...inline.marks]
    });

    const afterChildren = [
        {
            ...inline,
            text: textAfter,
            marks: [...inline.marks]
        },
        ...block.children.slice(inlineIndex + 1)
    ];

    const currentBlock: Block = {
        ...block,
        children: beforeChildren
    };

    const newBlock: Block = {
        id: crypto.randomUUID(),
        type: block.type,
        children: afterChildren,
        attributes: block.attributes
            ? { ...block.attributes }
            : {}
    }

    const newBlocks = [...document.blocks];

    newBlocks[blockIndex] = currentBlock;
    newBlocks.splice(blockIndex + 1, 0, newBlock);

    const newSelection = {
        anchor: { 
            blockId: newBlock.id,
            inlineIndex: 0,
            offset: 0
        },
        focus: {
            blockId: newBlock.id,
            inlineIndex: 0,
            offset: 0
        }
    };

    editor.applyDocument(
        {
            ...document,
            blocks: newBlocks
        },
        newSelection
    );

    console.log("[SplitBlock] Nueva selección:", editor.getSelection());
}