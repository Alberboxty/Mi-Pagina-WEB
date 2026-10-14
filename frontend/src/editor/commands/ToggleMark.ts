import type { Editor } from "../core/Editor";
import type { Block } from "../model/Block";
import type { Inline } from "../model/Inline";
import type { Document } from "../model/Document";
import type { Position } from "../model/Selection";

import { getOrderedSelection } from "../model/SelectionUtils";

/**
 * Traduce una posición del documento original a su posición equivalente
 * en el nuevo documento, teniendo en cuenta que un Inline puede haberse
 * dividido en varios fragmentos.
 */
function mapPositionToDocument(
    before: Document,
    after: Document,
    position: Position
): Position | null {
    const beforeBlock = before.blocks.find(
        block => block.id === position.blockId
    );

    if (!beforeBlock) {
        return null;
    }

    const afterBlock = after.blocks.find(
        block => block.id === position.blockId
    );

    if (!afterBlock) {
        return null;
    }

    if (
        !Number.isInteger(position.inlineIndex) ||
        position.inlineIndex < 0 ||
        !Number.isInteger(position.offset) ||
        position.offset < 0
    ) {
        return null;
    }

    const inline = beforeBlock.children[position.inlineIndex];

    if (!inline || position.offset > inline.text.length) {
        return null;
    }

    // Calculamos el desplazamiento absoluto dentro del bloque original.
    let absoluteOffset = position.offset;

    for (let i = 0; i < position.inlineIndex; i++) {
        absoluteOffset += beforeBlock.children[i].text.length;
    }

    // Buscamos el Inline equivalente dentro del nuevo documento.
    let consumed = 0;

    for (let i = 0; i < afterBlock.children.length; i++) {
        const child = afterBlock.children[i];
        const end = consumed + child.text.length;

        if (absoluteOffset <= end) {
            return {
                blockId: afterBlock.id,
                inlineIndex: i,
                offset: absoluteOffset - consumed
            };
        }

        consumed = end;
    }

    // Caso especial: la posición está justo al final del bloque.
    const lastIndex = afterBlock.children.length - 1;

    if (lastIndex >= 0 && absoluteOffset === consumed) {
        return {
            blockId: afterBlock.id,
            inlineIndex: lastIndex,
            offset: afterBlock.children[lastIndex].text.length
        };
    }

    return null;
}

export function toggleMark(
    editor: Editor,
    markType: string
): void {
    const document = editor.getDocument();
    const selection = editor.getSelection();

    if (!selection) {
        return;
    }

    const orderedSelection = getOrderedSelection(
        document,
        selection
    );

    if (!orderedSelection) {
        return;
    }

    const { anchor, focus } = orderedSelection;

    // Una selección contraída no tiene texto que formatear.
    if (
        anchor.blockId === focus.blockId &&
        anchor.inlineIndex === focus.inlineIndex &&
        anchor.offset === focus.offset
    ) {
        return;
    }

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

    // Calculamos qué fragmentos de texto están seleccionados.
    const selectedSegments: Inline[] = [];

    for (
        let blockIndex = startBlockIndex;
        blockIndex <= endBlockIndex;
        blockIndex++
    ) {
        const block = document.blocks[blockIndex];

        const firstInlineIndex =
            blockIndex === startBlockIndex
                ? anchor.inlineIndex
                : 0;

        const lastInlineIndex =
            blockIndex === endBlockIndex
                ? focus.inlineIndex
                : block.children.length - 1;

        for (
            let inlineIndex = firstInlineIndex;
            inlineIndex <= lastInlineIndex;
            inlineIndex++
        ) {
            const inline = block.children[inlineIndex];

            if (!inline) {
                continue;
            }

            const start =
                blockIndex === startBlockIndex &&
                inlineIndex === anchor.inlineIndex
                    ? anchor.offset
                    : 0;

            const end =
                blockIndex === endBlockIndex &&
                inlineIndex === focus.inlineIndex
                    ? focus.offset
                    : inline.text.length;

            if (end > start) {
                selectedSegments.push(inline);
            }
        }
    }

    if (selectedSegments.length === 0) {
        return;
    }

    // Si todos los fragmentos seleccionados tienen la marca,
    // la quitamos. Si alguno no la tiene, la aplicamos a todos.
    const shouldRemoveMark = selectedSegments.every(
        inline => inline.marks.some(
            mark => mark.type === markType
        )
    );

    const transformBlock = (
        block: Block,
        blockIndex: number
    ): Block => {
        const firstInlineIndex =
            blockIndex === startBlockIndex
                ? anchor.inlineIndex
                : 0;

        const lastInlineIndex =
            blockIndex === endBlockIndex
                ? focus.inlineIndex
                : block.children.length - 1;

        const newChildren: Inline[] = [];

        block.children.forEach((inline, inlineIndex) => {
            if (
                inlineIndex < firstInlineIndex ||
                inlineIndex > lastInlineIndex
            ) {
                newChildren.push(inline);
                return;
            }

            const start =
                blockIndex === startBlockIndex &&
                inlineIndex === anchor.inlineIndex
                    ? anchor.offset
                    : 0;

            const end =
                blockIndex === endBlockIndex &&
                inlineIndex === focus.inlineIndex
                    ? focus.offset
                    : inline.text.length;

            if (end <= start) {
                newChildren.push(inline);
                return;
            }

            const beforeText = inline.text.slice(0, start);
            const selectedText = inline.text.slice(start, end);
            const afterText = inline.text.slice(end);

            // Texto anterior a la selección.
            if (beforeText.length > 0) {
                newChildren.push({
                    ...inline,
                    text: beforeText,
                    marks: [...inline.marks]
                });
            }

            // Aplicamos o quitamos la marca al texto seleccionado.
            let selectedMarks = [...inline.marks];

            if (shouldRemoveMark) {
                selectedMarks = selectedMarks.filter(
                    mark => mark.type !== markType
                );
            } else if (
                !selectedMarks.some(
                    mark => mark.type === markType
                )
            ) {
                selectedMarks.push({
                    type: markType
                });
            }

            newChildren.push({
                ...inline,
                text: selectedText,
                marks: selectedMarks
            });

            // Texto posterior a la selección.
            if (afterText.length > 0) {
                newChildren.push({
                    ...inline,
                    text: afterText,
                    marks: [...inline.marks]
                });
            }
        });

        return {
            ...block,
            children: newChildren
        };
    };

    // Construimos el documento nuevo sin modificar el original.
    const newBlocks = document.blocks.map(
        (block, blockIndex) => {
            if (
                blockIndex < startBlockIndex ||
                blockIndex > endBlockIndex
            ) {
                return block;
            }

            return transformBlock(block, blockIndex);
        }
    );

    const newDocument: Document = {
        ...document,
        blocks: newBlocks
    };

    // Restauramos la posición equivalente de ambos extremos.
    // Usamos la selección original para mantener su dirección.
    const newAnchor = mapPositionToDocument(
        document,
        newDocument,
        selection.anchor
    );

    const newFocus = mapPositionToDocument(
        document,
        newDocument,
        selection.focus
    );

    const newSelection =
        newAnchor && newFocus
            ? {
                anchor: newAnchor,
                focus: newFocus
            }
            : null;

    // Documento y selección se aplican en una única transacción.
    // Así History puede guardar y restaurar ambos con undo/redo.
    editor.applyDocument(
        newDocument,
        newSelection
    );
}