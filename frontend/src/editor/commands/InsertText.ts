
import type { Editor } from "../core/Editor";
import type { Block } from "../model/Block";
import type { Inline } from "../model/Inline";
import { getOrderedSelection, isSelectionCollapsed } from "../model/SelectionUtils";

/**
 * Une Inline consecutivos que tengan las mismas marcas.
 * También calcula la posición del cursor después del texto insertado.
 */
function mergeAdjacentInlines(
    inlines: Inline[],
    insertionIndex: number
): {
    children: Inline[];
    cursorInlineIndex: number;
    cursorOffset: number;
} {
    const children: Inline[] = [];

    let cursorInlineIndex = 0;
    let cursorOffset = 0;

    for (let i = 0; i < inlines.length; i++) {
        const inline = inlines[i];
        const previous = children[children.length - 1];
        const isInsertion = i === insertionIndex;

        
        const sameMarks =
            previous !== undefined &&
            JSON.stringify(previous.marks) === JSON.stringify(inline.marks);

        // Mantener separado el prefijo de la inserción.
        if (i < insertionIndex) {
            children.push({
                ...inline,
                marks: [...inline.marks]
            });
            continue;
        }

        if (sameMarks && previous) {
            const previousLength = previous.text.length;

            children[children.length - 1] = {
                ...previous,
                text: previous.text + inline.text,
                marks: [...previous.marks]
            };

            if (isInsertion) {
                cursorInlineIndex = children.length - 1;
                cursorOffset = previousLength + inline.text.length;
            }

            continue;
        }


        // Evita fragmentos vacíos, excepto el Inline de inserción,
        // que puede ser necesario al borrar una selección.
        if (inline.text.length === 0 && !isInsertion) {
            continue;
        }

        children.push({
            ...inline,
            marks: [...inline.marks]
        });

        if (isInsertion) {
            cursorInlineIndex = children.length - 1;
            cursorOffset = inline.text.length;
        }
    }

    return {
        children,
        cursorInlineIndex,
        cursorOffset
    };
}

/**
 * Devuelve el contenido anterior a una posición dentro de un bloque.
 */
function getPrefix(
    block: Block,
    inlineIndex: number,
    offset: number
): Inline[] {
    const result = block.children
        .slice(0, inlineIndex)
        .filter(inline => inline.text.length > 0)
        .map(inline => ({
            ...inline,
            marks: [...inline.marks]
        }));

    const current = block.children[inlineIndex];

    if (current && offset > 0) {
        result.push({
            ...current,
            text: current.text.slice(0, offset),
            marks: [...current.marks]
        });
    }

    return result;
}

/**
 * Devuelve el contenido posterior a una posición dentro de un bloque.
 */
function getSuffix(
    block: Block,
    inlineIndex: number,
    offset: number
): Inline[] {
    const result: Inline[] = [];
    const current = block.children[inlineIndex];

    if (current && offset < current.text.length) {
        result.push({
            ...current,
            text: current.text.slice(offset),
            marks: [...current.marks]
        });
    }

    result.push(
        ...block.children
            .slice(inlineIndex + 1)
            .filter(inline => inline.text.length > 0)
            .map(inline => ({
                ...inline,
                marks: [...inline.marks]
            }))
    );

    return result;
}

export function insertText(editor: Editor, text: string, typing = false): void {
    const document = editor.getDocument();
    const selection = editor.getSelection();

    if (!selection) {
        return;
    }

    const ordered = getOrderedSelection(document, selection);

    if (!ordered) {
        return;
    }

    const collapsed = isSelectionCollapsed(selection);

    if (text.length === 0 && collapsed) {
        return;
    }

    const { anchor, focus } = ordered;

    const startBlockIndex = document.blocks.findIndex(
        block => block.id === anchor.blockId
    );

    const endBlockIndex = document.blocks.findIndex(
        block => block.id === focus.blockId
    );

    if (
        startBlockIndex === -1 ||
        endBlockIndex === -1 ||
        startBlockIndex > endBlockIndex
    ) {
        return;
    }

    const startBlock = document.blocks[startBlockIndex];
    const endBlock = document.blocks[endBlockIndex];

    const insertionInline = startBlock.children[anchor.inlineIndex];

    const focusInline = endBlock.children[focus.inlineIndex];

    if (
        !insertionInline ||
        anchor.offset < 0 ||
        anchor.offset > insertionInline.text.length ||
        !focusInline ||
        focus.offset < 0 ||
        focus.offset > focusInline.text.length
    ) {
        return;
    }

    // El texto insertado hereda el formato de la posición inicial.
    const insertionMarks = [...insertionInline.marks];

    const prefix = getPrefix(
        startBlock,
        anchor.inlineIndex,
        anchor.offset
    );

    const suffix = getSuffix(
        endBlock,
        focus.inlineIndex,
        focus.offset
    );

    // Admite saltos de línea de Windows, Unix y Mac.
    const lines = text.split(/\r\n|\r|\n/);

    const replacementBlocks: Block[] = [];

    let finalBlockId = startBlock.id;
    let finalInlineIndex = 0;
    let finalOffset = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isFirst = i === 0;
        const isLast = i === lines.length - 1;

        const blockId = isFirst
            ? startBlock.id
            : crypto.randomUUID();

        const insertedInline: Inline = {
            text: line,
            marks: [...insertionMarks]
        };

        const rawChildren: Inline[] = [
            ...(isFirst ? prefix : []),
            insertedInline,
            ...(isLast ? suffix : [])
        ];

        // El cursor debe quedar justo después del texto insertado,
        // incluso cuando se fusiona con el Inline anterior.
        const insertionIndex = isFirst ? prefix.length : 0;

        const merged = mergeAdjacentInlines(
            rawChildren,
            insertionIndex
        );

        const newBlock: Block = {
            ...startBlock,
            id: blockId,
            children: merged.children,
            attributes: startBlock.attributes
                ? { ...startBlock.attributes }
                : {}
        };

        replacementBlocks.push(newBlock);

        if (isLast) {
            finalBlockId = blockId;
            finalInlineIndex = merged.cursorInlineIndex;
            finalOffset = merged.cursorOffset;
        }
    }

    const newBlocks = [
        ...document.blocks.slice(0, startBlockIndex),
        ...replacementBlocks,
        ...document.blocks.slice(endBlockIndex + 1)
    ];

    const newSelection = {
        anchor: {
            blockId: finalBlockId,
            inlineIndex: finalInlineIndex,
            offset: finalOffset
        },
        focus: {
            blockId: finalBlockId,
            inlineIndex: finalInlineIndex,
            offset: finalOffset
        }
    };

    const mergeKey =
        typing && collapsed && !/[\r\n]/.test(text)
            ? "typing"
            : undefined;

    editor.applyDocument(
        {
            ...document,
            blocks: newBlocks
        },
        newSelection,
        mergeKey
    );
}
