import type { Document } from "./Document";
import type { Position, Selection } from "./Selection";

/**
 * Comprueba si la selección está contraída,
 * es decir, si el cursor está en una única posición.
 */
export function isSelectionCollapsed(
    selection: Selection
): boolean {
    return (
        selection.anchor.blockId === selection.focus.blockId &&
        selection.anchor.inlineIndex === selection.focus.inlineIndex &&
        selection.anchor.offset === selection.focus.offset
    );
}

/**
 * Compara dos posiciones según su orden en el documento.
 *
 * Devuelve:
 * - Un número negativo si a está antes que b.
 * - Cero si ambas posiciones son iguales.
 * - Un número positivo si a está después que b.
 *
 * Si alguna posición no es válida, devuelve null.
 */
export function comparePositions(
    document: Document,
    a: Position,
    b: Position
): number | null {
    const blockIndexA = document.blocks.findIndex(
        block => block.id === a.blockId
    );

    const blockIndexB = document.blocks.findIndex(
        block => block.id === b.blockId
    );

    if (blockIndexA === -1 || blockIndexB === -1) {
        return null;
    }

    // Validamos cada posición dentro de su propio bloque.
    const blockA = document.blocks[blockIndexA];
    const blockB = document.blocks[blockIndexB];

    const isValidPosition = (
        position: Position,
        block: typeof blockA
    ): boolean => {
        if (
            !Number.isInteger(position.inlineIndex) ||
            !Number.isInteger(position.offset) ||
            position.inlineIndex < 0 ||
            position.inlineIndex >= block.children.length ||
            position.offset < 0
        ) {
            return false;
        }

        return (
            position.offset <=
            block.children[position.inlineIndex].text.length
        );
    };

    if (
        !isValidPosition(a, blockA) ||
        !isValidPosition(b, blockB)
    ) {
        return null;
    }

    // Primero comparamos la posición de los bloques.
    if (blockIndexA !== blockIndexB) {
        return blockIndexA - blockIndexB;
    }

    // Dentro del mismo bloque, comparamos los Inlines.
    if (a.inlineIndex !== b.inlineIndex) {
        return a.inlineIndex - b.inlineIndex;
    }

    // Dentro del mismo Inline, comparamos los desplazamientos.
    return a.offset - b.offset;
}

/**
 * Devuelve los extremos de la selección en orden documental,
 * independientemente de la dirección en la que se seleccionó.
 *
 * Devuelve null si alguna posición no es válida.
 */
export function getOrderedSelection(
    document: Document,
    selection: Selection
): Selection | null {
    const comparison = comparePositions(
        document,
        selection.anchor,
        selection.focus
    );

    if (comparison === null) {
        return null;
    }

    if (comparison <= 0) {
        return {
            anchor: { ...selection.anchor },
            focus: { ...selection.focus }
        };
    }

    return {
        anchor: { ...selection.focus },
        focus: { ...selection.anchor }
    };
}